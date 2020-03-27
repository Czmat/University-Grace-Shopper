import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const Password = ({ login, validatePassword, auth, message, setMessage }) => {
  //const [user, setUser] = useState({});
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
    //window.location = '/account';
    // login({ username, password }).catch(ex =>
    //   setError(ex.response.data.message)
    // );
    //console.log(auth);
  };

  // const changePassword = () => {
  //   //console.log('changePassword');
  //   window.location = '/account';
  // };

  if (!message) {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <h1>Change your password</h1>
          {/* {message ? <h2>{message}</h2> : null} */}
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
