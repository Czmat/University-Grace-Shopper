import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const ManagedUser = ({ user }) => {
  return (
    <ul>
      <li>isBlocked: {user.isBlocked ? 'true' : 'false'}</li>
      <li>Username: {user.username}</li>
    </ul>
  );
};

const UserManagement = ({ auth, managedUsers }) => {
  const [userId, setUserId] = useState('');

  const user = managedUsers.find(u => u.id === userId);
  console.log(user);

  return (
    <div>
      <h1>User my Management</h1>
      {!!user && <ManagedUser user={user} />}
      <ul>
        {managedUsers.map(user => {
          return (
            <li key={user.id}>
              <Link to="/user/management" onClick={() => setUserId(user.id)}>
                {user.username}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserManagement;
