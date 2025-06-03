// src/components/NavBar.jsx
import React from 'react';
import logo from '../assets/logoTecGpt.png';

export default function NavBar({ theme, toggleTheme, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="TecGPT Logo" className="logo-img" />
      </div>
      <div className="navbar-right">
        <label className="theme-switch">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <span className="switch-slider">
            <span className="icon-sun">☀️</span>
            <span className="icon-moon">🌙</span>
          </span>
        </label>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}