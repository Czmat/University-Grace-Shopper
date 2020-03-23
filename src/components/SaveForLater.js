import React from 'react';

const SavedForLater = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  addToCart,
}) => {
  return (
    <div className="cart-container">
      <h2>Saved for later ()</h2>
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
                <a href="#">
                  <img></img>Image
                </a>
              </div>
              <div>
                <h4>
                  <a href="#">{product && product.name}</a>
                </h4>
              </div>
              <div className="">
                <div>Description of a product</div>
                <p>more detail Description</p>

                <i>|</i>
                <input type="submit" value="Move to Cart"></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SavedForLater;