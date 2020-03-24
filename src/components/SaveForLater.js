import React from 'react';

const SavedForLater = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  addToCart,

  saveForLater,
  addToSaveForLater,
}) => {
  return (
    <div className="cart-container">
      <h2>Saved for later ()</h2>
      {lineItems
        .filter(lineItem => lineItem.orderId === saveForLater.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          );
          return (
            <div key={lineItem.id} className="product-card">
              <button onClick={() => removeFromCart(lineItem.id)}>x</button>
              <div>
                <a href="#">
                  <img src={product.image}></img>
                </a>
              </div>
              <div>
                <h4>
                  <a href="#">{product && product.name}</a>
                </h4>
              </div>
              <div className="">
                <input
                  type="submit"
                  value="Move to cart"
                  onClick={e => {
                    //e.preventDefault();
                    console.log(product, 'product', lineItem, 'lineitem');
                    addToCart(lineItem.productId, lineItem.quantity);
                    //removeFromCart(lineItem.id);
                  }}
                ></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SavedForLater;
