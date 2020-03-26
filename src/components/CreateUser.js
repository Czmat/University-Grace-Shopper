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
    //console.log(firstname, lastname);
    //setUser({ username, firstname, lastname, password, email });
    createUser({ username, firstname, lastname, password, email });
    //window.location = '/account';
    // login({ username, password }).catch(ex =>
    //   setError(ex.response.data.message)
    // );
  };

  console.log(user);

  //   var firstName = fullName.split(' ').slice(0, -1).join(' ');
  // var lastName = fullName.split(' ').slice(-1).join(' ');

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Welcome to the family!</h1>
        <div className="error">{error}</div>
        <input value={username} onChange={ev => setUsername(ev.target.value)} />
        <input value={email} onChange={ev => setEmail(ev.target.value)} />
        <input value={password} onChange={ev => setPassword(ev.target.value)} />
        <button>Create Account</button>
      </form>
      <a href="#"> Forgot Password</a>
      <div className="horizontal"></div>
    </div>
  );
};

export default CreateUser;
