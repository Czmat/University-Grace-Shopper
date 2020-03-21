const client = require("../client")

const lineItems = {
  read: async () => {
    return (await client.query('SELECT * from "lineItems"')).rows
  },
  create: async ({ orderId, productId }) => {
    const SQL = `INSERT INTO "lineItems" ("orderId", "productId") values($1, $2) returning *`
    return (await client.query(SQL, [orderId, productId])).rows[0]
  }
}

module.exports = lineItems
