import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const TotalAmount = ({ cart, totalIncludesPromo, lineItems, createOrder }) => {
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
