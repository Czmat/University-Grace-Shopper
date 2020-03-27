import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const Account = ({ logout, auth, params }) => {
  return (
    <div className="account-container">
      <h1>{auth.username}'s Account</h1>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/orders">Orders</Link>
          {auth.role === 'ADMIN' ? <Link to="/admin">Admin</Link> : ''}
        </li>
      </ul>
      <button onClick={logout}>Logout {auth.username} </button>
    </div>
  );
};

export default Account;
