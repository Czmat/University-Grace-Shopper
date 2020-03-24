import React, { useEffect, useState } from "react"
import qs from "qs"

const Checkout = ({ order, lineItems, orders, products, params }) => {
  console.log(lineItems, "in checout")
  return (
    <div>
      <h2>Checkout</h2>
      {orders.map(order => {
        if (order.status === "checkout") {
          return (
            <div key={order.id}>
              <li>Order {order.id.slice(0, 4)} </li>
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
          )
        }
      })}

      {/* {orders.map(order => {
        const _lineItems = lineItems.filter(
          lineItem => lineItem.orderId === order.id
        )

        console.log(params)
        return (
          <div>
            <li key={order.id}>
              <div>
                {" "}
                <a
                  href={`#${qs.stringify({ view: "checkout" })}`}
                  className={params.view === "checkout" ? "selected" : ""}
                  onClick={e => {
                    //console.log('clicked');
                  }}
                >
                  OrderID: {order.id.slice(0, 4)}
                </a>
              </div>
              <ul>
                {_lineItems.map(lineItem => {
                  const product = products.find(
                    product => product.id === lineItem.productId
                  )
                  return (
                    <li key={lineItem.id}>
                      {product && product.name}
                      <span className="quantity">
                        Quantity: {lineItem.quantity}
                      </span>
                    </li>
                  )
                })}
      //         </ul>
      //       </li> */}
    </div>
  )
}

export default Checkout

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
