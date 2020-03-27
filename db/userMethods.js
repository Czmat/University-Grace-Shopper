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
  //find cart order Id for the user
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
  // if saveforlater lineitem exists then add quantity to it from cart lineitem quantity
  // and remove lineitem from cart
  // and then return updated save lineItem back
  if (saveResponse.rows.length) {
    saveLineItem = saveResponse.rows[0];

    saveLineItem.quantity = saveLineItem.quantity + cartLineItem.quantity;
    await removeFromCart({ userId: userId, lineItemId: cartLineItem.id });
    // await client.query(
    //   `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    //   [cartLineItem.id, cart.id]
    // );
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

  // const saveLineItem = await client.query(
  //   `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
  //   [saveForLater.id, productId]
  // );

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
  //console.log(cartResponse.rows.length, "cartResp.lenght")

  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];

    //console.log(cartLineItem, 'cartlineitem');
    cartLineItem.quantity += Number(saveLineItem.quantity);
    await removeFromSave({ userId: userId, lineItemId: saveLineItem.id });
    // if (saveResponse.rows.length) {
    //   console.log(saveLineItem, 'savelineItem');

    // }

    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
      )
    ).rows[0];
  } else {
    // if (saveResponse.rows.length) {
    //   saveLineItem = saveResponse.rows[0];
    //   console.log('wow');
    //   await removeFromCart({ userId: userId, lineItemId: saveLineItem.id });
    // }

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
      cart.id,
    ])
  ).rows[0];
};

const addToCart = async ({ productId, userId, lineItemQuantity }) => {
  //console.log(lineItemQuantity);
  //get cart oderId for the user
  const cart = await getCart(userId);
  //console.log(cart);
  const cartResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );

  // const saveForLater = await getSaveForLater(userId);
  // const saveResponse = await client.query(
  //   `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
  //   [saveForLater.id, productId]
  // );
  // let saveLineItem;

  let cartLineItem;
  //if product in the cart changes quantity
  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];
    //console.log(lineItem);
    cartLineItem.quantity += Number(lineItemQuantity);

    // if (saveResponse.rows.length) {
    //   saveLineItem = saveResponse.rows[0];
    //   await removeFromCart({ userId: userId, lineItemId: saveLineItem.id });
    // }

    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
      )
    ).rows[0];
  } else {
    //else if new product is added
    // if (saveResponse.rows.length) {
    //   saveLineItem = saveResponse.rows[0];
    //   await removeFromCart({ userId: userId, lineItemId: saveLineItem.id });
    // }
    return (
      await client.query(
        `INSERT INTO "lineItems"("productId", "orderId", quantity) values ($1, $2, $3) returning *`,
        [productId, cart.id, lineItemQuantity]
      )
    ).rows[0];
  }
};

const changeQtyInCart = async ({ productId, userId, lineItemQuantity }) => {
  //console.log(lineItemQuantity);
  //get cart oderId for the user
  const cart = await getCart(userId);
  //console.log(cart);
  const cartResponse = await client.query(
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );
  let cartLineItem;
  //if product in the cart changes quantity
  if (cartResponse.rows.length) {
    cartLineItem = cartResponse.rows[0];
    //console.log(lineItem);
    cartLineItem.quantity = Number(lineItemQuantity);
    return (
      await client.query(
        `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning *`,
        [cartLineItem.quantity, cartLineItem.id]
      )
    ).rows[0];
  }
  // else {
  //   //else if new product is added
  //   return (
  //     await client.query(
  //       `INSERT INTO "lineItems"("productId", "orderId", quantity) values ($1, $2, $3) returning *`,
  //       [productId, cart.id, lineItemQuantity]
  //     )
  //   ).rows[0];
  // }
};

const removeFromCart = async ({ lineItemId, userId }) => {
  const cart = await getCart(userId);
  await client.query(
    `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    [lineItemId, cart.id]
  );
};

const getProductDetail = async productId => {
  return (await client.query(`SELECT * FROM products WHERE id=$1`, [productId]))
    .rows[0];
};

//updateUser from profile
const updateUser = async ({ id, username, firstname, lastname, email }) => {
  //console.log({ id, username, firstname, lastname, email });
  return (
    await client.query(
      `UPDATE "users" set username=$1, firstname=$2, lastname=$3, email=$4 WHERE id = $5 returning *`,
      [username, firstname, lastname, email, id]
    )
  ).rows[0];
};

//updateUser from profile
const manageUser = async ({ id, isBlocked }) => {
  //console.log({ id, username, firstname, lastname, email });
  return (
    await client.query(
      `UPDATE "users" set "isBlocked"=$1 WHERE id = $2 returning *`,
      [isBlocked, id]
    )
  ).rows[0];
};

//changePassword
const changePassword = async ({ id, password }) => {
  console.log(password, id);
  return (
    await client.query(
      `UPDATE "users" set password=$1 WHERE id = $2 returning *`,
      [await hash(password), id]
    )
  ).rows[0];
};

const getLineItems = async userId => {
  const SQL = `
    SELECT "lineItems".*
    FROM "lineItems"
    JOIN orders
    ON orders.id = "lineItems"."orderId"
    WHERE orders."userId" = $1
  `;
  //console.log((await client.query(SQL, [userId])).rows, 'getlineItem');
  return (await client.query(SQL, [userId])).rows;
};

const getCheckoutCart = async userId => {
  console.log(userId);
  const response = await client.query(
    `SELECT * FROM orders WHERE status='checkout' and "userId"=$1`,
    [userId]
  );
  console.log(response.rows[0], 'my test for the checkout');
  return response.rows[0];
};
const changeProductRating = async (productId, rating) => {
  const response = await client.query(
    `UPDATE products set rating = $2 where id = $1 returning * `,
    [productId, rating]
  );
  return response.rows[0];
};

const getAddress = async userID => {
  const response = await client.query(
    `
  SELECT * FROM addresses WHERE "userId" = $1`,
    [userID]
<<<<<<< HEAD
  )
  return response.rows
}
const addAddress = async (userID, street, city, state, zip) => {
  const SQL = `INSERT INTO addresses ("userId", street, city, state, zip) values ($1, $2, $3, $4, $5) returning *`
  const response = await client.query(SQL, [userID, street, city, state, zip])
  return response.rows[0]
}

const deleteAddress = async id => {
  const response = await client.query(`DELETE FROM addresses WHERE id = $1`, [
    id
  ])
  return response.rows[0]
}
=======
  );
  return response.rows;
};
const addAddress = async (userID, address) => {
  const SQL = `INSERT INTO addresses ("userId", address) values ($1, $2) returning *`;
  const response = await client.query(SQL, [userID, address]);
  return response.rows[0];
};
>>>>>>> master

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
  // getProductRating,
  changeProductRating,
  updateUser,
  changePassword,
  manageUser,
  getAddress,
  addAddress,
<<<<<<< HEAD
  deleteAddress,
  changeProductRating
}
=======
  changeProductRating,
};
>>>>>>> master
