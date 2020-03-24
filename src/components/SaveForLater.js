import React from 'react';
import qs from 'qs';

const SavedForLater = ({
  lineItems,
  cart,
  createOrder,
  removeFromSave,
  products,
  addToCart,

  saveForLater,
  addToSaveForLater,
  addBackToCart,
  params,
  getProductDetail,
}) => {
  const userSave = lineItems.filter(
    lineItem => lineItem.orderId === saveForLater.id
  );

  return (
    <div className="cart-container">
      <h2>Saved for later ({userSave.length})</h2>
      {lineItems
        .filter(lineItem => lineItem.orderId === saveForLater.id)
        .map(lineItem => {
          const product = products.find(
            product => product.id === lineItem.productId
          );
          return (
            <div key={lineItem.id} className="product-card">
              <button onClick={() => removeFromSave(lineItem.id)}>x</button>
              <div>
                <a
                  href={`#${qs.stringify({ view: 'productDetail' })}`}
                  className={params.view === 'productDetail' ? 'selected' : ''}
                  onClick={() => getProductDetail(product.id)}
                >
                  <img src={product.image}></img>
                </a>
              </div>
              <div>
                <h4>
                  <a
                    href={`#${qs.stringify({ view: 'productDetail' })}`}
                    className={
                      params.view === 'productDetail' ? 'selected' : ''
                    }
                    onClick={() => getProductDetail(product.id)}
                  >
                    {product && product.name}
                  </a>
                </h4>
              </div>
              <div className="">
                <input
                  type="submit"
                  value="Move to cart"
                  onClick={e => {
                    //e.preventDefault();
                    //console.log(product, 'product', lineItem, 'lineitem');
                    addBackToCart(lineItem.productId, lineItem.quantity);
                    //removeFromSave(lineItem.id);
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
