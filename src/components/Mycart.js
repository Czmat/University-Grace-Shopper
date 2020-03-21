import React from 'react';

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Mycart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  addToCart,
}) => {
  return (
    <div className="cart-container">
      <h2>Your cart total: $100</h2>
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
                <span>Qty:</span>
                <select
                  defaultValue={lineItem.quantity}
                  onChange={e => {
                    console.log(e.target.value);
                    e.target.value === '0'
                      ? removeFromCart(lineItem.id)
                      : addToCart(product.id, e.target.value);
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
                <input type="submit" value="Save for later"></input>
                <div>${Number(product.price).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button>
    </div>
  );
};

{
  /* <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
<button
  disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
  onClick={createOrder}
>
  Create Order
</button>
<ul>
  {lineItems
    .filter(lineItem => lineItem.orderId === cart.id)
    .map(lineItem => {
      const product = products.find(
        product => product.id === lineItem.productId
      );
      return (
        <li key={lineItem.id}>
          {product && product.name}{' '}
          <span className="quantity">Quantity: {lineItem.quantity}</span>
          <button onClick={() => removeFromCart(lineItem.id)}>
            Remove From Cart
          </button>
        </li>
      );
    })}
</ul> */
}

export default Mycart;
