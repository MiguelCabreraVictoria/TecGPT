import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logoTecGpt.png';

export default function NavBar({ theme, toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // ¿Estamos en login/register?
  const isCompact = currentPath === '/login' || currentPath === '/register';
  const showLogout = !isCompact;

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <nav className={`navbar${isCompact ? ' navbar--compact' : ''}`}>
      <div className="navbar-left">
        {/* Logo solo si NO es compacta */}
        {!isCompact && (
          <img src={logo} alt="TecGPT Logo" className="logo-img" />
        )}
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