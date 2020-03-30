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
  lineItems,
  createOrder,
}) => {
  console.log(lineItems, 'in totalAmount lineItems');
  return (
    <div className="cart-container">
      <div className="product-card">
        <p> Total: {totalIncludesPromo}</p>

        <Link to="/orders">
          <button
            disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
            onClick={createOrder}
          >
            Apply
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TotalAmount;
