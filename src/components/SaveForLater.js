import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"

const SavedForLater = ({
  lineItems,
  cart,
  createOrder,
  removeFromSave,
  products,
  addToCart,
  saveForLater,
  addToSaveForLater,
  addBackToCart,
  params,
  getProductDetail
}) => {
  const userSave = lineItems.filter(
    lineItem => lineItem.orderId === saveForLater.id
  )

  return (
    <div className="cart-container">
      <h2>Saved for later ({userSave.length})</h2>
      {lineItems
        .filter(lineItem => lineItem.orderId === saveForLater.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          )
          return (
            <div key={lineItem.id} className="product-card">
              <button onClick={() => removeFromSave(lineItem.id)}>x</button>
              <div>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  <img src={product.image}></img>
                </Link>
              </div>
              <div>
                <h4>
                  <Link
                    to="/productDetails"
                    onClick={() => getProductDetail(product.id)}
                  >
                    {product && product.name}
                  </Link>
                </h4>
              </div>
              <div className="">
                <input
                  type="submit"
                  value="Move to cart"
                  onClick={e => {
                    e.preventDefault()
                    //console.log(product, 'product', lineItem, 'lineitem');
                    addToCart(lineItem.productId, lineItem.quantity)
                    removeFromSave(lineItem.id)

                    //removeFromSave(lineItem.id);
                    //removeFromCart(lineItem.id);
                  }}
                ></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default SavedForLater
