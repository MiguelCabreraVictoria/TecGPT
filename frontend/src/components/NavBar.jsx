import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logoTecGpt.png';

export default function NavBar({ theme, toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const showLogout = currentPath !== '/login' && currentPath !== '/register';

  const handleLogout = () => {
    navigate('/logout');
  };

  // Solo muestra branding completo en /chat
  const showBranding = currentPath === '/chat';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        
        <img src={logo} alt="TecGPT Logo" className="logo-img-large" />
      </div>

      
      {showBranding && (
        <div className="navbar-center">
          <span className="brand-logo">TecGPT</span>
        </div>
      )}

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