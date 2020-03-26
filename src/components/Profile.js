import React, { useState, useEffect } from 'react';

const Profile = ({ login, updateUser, auth }) => {
  //const [user, setUser] = useState({});
  const [username, setUsername] = useState(auth.username);
  const [firstname, setFirstname] = useState(auth.firstname);
  const [lastname, setLastname] = useState(auth.lastname);
  const [email, setEmail] = useState(auth.email);
  const [error, setError] = useState('');

  // const firstname = username
  //   .split(' ')
  //   .slice(0, -1)
  //   .join(' ');
  // const lastname = username
  //   .split(' ')
  //   .slice(-1)
  //   .join(' ');

  const onSubmit = ev => {
    ev.preventDefault();

    updateUser({ username, firstname, lastname, email });
    //window.location = '/account';
    // login({ username, password }).catch(ex =>
    //   setError(ex.response.data.message)
    // );
    //console.log(auth);
  };

  const changePassword = () => {
    //console.log('changePassword');
  };

  //   var firstName = fullName.split(' ').slice(0, -1).join(' ');
  // var lastName = fullName.split(' ').slice(-1).join(' ');

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Edit your profile</h1>
        <div className="error">{error}</div>
        <label>Username</label>
        <input value={username} onChange={ev => setUsername(ev.target.value)} />
        <label>First name</label>
        <input
          value={firstname}
          onChange={ev => setFirstname(ev.target.value)}
        />
        <label>Last name</label>
        <input value={lastname} onChange={ev => setLastname(ev.target.value)} />
        <label>Email address</label>
        <input value={email} onChange={ev => setEmail(ev.target.value)} />
        <button onClick={changePassword}>Change Password</button>
        <button>Save Profile</button>
      </form>
      {/* <a href="#"> Forgot Password</a>
      <div className="horizontal"></div> */}
    </div>
  );
};

export default Profile;
