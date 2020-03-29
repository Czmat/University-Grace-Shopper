import React, { useEffect, useState } from 'react';
import address from '../address';
import axios from 'axios';
import CheckoutPromoForm from '../checkout/CheckoutPromoForm';
import TotalAmount from '../checkout/TotalAmount';

const Checkout = ({
  cart,
  auth,
  updateCartTotal,
  promos,
  lineItems,
  createOrder,
}) => {
  const [totalIncludesPromo, setTotalIncludesPromo] = useState();
  const [save, setSave] = useState(false);
  const [userSavedAddress, setUserSavedAddress] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const checkoutOrder = JSON.parse(
    window.localStorage.getItem('checkoutorder')
  );

  useEffect(() => {
    if (auth.id) {
      axios.get(`/api/address/${auth.id}`).then(response => {
        setUserSavedAddress(response.data);
      });
    }
  }, []);

  const saveAddress = () => {
    save === true ? setSave(false) : setSave(true);
  };

  const handleSubmit = async e => {
    let fullAddress = address(e);
    setUserAddress(fullAddress);
    if (save === true) {
      console.log(userAddress);
      axios
        .post(`/api/address/${auth.id}/`, [fullAddress])
        .then(response => console.log(response, 'response'));
    }
  };
  const saveSelection = address => {
    // console.log(address);
  };

  //to set latest total to total includes promo
  useEffect(() => {
    setTotalIncludesPromo(cart.total);
  }, [cart, lineItems]);

  console.log(cart.total, 'in checkout outside cart.total');
  console.log(totalIncludesPromo, 'in checkout outside totalInPromo');

  return (
    <div key={checkoutOrder.id}>
      <h2>Checkout</h2>
      <li>Order {checkoutOrder.id.slice(0, 4)} </li>
      <form onSubmit={handleSubmit}>
        <label htmlFor="saved">Choose a Saved Address </label>
        <select id="saved">
          <option> </option>
          {userSavedAddress
            ? userSavedAddress.map(mapAddress => {
                return (
                  <option
                    key={mapAddress.id}
                    onSelect={mapAddress => saveSelection(mapAddress)}
                  >
                    {mapAddress.address}
                  </option>
                );
              })
            : null}
        </select>
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="State" />
        <input placeholder="Zip" />
        <button type="submit">submit</button>
      </form>
      <input
        type="checkbox"
        name="address"
        value="save"
        onClick={saveAddress}
      />
      <label htmlFor="address">Add to address book</label>
      <hr />
      <CheckoutPromoForm
        cart={cart}
        updateCartTotal={updateCartTotal}
        promos={promos}
        totalIncludesPromo={totalIncludesPromo}
        setTotalIncludesPromo={setTotalIncludesPromo}
      />
      <TotalAmount
        cart={cart}
        updateCartTotal={updateCartTotal}
        promos={promos}
        totalIncludesPromo={totalIncludesPromo}
        setTotalIncludesPromo={setTotalIncludesPromo}
        createOrder={createOrder}
        lineItems={lineItems}
      />
    </div>
  );
};

export default Checkout;

//want to create orders page that shows each order and the status - the cart should have a checkout button and once you checkout the order and pay/add a shipping address it will then create an order number which you can then reference on the order page.

//order oage should include the status, the items with the ability to rate them and
