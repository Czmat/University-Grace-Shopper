const client = require('./client');
const faker = require('faker');

const { authenticate, compare, findUserFromToken, hash } = require('./auth');

const models = ({ products, users, orders, lineItems } = require('./models'));

const fakeProduct = faker.commerce.product();

const {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  getSaveForLater,
  addToSaveForLater,
  addBackToCart,
  removeFromSave,
  changeQtyInCart,
  getProductDetail,
} = require('./userMethods');

const sync = async () => {
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
      details VARCHAR DEFAULT 'great product',
      image VARCHAR,
      quantity INTEGER DEFAULT 2,
      rating VARCHAR,
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
      role: 'ADMIN',
    },
    moe: {
      username: 'moe',
      password: 'MOE',
      role: null,
    },
    curly: {
      username: 'larry',
      password: 'LARRY',
      role: null,
    },
  };

  const _products = {
    fakeProduct: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },
    bar: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },
    bazz: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },
    quq: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },
    qq: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },

    zz: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      details:
        faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial(),
      image: faker.random.image(),
      quantity: 3,
      rating: 3,
    },
  };

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map(user => users.create(user))
  );
  const [foo, bar, bazz] = await Promise.all(
    Object.values(_products).map(product => {
      products.create(product);
    })
  );

  const _orders = {
    moe: {
      userId: moe.id,
    },
    lucy: {
      userId: lucy.id,
    },
  };

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});
  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {});
  //console.log(userMap, productMap);
  return {
    users: userMap,
    products: productMap,
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  getSaveForLater,
  addToSaveForLater,
  addBackToCart,
  removeFromSave,
  changeQtyInCart,
  getProductDetail,
};
