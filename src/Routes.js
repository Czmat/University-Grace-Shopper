import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import App from "./App"
import qs from "qs"
import axios from "axios"
import Login from "./Login"
import Orders from "./Orders"
import Cart from "./Cart"
import Products from "./Products"
import Account from "./components/Account"
import Mycart from "./components/Mycart"
import ProductDetail from "./components/ProductDetail"

import SaveForLater from "./components/SaveForLater"
import Checkout from "./components/Checkout"

const Routes = ({
  lineItems,
  removeFromCart,
  cart,
  auth,
  createOrder,
  products,
  addToCart,
  saveForLater,
  addToSaveForLater,
  isSubmitted,
  setIsSubmitted,
  getProductDetail,
  productDetail
}) => {
  const userCart = lineItems.filter(lineItem => lineItem.orderId === cart.id)

  let totalQty = 0
  const count = userCart.forEach(item => {
    totalQty += item.quantity
  })
  if (!auth.id) {
    return (
      <Router>
        <div>
          <nav className="header-container">
            <Link to="/">
              <h1 className="header-name">Grace Shopper</h1>
            </Link>
            <ul className="nav-bar">
              <li></li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fas fa-shopping-bag"></i>
                  <span>{totalQty}</span>
                </Link>
                <Link to="/checkout"></Link>
              </li>
            </ul>
          </nav>
        </div>
        <Switch>
          <Route path="/" exact>
            <div className="horizontal">
              <Products
                addToCart={addToCart}
                products={products}
                getProductDetail={getProductDetail}
              />
              <ProductDetail
                addToCart={addToCart}
                products={products}
                productDetail={productDetail}
              />
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
          </Route>
          <Route path="/cart">
            <Mycart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
              addToCart={addToCart}
              saveForLater={saveForLater}
              addToSaveForLater={addToSaveForLater}
              removeFromSave={removeFromSave}
              changeQtyInCart={changeQtyInCart}
              addBackToCart={addBackToCart}
              getProductDetail={getProductDetail}
            />
          </Route>
        </Switch>
      </Router>
    )
  } else {
    return (
      <Router>
        <div>
          <nav className="header-container">
            <Link to="/">
              <div>
                <h1 className="header-name">Grace Shopper</h1>
              </div>
            </Link>
            <ul className="nav-bar">
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fas fa-shopping-bag"></i>
                  <span>{totalQty}</span>
                </Link>
              </li>
            </ul>
            <button onClick={logout}>Logout {auth.username} </button>
          </nav>
          <Link to="/products"></Link>
        </div>
        <Switch>
          <Route path="/" exact>
            <div className="horizontal">
              <Products
                addToCart={addToCart}
                products={products}
                getProductDetail={getProductDetail}
              />
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
          </Route>
          <Route path="/products">
            <Products
              addToCart={addToCart}
              products={products}
              getProductDetail={getProductDetail}
            />
          </Route>
          <Route path="/account">
            <Account auth={auth} logout={logout} />
          </Route>
          <Route path="/cart">
            <Mycart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
              addToCart={addToCart}
              saveForLater={saveForLater}
              addToSaveForLater={addToSaveForLater}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
            />
          </Route>
          <Route path="/orders">
            <Orders
              cartItems={lineItems}
              products={products}
              orders={orders}
              cart={cart}
            />
          </Route>
          <Route path="/checkout">
            <Checkout
              cartItems={lineItems}
              products={products}
              setOrders={setOrders}
              auth={auth}
              cart={cart}
            />
          </Route>
          <Route path="/productDetails">
            <ProductDetail
              cartItems={lineItems}
              products={products}
              orders={orders}
              productDetail={productDetail}
              addToCart={addToCart}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}
export default Routes
