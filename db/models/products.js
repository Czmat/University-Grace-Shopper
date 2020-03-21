const client = require("../client")

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows
  },
  create: async ({ name, price, details, image }) => {
    const SQL = `INSERT INTO products(name, price, details, image) values($1, $2, $3, $4) returning *`
    return (await client.query(SQL, [name, price, details, image])).rows[0]
  }
}

module.exports = products
