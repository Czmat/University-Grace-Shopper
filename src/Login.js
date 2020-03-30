import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  useHistory,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const Login = ({ login, err, auth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = ev => {
    login({ username, password }).catch(ex => {
      setError(ex.response.data.message);
    });
  };

  return (
    <div>
      <form>
        <h1>Login</h1>
        {err ? <div className="error">{err}</div> : ''}
        <div className="error">{error}</div>
        <input value={username} onChange={ev => setUsername(ev.target.value)} />
        <input value={password} onChange={ev => setPassword(ev.target.value)} />

        <Link className={'button'} to="/account" onClick={onSubmit}>
          Login
        </Link>
      </form>
      <a href=""> Forgot Password</a>
      <hr />
      <h2>I am new to Grace Shopper</h2>
      <Link to="/register">Create Account</Link>
    </div>
  );
};

export default Login;
