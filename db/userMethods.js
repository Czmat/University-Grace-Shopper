const client = require('./client');
const { hash } = require('./auth');

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
  const saveForLater = await getSaveForLater(userId);
  const cart = await getCart(userId);
  //filter  lineItems with cart orderId for the product
  const cartLineItem = (
    await client.query(
      `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
      [cart.id, productId]
    )
  ).rows[0];
  //filter  lineItems with save orderId for the product
  const saveResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [saveForLater.id, productId]
  );
  let saveLineItem;
  if (saveResponse.rows.length) {
    saveLineItem = saveResponse.rows[0];
    saveLineItem.quantity = saveLineItem.quantity + cartLineItem.quantity;
    await removeFromCart({ userId: userId, lineItemId: cartLineItem.id });
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [saveLineItem.quantity, saveLineItem.id]
      )
    ).rows[0];
  } else {
    // or if no save lineItem, update cart lineItem with save orderId and return
    return (
      await client.query(
        `UPDATE "lineItems" set "orderId"=$1 WHERE id = $2 returning *`,
        [saveForLater.id, cartLineItem.id]
      )
    ).rows[0];
  }
};

const addBackToCart = async ({ productId, userId, lineItemQuantity }) => {
  const saveForLater = await getSaveForLater(userId);
  const cart = await getCart(userId);

  const saveResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [saveForLater.id, productId]
  );
  let saveLineItem;
  saveLineItem = saveResponse.rows[0];
  const cartResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );

  let cartLineItem;

  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];
    cartLineItem.quantity += Number(saveLineItem.quantity);
    await removeFromSave({ userId: userId, lineItemId: saveLineItem.id });
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
      )
    ).rows[0];
  } else {
    return (
      await client.query(
        `UPDATE "lineItems" set "orderId"=$1 WHERE id = $2 returning *`,
        [cart.id, saveLineItem.id]
      )
    ).rows[0];
  }
};

const removeFromSave = async ({ lineItemId, userId }) => {
  const saveForLater = await getSaveForLater(userId);

  await client.query(
    `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    [lineItemId, saveForLater.id]
  );
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
      cart.id
    ])
  ).rows[0];
};

const addToCart = async ({ productId, userId, lineItemQuantity }) => {
  const cart = await getCart(userId);
  const cartResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );

  let cartLineItem;
  //if product in the cart changes quantity
  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];
    cartLineItem.quantity += Number(lineItemQuantity);
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
      )
    ).rows[0];
  } else {
    return (
      await client.query(
        `INSERT INTO "lineItems"("productId", "orderId", quantity) values ($1, $2, $3) returning *`,
        [productId, cart.id, lineItemQuantity]
      )
    ).rows[0];
  }
};

const changeQtyInCart = async ({ productId, userId, lineItemQuantity }) => {
  const cart = await getCart(userId);
  const cartResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );
  let cartLineItem;
  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];
    cartLineItem.quantity = Number(lineItemQuantity);
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
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

//product detail
const getProductDetail = async productId => {
  return (await client.query(`SELECT * FROM products WHERE id=$1`, [productId]))
    .rows[0];
};

const updateProductDetail = async ({ id, quantity }) => {
  return (
    await client.query(
      `UPDATE "products" set quantity=$1 WHERE id = $2 returning *`,
      [quantity, id]
    )
  ).rows[0];
};

//updateUser from profile
const updateUser = async ({ id, username, firstname, lastname, email }) => {
  return (
    await client.query(
      `UPDATE "users" set username=$1, firstname=$2, lastname=$3, email=$4 WHERE id = $5 returning *`,
      [username, firstname, lastname, email, id]
    )
  ).rows[0];
};

//updateUser from profile
const manageUser = async ({ id, isBlocked }) => {
  console.log(id, isBlocked, 'sql man user');
  return (
    await client.query(
      `UPDATE "users" set "isBlocked"=$1 WHERE id = $2 returning *`,
      [isBlocked, id]
    )
  ).rows[0];
};

//changePassword
const changePassword = async ({ id, password }) => {
  return (
    await client.query(
      `UPDATE "users" set password=$1 WHERE id = $2 returning *`,
      [await hash(password), id]
    )
  ).rows[0];
};

//update and get cart total amount
const updateCartTotal = async ({ id, total }) => {
  console.log(id, total, 'sql update cart total');
  return (
    await client.query(
      `UPDATE "orders" set total=$1 WHERE id = $2 returning *`,
      [total, id]
    )
  ).rows[0];
};

const getCartTotal = async cartId => {
  return (await client.query(`SELECT * FROM orders WHERE id=$1`, [id])).rows[0];
};

//get promos
const readPromos = async () => {
  return (await client.query('SELECT * FROM promos')).rows;
};

//create promo
const createPromo = async ({
  name,
  discount,
  isActive,
  isDollar,
  text,
  userId
}) => {
  return (
    await client.query(
      `INSERT INTO promos(name, discount, "isActive", "isDollar", text, "userId") values ($1, $2, $3, $4, $5, $6) returning *`,
      [name, discount, isActive, isDollar, text || null, userId || null]
    )
  ).rows[0];
};

//update promo
const updatePromo = async ({
  name,
  discount,
  isActive,
  isDollar,
  userId,
  text,
  id
}) => {
  return (
    await client.query(
      'UPDATE promos set name=$1, discount=$2, "isActive"=$3, "isDollar"=$4, "userId"=$5, text=$6 WHERE id = $7 returning *',
      [name, discount, isActive || false, isDollar, userId, text, id]
    )
  ).rows[0];
};

//delete promo
const removePromo = async ({ id }) => {
  const cart = await getCart(userId);
  await client.query('DELETE FROM promos WHERE id=$1', [id]);
};

const getLineItems = async userId => {
  const SQL = `
    SELECT "lineItems".*
    FROM "lineItems"
    JOIN orders
    ON orders.id = "lineItems"."orderId"
    WHERE orders."userId" = $1
  `;
  return (await client.query(SQL, [userId])).rows;
};

const getCheckoutCart = async userId => {
  const response = await client.query(
    `SELECT * FROM orders WHERE status='checkout' and "userId"=$1`,
    [userId]
  );
  return response.rows[0];
};
const changeProductRating = async (productId, rating) => {
  console.log(productId, rating, 'in db methods');
  const response = await client.query(
    `UPDATE products set rating = $2 where id = $1 returning * `,
    [productId, rating]
  );
  console.log(response.rows);
  return response.rows[0];
};

const getAddress = async userID => {
  const response = await client.query(
    `
  SELECT * FROM addresses WHERE "userId" = $1`,
    [userID]
  );
  return response.rows;
};

const getAddressId = async id => {
  const response = await client.query(
    `
  SELECT * FROM addresses WHERE id = $1`,
    [id]
  );
  return response.rows;
};
const addAddress = async (userID, street, city, state, zip) => {
  const SQL = `INSERT INTO addresses ("userId", street, city, state, zip) values ($1, $2, $3, $4, $5) returning *`;
  const response = await client.query(SQL, [userID, street, city, state, zip]);

  return response.rows[0];
};

const deleteAddress = async id => {
  const response = await client.query(`DELETE FROM addresses WHERE id = $1`, [
    id
  ]);
  return response.rows[0];
};

module.exports = {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  getCheckoutCart,
  getSaveForLater,
  addToSaveForLater,
  addBackToCart,
  removeFromSave,
  changeQtyInCart,
  getProductDetail,
  changeProductRating,
  updateUser,
  changePassword,
  manageUser,
  getAddress,
  addAddress,
  deleteAddress,
  getAddressId,
  changeProductRating,
  readPromos,
  createPromo,
  updatePromo,
  removePromo,
  updateCartTotal,
  getCartTotal,
  updateProductDetail
};
