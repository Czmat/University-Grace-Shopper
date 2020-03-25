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
  setIsSubmitted,
  isSubmitted
}) => {
  const [checkoutOrder, setCheckoutOrder] = useState()
  const link = "orders"

  const submitCheckout = e => {
    e.preventDefault()
    console.log(checkoutOrder)
  }

  // const Checkout = () => {
  //   return (
  //     <li key={order.id}>
  //       OrderID: {order.id.slice(0, 4)}
  //       <ul>
  //         {mapCartItems.map(cartItem => {
  //           const product = products.find(
  //             product => product.id === cartItem.productId
  //           )
  //           return (
  //             <li key={cartItem.id}>
  //               {product && product.name}
  //               <div>
  //                 <StarRating />
  //               </div>
  //               <span className="quantity">Quantity: {cartItem.quantity}</span>
  //             </li>
  //           )
  //         })}
  //         <form onClick={submitCheckout}>
  //           <button
  //             onClick={e => {
  //               order.status != "checkout"
  //                 ? (order.status = "checkout")
  //                 : (order.status = "ORDER")
  //               setCheckoutOrder([order])
  //               setIsSubmitted(true)
  //             }}
  //           >
  //             Checkout
  //           </button>
  //           )}
  //         </form>
  //       </ul>
  //     </li>
  //   )
  // }

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          const mapCartItems = cartItems.filter(
            cartItem => cartItem.orderId === order.id
          )

          if (order.status != "checkout") {
            return (
              <li key={order.id}>
                {/* <button
                  onClick={() => {
                    order.status != "checkout"
                      ? (order.status = "checkout")
                      : (order.status = "ORDER")
                    setCheckoutOrder(order)
                  }}
                > */}
                {/* </button> */}
                <Link to="/checkout">OrderID: {order.id.slice(0, 4)}</Link>
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
              </li>
            )
          } else {
            return (
              <div key={order.id}>
                <Checkout order={checkoutOrder} cart={cart} />
              </div>
            )
          }
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
