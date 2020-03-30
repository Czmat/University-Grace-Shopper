import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import axios from 'axios';
import Checkout from './components/Checkout';
import StarRating from './components/StarRating';

const Orders = ({ cartItems, products, auth, orders, setOrders, setOrder }) => {
  const link = 'orders';

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          const mapCartItems = cartItems.filter(
            cartItem => cartItem.orderId === order.id
          );
          return (
            <div key={order.id}>
              <Link
                to="/orderdetails"
                order={order}
                onClick={() => setOrder(order)}
              >
                OrderID: {order.id.slice(0, 4)}
              </Link>
              <ul>
                {mapCartItems.map(cartItem => {
                  const product = products.find(
                    product => product.id === cartItem.productId
                  );
                  return (
                    <li key={cartItem.id}>
                      {product && product.name}
                      <div>
                        <StarRating link={link} product={product} />
                      </div>
                      <span className="quantity">
                        Quantity: {cartItem.quantity}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;
