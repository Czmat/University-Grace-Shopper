const express = require("express")
const app = express()
const path = require("path")
const db = require("./db")
const models = db.models
const bodyParser = require("body-parser")

app.use("/dist", express.static(path.join(__dirname, "dist")))
app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use(express.json())

const isLoggedIn = (req, res, next) => {
  //console.log('isLI', req.user);
  if (!req.user) {
    const error = Error("not Authorized")
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

const isBlocked = (req, res, next) => {
  //console.log(req.user.isBlocked, 'isBlocked wow');
  if (req.user.isBlocked === true) {
    //throw new Error(' You are Blocked for life');
    const error = Error(" You are Blocked for life")
    error.status = 401
    return next(error)
  }
  next()
}

app.use((req, res, next) => {
  const token = req.headers.authorization
  //console.log('under isAdmin');

  if (!token) {
    // console.log('under no token');
    return next()
  }
  db.findUserFromToken(token)
    .then(auth => {
      //console.log('find', auth);
      req.user = auth
      next()
    })
    .catch(ex => {
      const error = Error("NOT authorized")
      error.status = 401
      next(error)
    })
})

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
)

//api request with credentials
app.post("/api/auth", (req, res, next) => {
  //console.log(req.body, 'credentials auth in post');
  db.authenticate(req.body)
    .then(token => {
      // console.log(token, 'return token');
      res.send({ token })
    })
    .catch(() => {
      const error = Error("noT authorized")
      error.status = 401
      next(error)
    })
})

//validating password change
app.post("/api/auth/validate", (req, res, next) => {
  //console.log('validate post', req.body);
  db.authenticate(req.body)
    .then(token => {
      //console.log(token, 'return token');
      res.send({ token })
    })
    .catch(() => {
      const error = Error("Incorrect password")
      error.status = 401
      next(error)
    })
})

//exchanging token
app.get("/api/auth", isLoggedIn, isBlocked, (req, res, next) => {
  //console.log('isLoggedIn and is Blocked', isLoggedIn, req.user);
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
  console.log(req, "my users")
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
  //console.log(req.body, 'post addToSave');
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

//creating user account { username, firstname, lastname, password, role, email }
app.post("/api/user", (req, res, next) => {
  //console.log(req.body);
  db.models.users
    .create(req.body)
    .then(user => res.send(user))
    .catch(next)
})

//updating profile with put
app.put("/api/user/:id", (req, res, next) => {
  db.updateUser(req.body)
    .then(updatedUser => res.send(updatedUser))
    .catch(next)
})

//updating profile with put
app.put("/api/manage/user/:id", (req, res, next) => {
  //console.log(req.body, 'app. put');
  db.manageUser(req.body)
    .then(managedUser => res.send(managedUser))
    .catch(next)
})

//change password
app.put("/api/user/password/:id", (req, res, next) => {
  //console.log('changePass put', req.body);
  db.changePassword(req.body)
    .then(response => res.send(response))
    .catch(next)
})

//update cart total amount
app.put(`/api/cart/total/:id`, (req, res, next) => {
  db.updateCartTotal(req.body)
    .then(response => res.send(response))
    .catch(next);
});

//get post put delete promos
app.get("/api/promos", (req, res, next) => {
  db.readPromos()
    .then(promos => {
      console.log(promos)
      res.send(promos)
    })
    .catch(next)
})

app.post("/api/promos", (req, res, next) => {
  //console.log(req.body);
  db.createPromo(req.body)
    .then(promo => res.send(promo))
    .catch(next)
})

app.put("/api/promos/:id", (req, res, next) => {
  console.log("req.body in put", req.body)
  db.updatePromo(req.body)
    .then(promo => res.send(promo))
    .catch(next)
})

app.delete("/api/promos/:id", (req, res, next) => {
  db.removePromo()
    .then(() => res.sendStatus(204))
    .catch(next)
})

Object.keys(models).forEach(key => {
  console.log(key)
  app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .read({ user: req.user })
      .then(items => {
        //console.log(items, 'read users');
        res.send(items)
      })
      .catch(next)
  })
  app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .create({ user: req.user })
      .then(items => {
        //console.log(items, 'create users');
        res.send(items)
      })
      .catch(next)
  })
})

//getting the cart and all the items

app.get("/checkout/:id", (req, res, next) => {
  // console.log(req.params)
  db.getCheckoutCart(req.params.id)
    .then(response => console.log(response))
    .catch(next)
  //res.send(console.log(req, "my backend stuff"))
})

//posting the new rating
app.post("/api/postRating/:id/:rating", (req, res, next) => {
  db.changeProductRating(req.params.id, req.params.rating)
    .then(response => res.send(response))
    .catch(next)
})

//post for the saved addresses
app.post("/api/address/:id", (req, res, next) => {
  console.log(req.body)
  db.addAddress(
    req.params.id,
    req.body[0][0],
    req.body[0][1],
    req.body[0][2],
    req.body[0][3]
  )
    .then(response => res.send(response))
    .catch(next)
})

//get for saved addresses
app.get("/api/address/:id", (req, res, next) => {
  db.getAddress(req.params.id).then(response => res.send(response))
})
app.get("/api/addressid/:id", (req, res, next) => {
  db.getAddressId(req.params.id).then(response => res.send(response))
})

app.delete("/api/addresses/:id", (req, res, next) => {
  db.deleteAddress(req.params.id).then(response => res.sendStatus(400))
})

//will make sure the get requests work with the router
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
