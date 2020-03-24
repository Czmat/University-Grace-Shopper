import React, { useState } from 'react';
import faker from 'faker';
import qs from 'qs';
import StarRating from './StarRating';

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var rating = [1, 2, 3, 4, 5];

const ProductDetail = ({ products, addToCart, productDetail, params }) => {
  const [productQty, setProductQty] = useState(1);

  const inStockQty = [];
  var i;
  for (i = 1; i < productDetail.quantity + 1; i++) {
    inStockQty.push(i);
  }
  //console.log(inStockQty);

  //console.log(productQty);
  return (
    <div>
      <h2>Product</h2>
      <div>
        <img src={productDetail.image}></img>
      </div>
      <h4>{productDetail.name}</h4>
      <div>
        <StarRating />
      </div>
      <select
        defaultValue={1}
        onChange={e => {
          setProductQty(e.target.value);
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
      <div>${Number(productDetail.price).toFixed(2)}</div>
      <a
        href={`#${qs.stringify({ view: 'cart' })}`}
        className={params.view === 'cart' ? 'selected' : ''}
        onClick={() => addToCart(productDetail.id, productQty)}
      >
        Add to Cart
      </a>
    </div>
  );
};

export default ProductDetail;
