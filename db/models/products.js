const client = require('../client');

const products = {
  read: async () => {
    return (await client.query('SELECT * from products')).rows;
  },
  create: async ({ name, price, details, image, quantity, rating }) => {
    const SQL = `INSERT INTO products(name, price, details, image, quantity, rating) values($1, $2, $3, $4, $5, $6) returning *`;
    return (
      await client.query(SQL, [name, price, details, image, quantity, rating])
    ).rows[0];
  },
};

module.exports = products;
