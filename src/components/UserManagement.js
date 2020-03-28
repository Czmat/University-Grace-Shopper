import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import ManagedUser from './ManagedUser';

const UserManagement = ({ managedUsers, updateUser, manageUser }) => {
  const [userId, setUserId] = useState('');

  const user = managedUsers.find(u => u.id === userId);

  const onClick = userClicked => {
    setUserId(userClicked.id);
  };

  return (
    <div>
      {!!userId && (
        <ManagedUser
          user={user}
          updateUser={updateUser}
          setUserId={setUserId}
          manageUser={manageUser}
        />
      )}
      <h1>Pick User to Management</h1>
      <ul>
        {managedUsers.map(user => {
          return (
            <li key={user.id}>
              <Link
                to="/user/management"
                onClick={() => {
                  onClick(user);
                }}
              >
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
