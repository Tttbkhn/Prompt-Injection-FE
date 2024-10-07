import React, { useState } from 'react';
import './Auth.css';

const ForgetPassword = ({ onCodeSent }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[0-9]{8}@student\.curtin\.edu\.au$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    setMessage('');

    if (!validateEmail(email)) {
      return; // Stop further execution if the email is invalid
    }

    setLoading(true);

    try {
      const response = await fetch('http://3.107.23.29/api/v2/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Show success message when email is successfully sent
        setMessage(`A verification code has been sent to ${email}.`);
        onCodeSent(email);
      }
    } catch (error) {
      // Network or unexpected error can still be handled here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      {message && <div className="message">{message}</div>}

      {/* Email input */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Loading button state */}
      <button onClick={handlePasswordReset} disabled={loading}>
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>
    </div>
  );
};


export default ForgetPassword;
