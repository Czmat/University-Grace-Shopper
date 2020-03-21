import React from "react"
import faker from "faker"
import StarRating from "./components/StarRating"

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var rating = [1, 2, 3, 4, 5]

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <img src={product.image}></img>
              <span>
                <a href="">{product.name}</a>
                <div>
                  <StarRating />
                </div>
                <select
                  defaultValue={1}
                  onChange={e => {
                    e.target.value === "0"
                      ? removeFromCart(lineItem.id)
                      : addToCart(product.id, e.target.value)
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
              </span>
              {product.details}
              <span>${Number(product.price).toFixed(2)}</span>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Products
