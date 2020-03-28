import React, { useState } from 'react';

const ManagedUser = ({ user, manageUser, setUserId }) => {
  const [isBlockedUser, setIsBlockedUser] = useState({
    id: user.id,
    isBlocked: user.isBlocked,
  });

  const onChange = e => {
    setIsBlockedUser({ id: user.id, isBlocked: e.target.checked });
  };

  const onSubmit = e => {
    e.preventDefault(e);
    manageUser(isBlockedUser);
    setUserId('');
  };

  return (
    <div className="cart-container">
      <div className="product-card">
        <h4>Username: {user.username}</h4>
        <form onSubmit={onSubmit}>
          <div>
            {user.isBlocked ? 'User is blocked' : 'User is not blocked'}
          </div>
          <div>
            <input
              name="isBlocked"
              type="checkbox"
              checked={isBlockedUser.isBlocked}
              onChange={onChange}
            />
          </div>
          <button>Make changes</button>
        </form>
      </div>
    </div>
  );
};

export default ManagedUser;
