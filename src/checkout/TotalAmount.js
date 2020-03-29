import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const TotalAmount = ({
  promos,
  cart,
  updateCartTotal,
  totalIncludesPromo,
  setTotalIncludesPromo,
}) => {
  console.log(promos, 'in checkout outside promos');
  return (
    <div className="cart-container">
      <div className="product-card">
        <h5>
          Total: <p>{totalIncludesPromo}</p>
        </h5>
        <button>Apply</button>
      </div>
    </div>
  );
};

export default TotalAmount;
