import React, { useEffect, useState } from "react"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
  useHistory
} from "react-router-dom"
import address from "../address"
import axios from "axios"
import CheckoutPromoForm from "../checkout/CheckoutPromoForm"
import Orders from "../Orders"

const Checkout = ({
  cart,
  auth,
  updateCartTotal,
  promos,
  lineItems,
  createOrder
}) => {
  const [totalIncludesPromo, setTotalIncludesPromo] = useState()
  const [save, setSave] = useState(false)
  const [userSavedAddress, setUserSavedAddress] = useState([])
  const [userAddress, setUserAddress] = useState([])
  const [products, setProducts] = useState([])
  const [lineItems, setLineItems] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  let history = useHistory()
  const checkoutOrder = JSON.parse(window.localStorage.getItem("checkoutorder"))
  const headers = () => {
    const token = window.localStorage.getItem("token")
    return {
      headers: {
        authorization: token
      }
    }
  }

  const checkoutOrder = JSON.parse(window.localStorage.getItem("checkoutorder"))

  const cartStuff = JSON.parse(window.localStorage.getItem("cartItems"))
  //console.log(cartItems)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      axios
        .get("/api/products")
        .then(response => setProducts(response.data))
        .then(
          axios
            .get("api/getLineItems", headers())
            .then(response => setLineItems(response.data))
        )
        .then(
          cartStuff.map(cart => {
            axios
              .get(`/api/product/${cart.productId}`)
              .then(response => console.log("ye-"))
          })
        )
    } else {
      return null
    }
    return () => (mounted = false)
  }, [])

  useEffect(() => {
    if (auth.id) {
      axios
        .get(`/api/address/${auth.id}/`)
        .then(response => setUserSavedAddress(response.data))
    }
  }, [])

  const saveAddress = () => {
    save === true ? setSave(false) : setSave(true)
  }

  const handleSubmit = e => {
    e.preventDefault()
    let street = e.target[1].value
    let city = e.target[2].value
    let state = e.target[3].value
    let zip = e.target[4].value
    const fullAddress = [street, city, state, zip]
    if (save === true) {
      console.log(auth.id)
      axios
        .post(`/api/address/${auth.id}/`, [fullAddress])
        .then(response => setUserSavedAddress(response.data))
    }
    setIsSubmitted(true)
    createOrder()

    history.push("/orders")
  }

  const findCartTotal = () => {
    let cartTotal = 0
    lineItems
      .filter(lineItem => lineItem.orderId === cart.id)
      .forEach(lineItem => {
        const product = products.find(
          product => product.id === lineItem.productId
        )
        cartTotal += Number(product.price * lineItem.quantity)
        // console.log(cartTotal);
      })
    return cartTotal.toFixed(2)
  }

  const handleAddress = e => {
    axios
      .get(`/api/addressid/${e.target.value}/`)
      .then(response => setUserAddress(response.data))
  }

  //to set latest total to total includes promo
  useEffect(() => {
    setTotalIncludesPromo(cart.total)
  }, [cart, lineItems])

  console.log(cart.total, "in checkout outside cart.total")
  console.log(totalIncludesPromo, "in checkout outside totalInPromo")

  return (
    <div className="cart-container">
      <h2>Your cart total: ${findCartTotal()}</h2>

      {lineItems
        .filter(lineItem => lineItem.orderId === cart.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          )
          return (
            <div key={lineItem.id}>
              <div>{product && product.name}</div>
              <div>${Number(product.price).toFixed(2)}</div>
              <span>Qty: {lineItem.quantity}</span>
            </div>
          )
        })}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        {userSavedAddress ? (
          <div>
            <label htmlFor="saved">Choose a Saved Address </label>
            <select id="saved" onChange={handleAddress}>
              <option> </option>
              {userSavedAddress ? (
                userSavedAddress.map(mapAddress => {
                  return (
                    <option key={mapAddress.id} value={mapAddress.id}>
                      {mapAddress.street}
                    </option>
                  )
                })
              ) : (
                <div>:hi</div>
              )}
            </select>
          </div>
        ) : null}
        <input placeholder="Street" value={userAddress.street} />
        <input placeholder="City" value={userAddress.city} />
        <input placeholder="State" value={userAddress.state} />
        <input placeholder="Zip" value={userAddress.zip} />
        <button type="submit">submit</button>
      </form>

      <input
        type="checkbox"
        name="address"
        value="save"
        onClick={saveAddress}
      />
      <label htmlFor="address">Add to address book</label>
      <hr />
      <CheckoutPromoForm
        cart={cart}
        updateCartTotal={updateCartTotal}
        promos={promos}
        totalIncludesPromo={totalIncludesPromo}
        setTotalIncludesPromo={setTotalIncludesPromo}
      />
      <TotalAmount
        cart={cart}
        updateCartTotal={updateCartTotal}
        promos={promos}
        totalIncludesPromo={totalIncludesPromo}
        setTotalIncludesPromo={setTotalIncludesPromo}
        createOrder={createOrder}
        lineItems={lineItems}
      />
    </div>
  )
}

//           )
//         })}
//         </div>
//     </div>
//   )
// }

export default Checkout

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
