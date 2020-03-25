import React from "react"
import SaveForLater from "./SaveForLater"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const Mycart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  productDetail,
  addToCart,
  saveForLater,
  addToSaveForLater,
  removeFromSave,
  changeQtyInCart,
  addBackToCart,
  params,
  getProductDetail
}) => {
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

  return (
    <div className="cart-container">
      <h2>Your cart total: ${findCartTotal()}</h2>
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button>
      {lineItems
        .filter(lineItem => lineItem.orderId === cart.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          )
          return (
            <div key={lineItem.id} className="product-card">
              <button onClick={() => removeFromCart(lineItem.id)}>x</button>
              <div>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  <img src={product.image}></img>
                </Link>
              </div>
              <div>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  <h4>{product && product.name}</h4>
                </Link>
              </div>
              <div className="">
                <div>Description of a product</div>
                <p>{product.details}</p>
                <span>Qty:{lineItem.quantity}</span>
                <select
                  defaultValue={lineItem.quantity}
                  onChange={e => {
                    //console.log(e.target.value);
                    e.target.value === "0"
                      ? removeFromCart(lineItem.id)
                      : changeQtyInCart(product.id, e.target.value)
                  }}
                >
                  <option value={0}>0 (delete)</option>
                  {numArr.map(num => {
                    return (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    )
                  })}
                </select>
                <i>|</i>
                <input
                  type="submit"
                  value="Save for later"
                  onClick={e => {
                    //e.preventDefault();
                    addToSaveForLater(product.id)
                    //removeFromCart(lineItem.id);
                  }}
                ></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          )
        })}

      <hr></hr>
      <SaveForLater
        lineItems={lineItems}
        removeFromCart={removeFromCart}
        cart={cart}
        createOrder={createOrder}
        products={products}
        addToCart={addToCart}
        saveForLater={saveForLater}
        addToSaveForLater={addToSaveForLater}
        removeFromSave={removeFromSave}
        addBackToCart={addBackToCart}
        getProductDetail={getProductDetail}
        params={params}
      />
    </div>
  )
}

{
  /* <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
<button
  disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
  onClick={createOrder}
>
  Create Order
</button>
<ul>
  {lineItems
    .filter(lineItem => lineItem.orderId === cart.id)
    .map(lineItem => {
      const product = products.find(
        product => product.id === lineItem.productId
      );
      return (
        <li key={lineItem.id}>
          {product && product.name}{' '}
          <span className="quantity">Quantity: {lineItem.quantity}</span>
          <button onClick={() => removeFromCart(lineItem.id)}>
            Remove From Cart
          </button>
        </li>
      );
    })}
</ul> */
}

export default Mycart
