// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';   // ← Importa la nueva página
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

  const handleLogout = () => {
    // Ya no hay lógica de “auth” real aquí.
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

      <NavBar theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />

      <Routes>
        {/* Si quieres seguir usando Login: */}
        <Route path="/login" element={<Login onLogin={() => {}} />} />

        {/* La nueva ruta para crear usuarios */}
        <Route path="/register" element={<Register />} />

        {/* Chat libre sin login */}
        <Route path="/chat" element={<Chat />} />

        {/* Ruta catch-all → redirige a /chat */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </div>
  );
}