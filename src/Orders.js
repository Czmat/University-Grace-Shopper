import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom"
import axios from "axios"
import Checkout from "./components/Checkout"
import StarRating from "./components/StarRating"

const Orders = ({ cartItems, products, auth }) => {
  const [orders, setOrders] = useState([])
  const link = "orders"

  const headers = () => {
    const token = window.localStorage.getItem("token")
    return {
      headers: {
        authorization: token
      }
    }
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      if (auth.id) {
        axios.get("/api/getOrders", headers()).then(response => {
          setOrders(response.data)
        })
      }
    } else {
      return null
    }
    return () => (mounted = false)
  }, [])

  const submitCheckout = order => {
    window.localStorage.setItem("orderdetails", JSON.stringify(order))

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
              <Link to="/orderdetails" order={order}>
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
