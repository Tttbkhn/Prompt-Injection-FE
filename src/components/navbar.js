import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png';
import { useAuth } from './hooks/useAuth';
import { Form } from 'react-bootstrap';

const Navbar = ({ isSwitchActive, handleSwitchChange }) => {
    const navigate = useNavigate();
    const { logout, user, username } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand" onClick={() => navigate('/')}>
                <img src={logo} alt="site Logo" className="navbar-logo" />
                <span className="navbar-title">Something GPT</span>
            </div>
            <div className="navbar-buttons">
                <Form>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Detection"
                        checked={isSwitchActive}
                        onChange={handleSwitchChange}
                    />
                </Form>
                <button onClick={() => navigate('/')}>Home</button> {/*Replace the home button with user's username. Just pull from database*/}
                {user && <button onClick={() => navigate('/chat')}>Chat</button>}
                {user && <span className="username-style">Hi, {username}</span>}
                {user && (
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                )}
                {!user && <button onClick={() => navigate('/login')}>Login</button>}
            </div>
        </nav>
    );
};

export default Navbar;
