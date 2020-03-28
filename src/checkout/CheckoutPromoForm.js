import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const CheckoutPromoForm = ({ promo }) => {
  const [showInput, setShowInput] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const onChange = e => {
    console.log(e.target.value, 'input promo');
    setPromoInput(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault(e);
    console.log(promoInput, 'in man promo');
  };

  if (!showInput) {
    return (
      <div className="cart-container">
        <div className="product-card">
          <button onClick={e => setShowInput(true)}>
            Redeem gift or promo code
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="name"
            placeholder="promo code"
            value={promoInput}
            onChange={onChange}
          />
          {promoInput}
        </div>
        <button>Apply</button>
      </form>
    );
  }
};

export default CheckoutPromoForm;
