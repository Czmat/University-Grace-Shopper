const client = require("../client")

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows
  },
  create: async ({ name, price, details, image, quantity }) => {
    const SQL = `INSERT INTO products(name, price, details, image, quantity) values($1, $2, $3, $4, $5) returning *`
    return (await client.query(SQL, [name, price, details, image, quantity]))
      .rows[0]
  }
}

module.exports = products
