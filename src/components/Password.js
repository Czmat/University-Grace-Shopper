import React, { useState, useEffect } from 'react';

const Password = ({ login, validatePassword, auth, message, setMessage }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const resetMessage = () => {
    setMessage('');
    setCurrentPassword('');
    setNewPassword('');
  };

  const onSubmit = ev => {
    ev.preventDefault();

    validatePassword({ currentPassword, newPassword }).catch(ex =>
      setError(ex.response.data.message)
    );
    setTimeout(resetMessage, 2000);
  };

  if (!message) {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <h1>Change your password</h1>
          <div className="error">{error}</div>
          <label>Current password</label>
          <input
            value={currentPassword}
            placeholder="current password"
            onChange={ev => setCurrentPassword(ev.target.value)}
          />
          <label>New password</label>
          <input
            value={newPassword}
            placeholder="new password"
            onChange={ev => setNewPassword(ev.target.value)}
          />
          <button>Change Password</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2 className="message">{message}</h2>
      </div>
    );
  }
};

export default Password;
