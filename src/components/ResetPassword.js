import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import { Link } from 'react-router-dom'; // Add this if using react-router for navigation

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showLoginButton, setShowLoginButton] = useState(false); // New state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const token = new URLSearchParams(window.location.search).get('token');

      const response = await axios.post('https://chatbox.guru/api/v2/auth/reset-password', {
        token,
        password,
      });

      if (response.status === 200) {
        setMessage('Password reset successful');
        setShowLoginButton(true); // Show login button after successful reset
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="reset-container">
      <div className="form-wrapper">
        <h2>Set a new password</h2>
        <p className="subtitle">
          Create a new password. Ensure it differs from previous ones for security.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit" className="submit-btn">Update Password</button>
        </form>
        {showLoginButton && (
          <div className="login-link">
            {/* If using react-router for navigation */}
            <Link to="/login" className="btn-login">
              Go to Login Page
            </Link>

            {/* Alternatively, use a simple link */}
            {/* <a href="/login" className="btn-login">Go to Login Page</a> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
