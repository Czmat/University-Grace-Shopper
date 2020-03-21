import React from "react"
import faker from "faker"

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {console.log(products)}

        {products.map(product => {
          return (
            <li key={product.id}>
              <img src={product.image}></img>
              <span>
                <a href="">{product.name}</a>
                <div>
                  Rating: {product.rating}
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                </div>
                <select
                  defaultValue={1}
                  onChange={e => {
                    console.log(e.target.value)
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
