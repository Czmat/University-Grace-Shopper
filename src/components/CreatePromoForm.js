import React, { useState } from 'react';
import UserManagement from './UserManagement';

const CreatePromoForm = ({
  promo,
  createPromo,
  setPromo,
  revisedPromo,
  setCreateForm,
  managedUsers,
}) => {
  const [createdPromo, setCreatedPromo] = useState({
    name: '',
    discount: 0,
    isActive: false,
    isDollar: false,
    userId: null,
    text: '',
  });
  const onChange = ev => {
    const change = {};
    change[ev.target.name] =
      ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
    setCreatedPromo({ ...createdPromo, ...change });
  };

  const onSubmit = e => {
    e.preventDefault(e);
    createPromo(createdPromo);
    setCreatedPromo({
      name: '',
      discount: 0,
      isActive: false,
      isDollar: false,
      userId: null,
      text: '',
    });
    setCreateForm(false);
  };

  return (
    <div className="cart-container">
      <div className="product-card">
        <h4>Create Promo</h4>
        <form onSubmit={onSubmit}>
          <div>
            <label>promo name: </label>
            <input name="name" value={createdPromo.name} onChange={onChange} />
            {createdPromo.name}
          </div>
          <div>
            <label>discount: </label>
            <input
              name="discount"
              value={createdPromo.discount}
              onChange={onChange}
            />
            {createdPromo.discount}
          </div>
          <div>
            <label>message: </label>
            <input name="text" value={createdPromo.text} onChange={onChange} />
            {createdPromo.text}
          </div>
          <div>
            <label>
              {createdPromo.isActive
                ? 'Promo is active'
                : 'Promo is not active'}
              :{' '}
            </label>
            <input
              name="isActive"
              type="checkbox"
              checked={createdPromo.isActive}
              onChange={onChange}
            />
          </div>
          <div>
            <label>
              {createdPromo.isDollar
                ? 'Promo is in dollar'
                : 'Promo is in percentage'}
              :{' '}
            </label>
            <input
              name="isDollar"
              type="checkbox"
              checked={createdPromo.isDollar}
              onChange={onChange}
            />
          </div>
          <div>
            <label>
              {createdPromo.userId
                ? 'Promo is for specific User'
                : 'Promo is for All'}
              :{' '}
            </label>
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
        <button onClick={() => setCreateForm(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default CreatePromoForm;
