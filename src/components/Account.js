import React from 'react';
import qs from 'qs';

const Account = ({ logout, auth, params }) => {
  return (
    <div className="account-container">
      <h1>{auth.username}'s Account</h1>
      <ul>
        <li>
          <a
            href={`#${qs.stringify({ view: 'profile' })}`}
            className={params.view === 'profile' ? 'selected' : ''}
          >
            Profile
          </a>
        </li>
      </ul>
      <button onClick={logout}>Logout {auth.username} </button>
    </div>
  );
};

export default Account;
