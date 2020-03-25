import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"

const Products = ({ products, addToCart, getProductDetail }) => {
  const [productQty, setProductQty] = useState(1)

  return (
    <div className="products-box">
      <h2>Products</h2>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id} className="products">
              <Link
                to="/productDetails"
                onClick={() => getProductDetail(product.id)}
              >
                <img src={product.image}></img>
              </Link>

              <span>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  {product.name}
                </Link>

                {/* <select
                  defaultValue={1}
                  onChange={e => {
                    setProductQty(e.target.value)
                  }}
                >
                  {numArr.map(num => {
                    return (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    )
                  })}
                </select> */}
              </span>
              {product.details}

              <span>${Number(product.price).toFixed(2)}</span>
              <button onClick={() => addToCart(product.id, productQty)}>
                Add to Cart
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Products
