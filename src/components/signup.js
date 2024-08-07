import React, { useState } from 'react';
import './Auth.css';
import loginGIF from '../images/img2.gif'

const Signup = ({ onSignup, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => onSignup(), 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <img src={loginGIF} alt="Login animation" className="login-gif" />

      <h1>Create Account</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Create Account</button>
      <button onClick={onBackToLogin}>Back to Login</button>
    </div>
  );
};

export default Signup;
