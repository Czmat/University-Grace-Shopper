import React, { useState } from 'react';
import TotalAmount from '../checkout/TotalAmount';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

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
    //console.log(e.target.value, 'input promo');
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
      console.log('dollar');
    }
    if (!found.isActive) {
      totalWithPromo -= cart.total * (found.discount / 100);
      console.log(found, 'percent', totalWithPromo);
      setTotalIncludesPromo(totalWithPromo);
    }
  };

  //console.log(failMessage, 'fail');

  if (!showInput) {
    return (
      <div className="cart-container">
        <div className="product-card">
          <button onClick={e => setShowInput(true)}>
            Redeem gift or promo code
          </button>
        </div>
        {/* <TotalAmount
          cart={cart}
          updateCartTotal={updateCartTotal}
          promos={promos}
        /> */}
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
        {/* <TotalAmount
          cart={cart}
          updateCartTotal={updateCartTotal}
          promos={promos}
        /> */}
      </div>
    );
  }
};

export default CheckoutPromoForm;
