const client = require("./client")

const getCart = async userId => {
  const response = await client.query(
    `SELECT * FROM orders WHERE status='CART' and "userId"=$1`,
    [userId]
  )
  if (response.rows.length) {
    return response.rows[0]
  }
  return (
    await client.query(
      'INSERT INTO orders ("userId") values ($1) returning *',
      [userId]
    )
  ).rows[0]
}

const getOrders = async userId => {
  return (
    await client.query(
      `SELECT * FROM orders WHERE status <> 'CART' and "userId"=$1`,
      [userId]
    )
  ).rows
}

const createOrder = async userId => {
  const cart = await getCart(userId)
  cart.status = "ORDER"
  return (
    await client.query(`UPDATE orders SET status=$1 WHERE id=$2 returning *`, [
      "ORDER",
      cart.id
    ])
  ).rows[0]
}

const addToCart = async ({ productId, userId, lineItemQuantity }) => {
  //console.log(lineItemQuantity);
  const cart = await getCart(userId)
  const response = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  )
  let lineItem
  if (response.rows.length) {
    lineItem = response.rows[0]
    console.log(lineItem)
    lineItem.quantity = lineItemQuantity
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [lineItem.quantity, lineItem.id]
      )
    ).rows[0]
  } else {
    return (
      await client.query(
        `INSERT INTO "lineItems"("productId", "orderId") values ($1, $2) returning *`,
        [productId, cart.id]
      )
    ).rows[0]
  }
}

const removeFromCart = async ({ lineItemId, userId }) => {
  const cart = await getCart(userId)
  await client.query(
    `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    [lineItemId, cart.id]
  )
}

const getLineItems = async userId => {
  const SQL = `
    SELECT "lineItems".*
    FROM "lineItems"
    JOIN orders
    ON orders.id = "lineItems"."orderId"
    WHERE orders."userId" = $1
  `
  return (await client.query(SQL, [userId])).rows
}

module.exports = {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems
}
