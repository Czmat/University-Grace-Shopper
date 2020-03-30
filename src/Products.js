import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const Products = ({ products, addToCart, getProductDetail }) => {
  const [productQty, setProductQty] = useState(1);

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
              </span>
              <span>${Number(product.price).toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;
