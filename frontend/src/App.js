import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('themePreference');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.body.classList.add(saved);
    } else {
      document.body.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.body.classList.replace(theme, next);
    setTheme(next);
    localStorage.setItem('themePreference', next);
  };

  return (
    <div
      className="app-wrapper"
      onMouseMove={(e) => {
        const xPercent = (e.clientX / window.innerWidth) * 100;
        const yPercent = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouseX', `${xPercent}%`);
        document.documentElement.style.setProperty('--mouseY', `${yPercent}%`);
      }}
    >
      <div className="background" />

      <NavBar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        {/* Ruta catch-all → redirige a /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}