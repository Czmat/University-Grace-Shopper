import React, { useState } from 'react';
import StarRating from './StarRating';

const ProductDetail = ({ updateProductDetail, addToCart, productDetail }) => {
  const [productQty, setProductQty] = useState(1);
  const [leftOverQty, setLeftOVerQty] = useState(0);

  const link = 'productDetails';
  const inStockQty = [];

  var i;
  for (i = 1; i < productDetail.quantity + 1; i++) {
    inStockQty.push(i);
  }

  return (
    <div className="products-box">
      <h2>Product</h2>
      <div>
        <img src={productDetail.image}></img>
      </div>
      <h4>{productDetail.name}</h4>
      <select
        defaultValue={1}
        onChange={e => {
          setProductQty(e.target.value);
          setLeftOVerQty(productDetail.quantity - productQty);
        }}
      >
        {inStockQty.map(num => {
          return (
            <option key={num} value={num}>
              {num}
            </option>
          );
        })}
      </select>
      <div>{productDetail.details}</div>
      <StarRating product={productDetail} link={link} />
      <div>${Number(productDetail.price).toFixed(2)}</div>
      <button onClick={() => addToCart(productDetail.id, productQty)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
