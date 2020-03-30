const client = require("./client")
const faker = require("faker")

const { authenticate, compare, findUserFromToken, hash } = require("./auth")

const models = ({ products, users, orders, lineItems } = require("./models"))

const fakeProduct = faker.commerce.product()

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
  getCheckoutCart,
  changeProductRating,
  updateUser,
  changePassword,
  manageUser,
  getAddress,
  addAddress,
  deleteAddress,
  getAddressId,
  readPromos,
  createPromo,
  updatePromo,

  removePromo,
  updateCartTotal,
  getCartTotal
} = require("./userMethods")

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS promos;
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS addresses;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;


    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      firstname VARCHAR(100) NOT NULL UNIQUE,
      lastname VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      email VARCHAR(100) NOT NULL UNIQUE,
      "isBlocked" BOOLEAN default false,
      CHECK (char_length(username) > 0)
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL NOT NULL,
      details VARCHAR DEFAULT 'great product',
      image VARCHAR,
      quantity INTEGER DEFAULT 2,
      rating INT,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      address VARCHAR,
      total INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE addresses(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      street VARCHAR NOT NULL,
      city VARCHAR NOT NULL,
      state VARCHAR NOT NULL,
      zip INT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1
    );
    CREATE TABLE promos(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(10) NOT NULL UNIQUE,
      discount INTEGER NOT NULL,
      "isActive" BOOLEAN default false,
      "isDollar" BOOLEAN default false,
      "userId" UUID REFERENCES users(id),
      text VARCHAR(100),
      CHECK (char_length(name) > 0)
    );
  `
  await client.query(SQL)

  const getProducts = amount => {
    let products = []
    for (let i = 0; i < amount; i++) {
      let prodName = faker.commerce.productName()
      let price = faker.commerce.price(0.99, 20.0, 2)
      let text = faker.lorem.sentence(5)
      let rating = faker.random.number({ min: 1, max: 5 })
      let img = faker.image.imageUrl(300, 300, "business", true)
      let newProd = {
        name: prodName,
        price: price,
        details: text,
        rating: rating,
        image: img,
        quantity: 2
      }
      products.push(newProd)
    }
    return products
  }

  const _users = {
    lucy: {
      username: "lucy",
      firstname: "Lucy",
      lastname: "Anabell",
      password: "LUCY",
      role: "ADMIN",
      email: "lucy@gmail.com"
    },
    moe: {
      username: "moe",
      firstname: "moe",
      lastname: "Shmoe",
      password: "MOE",
      email: "moe@gmail.com"
    },
    curly: {
      username: "larry",
      firstname: "larry",
      lastname: "Doe",
      password: "LARRY",
      role: null,
      email: "larry@gmail.com"
    }
  }

  const _products = getProducts(5)

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map(user => users.create(user))
  )
  const [foo, bar, bazz] = await Promise.all(
    Object.values(_products).map(product => {
      products.create(product)
    })
  )

  //creating promos
  const [tenPercent, twentyPercent] = await Promise.all([
    createPromo({
      name: "summer",
      discount: 10,
      isActive: false,
      isDollar: false,
      text: "Summer promo"
    }),
    createPromo({
      name: "david",
      discount: 20,
      isActive: false,
      isDollar: false,
      text: "corona virus promo"
    })
  ])

  const _orders = {
    moe: {
      userId: moe.id
    },
    lucy: {
      userId: lucy.id
    }
  }

  // const promoMap = (await readPromos()).reduce((acc, promo) => {
  //   acc[promo.name] = promo;
  //   return acc;
  // }, {});
  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user
    return acc
  }, {})
  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product
    return acc
  }, {})

  //console.log(userMap, productMap);
  return {
    users: userMap,
    products: productMap
  }
}

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
  getCheckoutCart,
  changeProductRating,
  updateUser,
  changePassword,
  manageUser,
  getAddress,
  addAddress,
  getAddressId,
  deleteAddress,
  readPromos,
  createPromo,
  updatePromo,
  removePromo,
  updateCartTotal,
  getCartTotal
}
