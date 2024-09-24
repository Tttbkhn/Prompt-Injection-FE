import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginGIF from '../images/img2.gif';
import './Auth.css';
import { BASE_URL } from '../util/constant';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
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
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Create Account</button>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default Signup;
