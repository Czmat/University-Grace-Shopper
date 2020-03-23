const client = require('./client');

const getSaveForLater = async userId => {
  const response = await client.query(
    `SELECT * FROM orders WHERE status='SAVE' and "userId"=$1`,
    [userId]
  );
  if (response.rows.length) {
    return response.rows[0];
  }
  return (
    await client.query(
      'INSERT INTO orders ("userId", status) values ($1, $2) returning *',
      [userId, 'SAVE']
    )
  ).rows[0];
};

const addToSaveForLater = async ({ productId, userId }) => {
  console.log(productId);
  const saveForLater = await getSaveForLater(userId);
  const cart = await getCart(userId);
  console.log(saveForLater, 'getsaveforlater');
  console.log(cart, 'getcart');
  const cartLineItem = (
    await client.query(
      `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
      [cart.id, productId]
    )
  ).rows[0];

  const saveResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [saveForLater.id, productId]
  );
  let saveLineItem;
  if (saveResponse.rows.length) {
    saveLineItem = saveResponse.rows[0];

    // console.log(saveLineItem, 'savelineitem');
    // console.log(cartLineItem, 'cartlineitem');

    saveLineItem.quantity = saveLineItem.quantity + cartLineItem.quantity;
    await removeFromCart();
    await client.query(
      `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
      [cartLineItem.id, cart.id]
    );
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [saveLineItem.quantity, saveLineItem.id]
      )
    ).rows[0];
  } else {
    return (
      await client.query(
        `UPDATE "lineItems" set "orderId"=$1 WHERE id = $2 returning *`,
        [saveForLater.id, cartLineItem.id]
      )
    ).rows[0];
  }
};

const addBackToCart = async ({ productId, userId, lineItemQuantity }) => {
  //console.log(lineItemQuantity);
  const saveForLater = await getSaveForLater(userId);
  const cart = await getCart(userId);
  //console.log(saveForLater);
  const lineItem = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [saveForLater.id, productId]
  ).rows[0];

  //console.log(lineItem);

  return (
    await client.query(
      `UPDATE "lineItems" set "orderId"=$1 WHERE id = $2 returning *`,
      [cart.id, lineItem.id]
    )
  ).rows[0];
};

const getCart = async userId => {
  const response = await client.query(
    `SELECT * FROM orders WHERE status='CART' and "userId"=$1`,
    [userId]
  );
  if (response.rows.length) {
    return response.rows[0];
  }
  return (
    await client.query(
      'INSERT INTO orders ("userId") values ($1) returning *',
      [userId]
    )
  ).rows[0];
};

const getOrders = async userId => {
  return (
    await client.query(
      `SELECT * FROM orders WHERE status <> 'CART' and "userId"=$1`,
      [userId]
    )
  ).rows;
};

const createOrder = async userId => {
  const cart = await getCart(userId);
  cart.status = 'ORDER';
  return (
    await client.query(`UPDATE orders SET status=$1 WHERE id=$2 returning *`, [
      'ORDER',
      cart.id,
    ])
  ).rows[0];
};

const addToCart = async ({ productId, userId, lineItemQuantity }) => {
  //console.log(lineItemQuantity);
  const cart = await getCart(userId);
  //console.log(cart);
  const response = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );
  let lineItem;
  //if product in the cart changes quantity
  if (response.rows.length) {
    lineItem = response.rows[0];
    //console.log(lineItem);
    lineItem.quantity = lineItemQuantity;
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [lineItem.quantity, lineItem.id]
      )
    ).rows[0];
  } else {
    //else if new product is added
    return (
      await client.query(
        `INSERT INTO "lineItems"("productId", "orderId", quantity) values ($1, $2, $3) returning *`,
        [productId, cart.id, lineItemQuantity]
      )
    ).rows[0];
  }
};

const removeFromCart = async ({ lineItemId, userId }) => {
  const cart = await getCart(userId);
  await client.query(
    `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    [lineItemId, cart.id]
  );
};

const getLineItems = async userId => {
  const SQL = `
    SELECT "lineItems".*
    FROM "lineItems"
    JOIN orders
    ON orders.id = "lineItems"."orderId"
    WHERE orders."userId" = $1
  `;
  console.log((await client.query(SQL, [userId])).rows, 'getlineItem');
  return (await client.query(SQL, [userId])).rows;
};

module.exports = {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  getSaveForLater,
  addToSaveForLater,
  addBackToCart,
};
