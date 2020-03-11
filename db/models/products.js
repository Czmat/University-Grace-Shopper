const client = require('../client');

const products = {
  read: async()=> {
    return (await client.query('SELECT * from products')).rows;
  },
  create: async({ name, price })=> {
    const SQL = `INSERT INTO products(name, price) values($1, $2) returning *`;
    return (await client.query(SQL, [name, price ])).rows[0];
  },
};

module.exports = products;
