const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const models = db.models;

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

const isLoggedIn = (req, res, next)=> {
  if(!req.user){
    return next(Error('not authorized'));
  }
  next();
};

app.use((req, res, next)=> {
  const token = req.headers.authorization;
  if(!token){
    return next();
  }
  db.findUserFromToken(token)
    .then( auth => {
      req.user = auth;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));


app.post('/api/auth', (req, res, next)=> {
  db.authenticate(req.body)
    .then( token => res.send({ token }))
    .catch( next );
});

app.get('/api/auth', isLoggedIn, (req, res, next)=> {
  res.send(req.user);
});

app.get('/api/getCart', (req, res, next)=> {
  db.getCart(req.user.id)
    .then( cart => res.send(cart))
    .catch( next );
});

app.get('/api/getOrders', (req, res, next)=> {
  db.getOrders(req.user.id)
    .then( orders => res.send(orders))
    .catch( next );
});

app.post('/api/createOrder', (req, res, next)=> {
  db.createOrder(req.user.id)
    .then( order => res.send(order))
    .catch( next );
});

app.get('/api/getLineItems', (req, res, next)=> {
  db.getLineItems(req.user.id)
    .then( lineItems => res.send(lineItems))
    .catch( next );
});

app.post('/api/addToCart', (req, res, next)=> {
  db.addToCart({ userId: req.user.id, productId: req.body.productId })
    .then( lineItem => res.send(lineItem))
    .catch( next );
});

app.delete('/api/removeFromCart/:id', (req, res, next)=> {
  db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
    .then( () => res.sendStatus(204))
    .catch( next );
});


Object.keys(models).forEach( key => {
  app.get(`/api/${key}`, (req, res, next)=> {
    models[key].read({ user: req.user })
      .then( items => res.send(items))
      .catch(next);
  });
  app.post(`/api/${key}`, (req, res, next)=> {
    models[key].create({ user: req.user })
      .then( items => res.send(items))
      .catch(next);
  });
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send({ message: err.message });
});

module.exports = app;

