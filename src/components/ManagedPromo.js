import React, { useState } from 'react';
import UserManagement from './UserManagement';

const ManagedPromo = ({
  promo,
  updatePromo,
  setPromo,
  revisedPromo,
  setRevisedPromo,
  managedUsers,
}) => {
  const onChange = ev => {
    const change = {};
    change[ev.target.name] =
      ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
    setRevisedPromo({ ...revisedPromo, ...change });
  };

  const onSubmit = e => {
    e.preventDefault(e);
    updatePromo(revisedPromo);
    setRevisedPromo({});
  };

  return (
    <div className="cart-container">
      <div className="product-card">
        <h4>Promo name: {revisedPromo.name}</h4>
        <form onSubmit={onSubmit}>
          <div>
            <input name="name" value={revisedPromo.name} onChange={onChange} />
            {revisedPromo.name}
          </div>
          <div>
            <input
              name="discount"
              value={revisedPromo.discount}
              onChange={onChange}
            />
            {revisedPromo.discount}
          </div>
          <div>
            <input name="text" value={revisedPromo.text} onChange={onChange} />
            {revisedPromo.text}
          </div>
          <div>
            {revisedPromo.isActive ? 'Promo is active' : 'Promo is not active'}
          </div>
          <div>
            <input
              name="isActive"
              type="checkbox"
              checked={revisedPromo.isActive}
              onChange={onChange}
            />
          </div>
          <div>
            {revisedPromo.isDollar ? 'Promo is dollar' : 'Promo is not dollar'}
          </div>
          <div>
            <input
              name="isDollar"
              type="checkbox"
              checked={revisedPromo.isDollar}
              onChange={onChange}
            />
          </div>
          <div>
            <select name="userId" onChange={onChange}>
              <option defaultValue value="">
                Select User
              </option>
              {managedUsers.map(user => {
                return (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                );
              })}
            </select>
          </div>
          <button>Make changes</button>
        </form>
        <button onClick={() => setRevisedPromo({})}>Cancel</button>
      </div>
    </div>
  );
};

export default ManagedPromo;
