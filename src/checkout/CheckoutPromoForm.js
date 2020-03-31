import React, { useState } from 'react';
import TotalAmount from '../checkout/TotalAmount';

const CheckoutPromoForm = ({
  promos,
  cart,
  updateCartTotal,
  totalIncludesPromo,
  setTotalIncludesPromo,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [matchedPromo, setMatchedPromo] = useState({});
  const [failMessage, setFailMessage] = useState([]);

  const onChange = e => {
    setPromoInput(e.target.value);
    setMatchedPromo({});
  };

  const onSubmit = e => {
    e.preventDefault(e);
    const found = promos.find(promo => promo.name === promoInput);
    setMatchedPromo(found);
    setFailMessage(['No such promo code', ...failMessage]);
    let totalWithPromo = cart.total;
    if (found.isDollar && found.isActive) {
    }
    if (!found.isActive) {
      totalWithPromo -= cart.total * (found.discount / 100);
      setTotalIncludesPromo(totalWithPromo);
    }
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
      <div className="cart-container">
        <div className="product-card">
          <button onClick={e => setShowInput(true)}>
            Redeem gift or promo code
          </button>
          <hr />
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
          <p className={matchedPromo ? 'success' : 'fail'}>
            {matchedPromo ? matchedPromo.text : failMessage[0]}
          </p>
        </div>
      </div>
    );
  }
};

export default CheckoutPromoForm;
