import React from 'react';
import qs from 'qs';

const Header = ({ params }) => {
  return (
    <div className="header-container">
      <a href="#">
        <h1>Grace Shopper</h1>
      </a>
      <div>
        <a
          href={`#${qs.stringify({ view: 'login' })}`}
          className={params.view === 'login' ? 'selected' : ''}
          onClick={e => {
            console.log('clicked');
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
            console.log('clicked');
          }}
        >
          account
        </a>
      </div>
      <div>
        <a
          href={`#${qs.stringify({ view: 'cart' })}`}
          className={params.view === 'cart' ? 'selected' : ''}
          onClick={e => {
            console.log('clicked');
          }}
        >
          Cart
        </a>
      </div>
    </div>
  );
};

export default Header;
