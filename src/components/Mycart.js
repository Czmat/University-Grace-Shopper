import React, { useState, useEffect } from 'react';
import SaveForLater from './SaveForLater';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Mycart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  productDetail,
  addToCart,
  saveForLater,
  addToSaveForLater,
  removeFromSave,
  changeQtyInCart,
  addBackToCart,
  params,
  getProductDetail,
  orders,
  auth,
  updateCartTotal,
}) => {
  const [cartTotal, setCartTotal] = useState(0);

  const findCartTotal = () => {
    let cartTotalAmount = 0;
    lineItems
      .filter(lineItem => lineItem.orderId === cart.id)
      .forEach(lineItem => {
        const product = products.find(
          product => product.id === lineItem.productId
        );
        cartTotalAmount += Number(product.price * lineItem.quantity);
        console.log(cartTotal, 'in find');
      });
    setCartTotal(cartTotalAmount);
  };

  useEffect(() => {
    findCartTotal();
  }, [cart, lineItems]);

  //console.log(cartTotal, 'outside');
  return (
    <div className="cart-container">
      <h2>Your cart total: ${cartTotal}</h2>
      {/* commenting out the create order button for now -I will transfer this code to the checkout page*/}
      {/* <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button> */}
      <Link
        to="/checkout"
        // style={cart ? '' : { pointerEvents: 'none' }}
        onClick={e => {
          if (!lineItems.length) {
            e.preventDefault();
          }
          if (cart.id) {
            updateCartTotal(cart.id, cartTotal);
          }
        }}
      >
        <button>Checkout</button>
      </Link>
      {lineItems
        .filter(lineItem => lineItem.orderId === cart.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          );
          return (
            <div key={lineItem.id} className="product-card">
              <button onClick={() => removeFromCart(lineItem.id)}>x</button>
              <div>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  <img src={product.image}></img>
                </Link>
              </div>
              <div>
                <Link
                  to="/productDetails"
                  onClick={() => getProductDetail(product.id)}
                >
                  <h4>{product && product.name}</h4>
                </Link>
              </div>
              <div className="">
                <div>Description of a product</div>
                <p>{product.details}</p>
                <span>Qty:{lineItem.quantity}</span>
                <select
                  defaultValue={lineItem.quantity}
                  onChange={e => {
                    //console.log(e.target.value);
                    e.target.value === '0'
                      ? removeFromCart(lineItem.id)
                      : changeQtyInCart(product.id, e.target.value);
                  }}
                >
                  <option value={0}>0 (delete)</option>
                  {numArr.map(num => {
                    return (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    );
                  })}
                </select>
                <i>|</i>
                <input
                  type="submit"
                  value="Save for later"
                  onClick={e => {
                    addToSaveForLater(product.id);
                  }}
                ></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      <h2>Your cart total: ${cartTotal.toFixed(2)}</h2>
      <hr></hr>
      <SaveForLater
        lineItems={lineItems}
        removeFromCart={removeFromCart}
        cart={cart}
        createOrder={createOrder}
        products={products}
        addToCart={addToCart}
        saveForLater={saveForLater}
        addToSaveForLater={addToSaveForLater}
        removeFromSave={removeFromSave}
        addBackToCart={addBackToCart}
        getProductDetail={getProductDetail}
        params={params}
      />
    </div>
  );
};

export default Mycart;
