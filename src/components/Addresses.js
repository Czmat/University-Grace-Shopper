import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Addresses = ({ auth }) => {
  const [userAddresses, setUserAddresses] = useState([]);
  useEffect(() => {
    if (auth.id) {
      axios.get(`/api/address/${auth.id}`).then(response => {
        setUserAddresses(response.data);
      });
    }
  }, [userAddresses]);

  const deleteAddress = address => {
    axios
      .delete(`/api/addresses/${address.id}`)
      .then(response => setUserAddresses(response.data));
  };

  const addAddress = e => {
    e.preventDefault();
    const fullAddress = [
      e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value,
    ];
    axios
      .post(`/api/address/${auth.id}`, [fullAddress])
      .then(response => setUserAddresses(response.data));
  };

  if (userAddresses[0]) {
    return (
      <div>
        <h1>Saved Addresses</h1>
        <ul>
          {userAddresses.map(userAddress => {
            return (
              <div key={userAddress.id}>
                <li>
                  {userAddress.street}, {userAddress.city} {userAddress.state}{' '}
                  {userAddress.zip}
                </li>
                <button onClick={() => deleteAddress(userAddress)}>
                  Delete
                </button>
              </div>
            );
          })}
        </ul>
        Add Addresses
        <form onSubmit={addAddress}>
          <input placeholder="Address" />
          <input placeholder="City" />
          <input placeholder="State" />
          <input placeholder="Zip" />
          <button type="submit">Add Address</button>
        </form>
      </div>
    );
  } else {
    return (
      <form onSubmit={addAddress}>
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="State" />
        <input placeholder="Zip" />
        <button type="submit">Add Address</button>
      </form>
    );
  }
};

export default Addresses;
