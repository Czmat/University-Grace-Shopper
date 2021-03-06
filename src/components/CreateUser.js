import React, { useState, useEffect } from 'react';

const CreateUser = ({ login, createUser }) => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const firstname = username
    .split(' ')
    .slice(0, -1)
    .join(' ');
  const lastname = username
    .split(' ')
    .slice(-1)
    .join(' ');

  const onSubmit = ev => {
    ev.preventDefault();
    createUser({ username, firstname, lastname, password, email });
    login({ username, password }).catch(ex =>
      setError(ex.response.data.message)
    );
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Welcome to the family!</h1>
        <div className="error">{error}</div>
        <label>Username</label>
        <input
          value={username}
          placeholder="First and Last name"
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          value={email}
          placeholder="Email address"
          onChange={ev => setEmail(ev.target.value)}
        />
        <input
          value={password}
          placeholder="Password"
          onChange={ev => setPassword(ev.target.value)}
        />
        {/* <Link to="/profile"> */}
        <button>Create Account</button>
        {/* </Link> */}
      </form>
      <a href="#"> Forgot Password</a>
      <div className="horizontal"></div>
    </div>
  );
};

export default CreateUser;
