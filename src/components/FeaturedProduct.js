import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const FeaturedProduct = ({ products, getProductDetail, ProductDetail }) => {
  const featuredProduct = products.filter(product => product.rating >= 4);

  if (featuredProduct[0]) {
    return (
      <div className="products-box">
        <h2>Featured Product</h2>
        <ul>
          <li className="products">
            <Link
              to="/productDetails"
              onClick={() => getProductDetail(featuredProduct[0].id)}
            >
              <img src={featuredProduct[0].image}></img>
            </Link>

            <span>
              <Link
                to="/productDetails"
                onClick={() => getProductDetail(featuredProduct[0].id)}
              >
                {featuredProduct[0].name}
              </Link>
            </span>

            <span>${Number(featuredProduct[0].price).toFixed(2)}</span>
          </li>
        </ul>
      </div>
    );
  } else {
    return <div>Select Shop to check out our products!</div>;
  }
};

export default FeaturedProduct;
