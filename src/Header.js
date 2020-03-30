import React from 'react';
import qs from 'qs';

const Header = ({ params, lineItems, cart }) => {
  const userCart = lineItems.filter(lineItem => lineItem.orderId === cart.id);

  // let totalQty = 0;
  // const count = userCart.forEach(item => {
  //   totalQty += item.quantity;
  // });

  return (
    <header className="header-container">
      <div className="header-name">
        <a href="#">
          <h1>Grace Shopper</h1>
        </a>
      </div>
      <div className="nav-bar">
        <div>
          <a
            href={`#${qs.stringify({ view: 'login' })}`}
            className={params.view === 'login' ? 'selected' : ''}
            onClick={e => {
              //console.log('clicked');
            }}
          >
            Login
          </a>
        </div>
        <div>
          <a
            href={`#${qs.stringify({ view: 'account' })}`}
            className={params.view === 'account' ? 'selected' : ''}
            onClick={e => {
              //console.log('clicked');
            }}
          >
            account
          </a>
        </div>
        <div>
          <a
            href={`#${qs.stringify({ view: 'cart' })}`}
            className={params.view === 'cart' ? 'selected' : ''}
            onClick={e => {}}
          >
            <i className="fas fa-shopping-bag"></i>
            <span>{userCart.length}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
