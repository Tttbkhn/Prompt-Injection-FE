import React from 'react';
import loginGIF from '../images/img2.gif';
import './Auth.css';

const HomePage = () => {
    return (
        <div className="auth-container">
            <img src={loginGIF} alt="Login animation" className="login-gif" />
            <h1>Something GPT</h1>
        </div>
    );
};

export default HomePage;
