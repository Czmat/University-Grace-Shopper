import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const Login = ({ login, err }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const onSubmit = ev => {
    ev.preventDefault();
    login({ username, password }).catch(ex => {
      //console.log(ex.response, 'error');
      setError(ex.response.data.message);
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Login</h1>
        {err ? <div className="error">{err}</div> : ''}
        <div className="error">{error}</div>
        <input value={username} onChange={ev => setUsername(ev.target.value)} />
        <input value={password} onChange={ev => setPassword(ev.target.value)} />
        <button>Login</button>
      </form>
      <a href=""> Forgot Password</a>
      <hr />
      <h2>I am new to Grace Shopper</h2>
      <Link to="/register">Create Account</Link>
      {/* <div className="horizontal">
        <form>
          <h1>Create a new user</h1>
          Name <input value={name} onChange={ev => setName(ev.target.value)} />
          Username{" "}
          <input
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          Password{" "}
          <input
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <button>Create</button>
        </form>
      </div> */}
    </div>
  );
};

export default Login;
