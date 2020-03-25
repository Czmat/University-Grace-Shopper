import React, { useEffect, useState } from "react"
import address from "../address"

const Checkout = ({ order, cart }) => {
  const handleAddress = async e => {
    let verifiedAddress = await address(e).catch(err => console.log(err))
    console.log(verifiedAddress, "address")
  }

  console.log(cart, "cart")
  if (!order) {
    order = {
      id: "1",
      test: "test"
    }
  }

  const saveAddress = () => {
    return true
  }
  return (
    <div key={order.id}>
      <h2>Checkout</h2>
      <li>Order {order.id} </li>
      <h1></h1>
      <form onSubmit={handleAddress}>
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="State" />
        <input placeholder="Zip" />
        <button type="submit">submit</button>
      </form>
      <input type="checkbox" name="address" value="save" />
      <label htmlFor="address">Add to address book</label>
    </div>
  )
}

export default Checkout

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
