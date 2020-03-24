import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import qs from "qs"
import Checkout from "./components/Checkout"

const Orders = ({
  cartItems,
  orders,
  products,
  params,
  setOrders,
  auth,
  cart
}) => {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          const mapCartItems = cartItems.filter(
            cartItem => cartItem.orderId === order.id
          )
          return (
            <Router key={order.id}>
              <li>
                <Link
                  to="/checkout"
                  onClick={e => {
                    order.status = "checkout"
                    setOrders([...orders])
                  }}
                >
                  {" "}
                  OrderID: {order.id.slice(0, 4)}
                </Link>
                {/* <div>
                <a
                href={`#${qs.stringify({ view: "checkout" })}`}
                className={params.view === "checkout" ? "selected" : ""}
                onClick={e => {
                  order.status = "checkout"
                  setOrders([...orders])
                }}
                >
                OrderID: {order.id.slice(0, 4)}
                </a>
              </div> */}
                <ul>
                  {mapCartItems.map(cartItem => {
                    const product = products.find(
                      product => product.id === cartItem.productId
                    )
                    return (
                      <li key={cartItem.id}>
                        {product && product.name}
                        <span className="quantity">
                          Quantity: {cartItem.quantity}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <Switch>
                <Route path="/checkout">
                  <Checkout
                    cartItems={cartItems}
                    products={products}
                    orders={orders}
                    params={params}
                    auth={auth}
                    cart={cart}
                  />{" "}
                  */
                </Route>
              </Switch>
            </Router>
          )
        })}
      </ul>
    </div>
  )
}
// function Child() {
//   // We can use the `useParams` hook here to access
//   // the dynamic pieces of the URL.
//   let { id } = useParams()

//   return (
//     <Checkout
//       cartItems={cartItems}
//       products={products}
//       orders={orders}
//       params={params}
//       auth={auth}
//     />
//   )
// }

export default Orders
