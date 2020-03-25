import React, { useState } from 'react';
import faker from 'faker';
import qs from 'qs';
import StarRating from './components/StarRating';

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var rating = [1, 2, 3, 4, 5];

const Products = ({ products, addToCart, getProductDetail, params }) => {
  const [productQty, setProductQty] = useState(1);
  console.log(productQty);
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <a
                href={`#${qs.stringify({ view: 'productDetail' })}`}
                className={params.view === 'productDetail' ? 'selected' : ''}
                onClick={() => getProductDetail(product.id)}
              >
                <img src={product.image}></img>
              </a>
              <span>
                <a
                  href={`#${qs.stringify({ view: 'productDetail' })}`}
                  className={params.view === 'productDetail' ? 'selected' : ''}
                  onClick={() => getProductDetail(product.id)}
                >
                  {product.name}
                </a>
                <div>
                  <StarRating />
                </div>
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
              {/* <button onClick={() => addToCart(product.id, productQty)}>
                Add to Cart
              </button> */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;
