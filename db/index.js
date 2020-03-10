const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/university_grace_hopper');

const { authenticate, compare, findUserFromToken, hash } = require('./auth')(client);

client.connect();

const sync = async()=> {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      CHECK (char_length(username) > 0)
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL NOT NULL,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1
    );
  `;
  await client.query(SQL);

  const _users = {
    lucy: {
      username: 'lucy',
      password: 'LUCY',
      role: 'ADMIN'
    },
    moe: {
      username: 'moe',
      password: 'MOE',
      role: null
    },
    curly: {
      username: 'larry',
      password: 'LARRY',
      role: null
    },
  };

  const _products = {
    foo: {
      name: 'foo',
      price: 2
    },
    bar: {
      name: 'bar',
      price: 2
    },
    bazz: {
      name: 'bazz',
      price: 2.50
    },
    quq: {
      name: 'quq',
      price: 11.99 
    }
  };
  const [lucy, moe] = await Promise.all(Object.values(_users).map( user => users.create(user)));
  const [foo, bar, bazz] = await Promise.all(Object.values(_products).map( product => products.create(product)));

  const _orders = {
    moe: {
      userId: moe.id
    },
    lucy: {
      userId: lucy.id
    }
  };

  const userMap = (await users.read()).reduce((acc, user)=> {
    acc[user.username] = user;
    return acc;
  }, {});
  const productMap = (await products.read()).reduce((acc, product)=> {
    acc[product.name] = product;
    return acc;
  }, {});
  return {
    users: userMap,
    products: productMap
  };
};

const products = {
  read: async()=> {
    return (await client.query('SELECT * from products')).rows;
  },
  create: async({ name, price })=> {
    const SQL = `INSERT INTO products(name, price) values($1, $2) returning *`;
    return (await client.query(SQL, [name, price ])).rows[0];
  },
};

const users = {
  read: async()=> {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async({ username, password, role })=> {
    const SQL = `INSERT INTO users(username, password, role) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [username, await hash(password), role])).rows[0];
  },
};

const orders = {
  read: async()=> {
    return (await client.query('SELECT * from orders')).rows;
  },
  create: async({ userId })=> {
    console.log(user);
    const SQL = `INSERT INTO orders("userId") values($1) returning *`;
    return (await client.query(SQL, [userId])).rows[0];
  },
};

const lineItems = {
  read: async()=> {
    return (await client.query('SELECT * from "lineItems"')).rows;
  },
  create: async({ orderId, productId })=> {
    const SQL = `INSERT INTO "lineItems" ("orderId", "productId") values($1, $2) returning *`;
    return (await client.query(SQL, [orderId, productId])).rows[0];
  },
};

const getCart = async(userId)=> {
  const response = await client.query(`SELECT * FROM orders WHERE status='CART' and "userId"=$1`, [userId]); 
  if(response.rows.length){
    return response.rows[0]; 
  }
  return (await client.query('INSERT INTO orders ("userId") values ($1) returning *', [ userId])).rows[0];
};

const getOrders = async(userId)=> {
  return (await client.query(`SELECT * FROM orders WHERE status <> 'CART' and "userId"=$1`, [userId])).rows; 
};

const createOrder = async(userId)=> {
  const cart = await getCart(userId);
  cart.status = 'ORDER';
  return (await client.query(`UPDATE orders SET status=$1 WHERE id=$2 returning *`, [ 'ORDER', cart.id ])).rows[0];
};

const addToCart = async({ productId, userId })=> {
  const cart = await getCart(userId);
  const response = await client.query(`SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`, [ cart.id, productId ]);
  let lineItem;
  if(response.rows.length){
    lineItem = response.rows[0];
    lineItem.quantity++;
    return (await client.query(`UPDATE "lineItems" set quantity=$1 WHERE "orderId" = $2 returning *`, [ lineItem.quantity, cart.id ])).rows[0];
  }
  else {
    return (await client.query(`INSERT INTO "lineItems"("productId", "orderId") values ($1, $2) returning *`, [ productId, cart.id])).rows[0];
  }
};

const removeFromCart = async({ lineItemId, userId })=> {
  const cart = await getCart(userId);
  console.log(lineItemId, userId);

  await client.query(`DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`, [ lineItemId, cart.id ]);
};

const getLineItems = async(userId)=> {
  const SQL = `
    SELECT "lineItems".* 
    FROM "lineItems"
    JOIN orders
    ON orders.id = "lineItems"."orderId" 
    WHERE orders."userId" = $1
  `;
  return ( await client.query(SQL, [ userId ])).rows;
};


const models = {
  users,
  products,
  orders,
  lineItems
};

module.exports = {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  sync,
  models,
  authenticate,
  findUserFromToken
};
