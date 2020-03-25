const express = require("express")
const app = express()
const path = require("path")
const db = require("./db")
const models = db.models

app.use("/dist", express.static(path.join(__dirname, "dist")))
app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use(express.json())

const isLoggedIn = (req, res, next) => {
  //console.log('isLI', req.user);
  if (!req.user) {
    const error = Error("not authorized")
    error.status = 401
    return next(error)
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(Error("not authorized"))
  }
  next()
}

app.use((req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return next()
  }
  db.findUserFromToken(token)
    .then(auth => {
      // console.log('find', req.user, auth);
      req.user = auth
      next()
    })
    .catch(ex => {
      const error = Error("not authorized")
      error.status = 401
      next(error)
    })
})

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
)

app.post("/api/auth", (req, res, next) => {
  // console.log(req.body, 'auth in post');
  db.authenticate(req.body)
    .then(token => res.send({ token }))
    .catch(() => {
      const error = Error("not authorized")
      error.status = 401
      next(error)
    })
})

app.get("/api/auth", isLoggedIn, (req, res, next) => {
  //console.log('isLoggedIn', isLoggedIn, req.user);
  res.send(req.user)
})

app.get("/api/getCart", (req, res, next) => {
  db.getCart(req.user.id)
    .then(cart => res.send(cart))
    .catch(next)
})

app.get("/api/getSaveForLater", (req, res, next) => {
  db.getSaveForLater(req.user.id)
    .then(cart => res.send(cart))
    .catch(next)
})

app.get("/api/getOrders", (req, res, next) => {
  db.getOrders(req.user.id)
    .then(orders => res.send(orders))
    .catch(next)
})

app.post("/api/createOrder", (req, res, next) => {
  db.createOrder(req.user.id)
    .then(order => res.send(order))
    .catch(next)
})

app.get("/api/getLineItems", (req, res, next) => {
  db.getLineItems(req.user.id)
    .then(lineItems => res.send(lineItems))
    .catch(next)
})

app.get("/api/products/:id", (req, res, next) => {
  db.getProductDetail(req.params.id)
    .then(productDetail => res.send(productDetail))
    .catch(next)
})

app.post("/api/addToCart", (req, res, next) => {
  //console.log(req.body);
  db.addToCart({
    userId: req.user.id,
    productId: req.body.productId,
    lineItemQuantity: req.body.quantity
  })
    .then(lineItem => res.send(lineItem))
    .catch(next)
})

app.post("/api/addBackToCart", (req, res, next) => {
  //console.log(req.body);
  db.addBackToCart({
    userId: req.user.id,
    productId: req.body.productId,
    lineItemQuantity: req.body.quantity
  })
    .then(lineItem => res.send(lineItem))
    .catch(next)
})

app.post("/api/changeQtyInCart", (req, res, next) => {
  //console.log(req.body);
  db.changeQtyInCart({
    userId: req.user.id,
    productId: req.body.productId,
    lineItemQuantity: req.body.quantity
  })
    .then(lineItem => res.send(lineItem))
    .catch(next)
})

app.post("/api/addToSaveForLater", (req, res, next) => {
  console.log(req.body, "post addToSave")
  db.addToSaveForLater({
    userId: req.user.id,
    productId: req.body.productId
  })
    .then(lineItem => res.send(lineItem))
    .catch(next)
})

app.delete("/api/removeFromCart/:id", (req, res, next) => {
  db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
    .then(() => res.sendStatus(204))
    .catch(next)
})

app.delete("/api/removeFromSave/:id", (req, res, next) => {
  db.removeFromSave({ userId: req.user.id, lineItemId: req.params.id })
    .then(() => res.sendStatus(204))
    .catch(next)
})

app.get("/api/products", (req, res, next) => {
  db.models.products
    .read()
    .then(products => res.send(products))
    .catch(next)
})

Object.keys(models).forEach(key => {
  //console.log(key);
  app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .read({ user: req.user })
      .then(items => res.send(items))
      .catch(next)
  })
  app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .create({ user: req.user })
      .then(items => res.send(items))
      .catch(next)
  })
})

//getting the cart and all the items

app.get("/checkout/:id", (req, res, next) => {
  // console.log(req.params)
  db.getCheckoutCart(req.params.id).then(response => console.log(response))
  //res.send(console.log(req, "my backend stuff"))
})

//posting the new rating
app.post("/api/postRating/:id/:rating", (req, res, next) => {
  db.changeProductRating(req.params.id, req.params.rating)
    .then(response => res.send(response))
    .catch(next)
})
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.use((req, res, next) => {
  const error = {
    message: `page not found ${req.url} for ${req.method}`,
    status: 404
  }
  next(error)
})

app.use((err, req, res, next) => {
  console.log(err.status)
  res.status(err.status || 500).send({ message: err.message })
})

module.exports = app
