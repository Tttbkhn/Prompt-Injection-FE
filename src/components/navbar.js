import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png'

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <img
          src={logo}
          alt="site Logo"
          className="navbar-logo"
        />
        <span className="navbar-title">Something GPT</span>
      </div>
      <div className="navbar-buttons">
        <button onClick={() => navigate('/')}>Home</button> {/*Replace the home button with user's username. Just pull from database*/}
        <button onClick={() => { /* Logout function yet to be implemented */ }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;