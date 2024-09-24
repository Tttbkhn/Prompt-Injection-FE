import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginGIF from '../images/img2.gif';
import './Auth.css';
import { useAuth } from './hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async e => {
        e.preventDefault();
        try {
            setError('');
            await login({ username, password });
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <img src={loginGIF} alt="Login animation" className="login-gif" />
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate('/signup')}>Signup</button>
        </div>
    );
};

export default Login;
