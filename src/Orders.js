import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom"
import qs from "qs"
import Checkout from "./components/Checkout"
import StarRating from "./components/StarRating"

const Orders = ({
  cartItems,
  orders,
  products,
  params,
  setOrders,
  auth,
  cart,
  order,
  setOrder
}) => {
  const link = "orders"

  const submitCheckout = order => {
    window.localStorage.setItem("checkoutorder", JSON.stringify(order))
    // setOrder(order)
  }

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          const mapCartItems = cartItems.filter(
            cartItem => cartItem.orderId === order.id
          )

          return (
            <div key={order.id}>
              <Link to="/checkout" onClick={() => submitCheckout(order)}>
                OrderID: {order.id.slice(0, 4)}
              </Link>
              <ul>
                {mapCartItems.map(cartItem => {
                  const product = products.find(
                    product => product.id === cartItem.productId
                  )
                  return (
                    <li key={cartItem.id}>
                      {product && product.name}
                      <div>
                        <StarRating link={link} product={product} />
                      </div>
                      <span className="quantity">
                        Quantity: {cartItem.quantity}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
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
