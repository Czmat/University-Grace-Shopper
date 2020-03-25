import React, { useState } from "react"

import StarRating from "./StarRating"

const ProductDetail = ({ products, addToCart, productDetail, params }) => {
  const [productQty, setProductQty] = useState(1)
  const link = "productDetails"
  const inStockQty = []
  var i
  for (i = 1; i < productDetail.quantity + 1; i++) {
    inStockQty.push(i)
  }
  console.log(inStockQty)
  return (
    <div>
      <h2>Product</h2>
      <div>
        <img src={productDetail.image}></img>
      </div>
      <h4>{productDetail.name}</h4>

      <select
        defaultValue={1}
        onChange={e => {
          setProductQty(e.target.value)
        }}
      >
        {inStockQty.map(num => {
          return (
            <option key={num} value={num}>
              {num}
            </option>
          )
        })}
      </select>
      <div>{productDetail.details}</div>
      <StarRating product={productDetail} link={link} />
      <div>${Number(productDetail.price).toFixed(2)}</div>

      <button onClick={() => addToCart(productDetail.id, productQty)}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductDetail
