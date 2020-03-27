import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const PromoManagement = ({ auth, users }) => {
  console.log(users);

  return (
    <div>
      <h1>Promo Management</h1>
      <ul>
        <li>
          <Link to="/user/management">User management</Link>
          <Link to="/promo/management">Promo management</Link>
          <Link to="/product/management">Product management</Link>
        </li>
      </ul>
    </div>
  );
};

export default PromoManagement;
