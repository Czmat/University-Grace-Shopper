import React, { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import qs from "qs"
import Header from "../Header"

const Checkout = ({ cartItems, order, products, params, auth, cart }) => {
  console.log(order)
  return (
    <div>
      <h2>Checkout</h2>
      <div key={order.id}>
        <li>Order {order.id} </li>
        <h1>Order Summary</h1>
        <form>
          1 Shipping Address
          <input />
          Name <input />
          Address
          <input />
          City
          <input />
          State <input />
          Zip <input />
          Phone <input />
          Country
          <input type="checkbox" name="address" value="save" />
          <label htmlFor="address">Add to address book</label>
          <button>Submit</button>
        </form>
      </div>
      ) } })}
    </div>
  )
}

export default Checkout

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
