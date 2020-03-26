import React, { useEffect, useState } from "react"
import address from "../address"
import axios from "axios"

const Checkout = ({ cart, auth }) => {
  const [save, setSave] = useState(false)

  const Checkedout = () => {
    return <div>Checked out!</div>
  }
  console.log(auth.id)
  const handleSubmit = async e => {
    e.preventDefault()

    let street = e.target[0].value
    let city = e.target[1].value
    let state = e.target[2].value
    let zip = e.target[3].value
    const fullAddress = street + " " + city + " " + state + " " + zip

    if (save === true) {
      axios
        .post(`/api/address/${auth.id}/${fullAddress}`)
        .then(response => console.log(response, "response"))
    }
  }

  const checkoutOrder = JSON.parse(window.localStorage.getItem("checkoutorder"))

  // // const handleSubmit = e => {
  //   e.preventDefault()
  //   cons
  // }

  const saveAddress = () => {
    save === true ? setSave(false) : setSave(true)
  }

  //const handleChange

  return (
    <div key={checkoutOrder.id}>
      <h2>Checkout</h2>
      <li>Order {checkoutOrder.id.slice(0, 4)} </li>
      <h1></h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="State" />
        <input placeholder="Zip" />
        <button type="submit">submit</button>
      </form>
      <input
        type="checkbox"
        name="address"
        value="save"
        onClick={saveAddress}
      />
      <label htmlFor="address">Add to address book</label>
    </div>
  )
}

export default Checkout

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
