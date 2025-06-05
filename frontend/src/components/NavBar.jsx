import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logoTecGpt.png';


export default function NavBar({ theme, toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname; // por ejemplo "/login" o "/chat" o "/register"

  // Oculta el botón de logout si estamos en /login o /register
  const showLogout = currentPath !== '/login' && currentPath !== '/register';

  const handleLogout = () => {
    navigate('/logout');
  };

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
        {showLogout && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}