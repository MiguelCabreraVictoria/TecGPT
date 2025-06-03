// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './App.css';

export default function App() {
  // Estado de tema (light/dark). Sigue vigente el switch, pero ya no hay "auth".
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
    // Opcional: podrías limpiar algo de estado aquí, pero como no hay login real, 
    // podemos dejarlo vacío o mostrar un mensaje.
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
        {/* La ruta /login permanece para que puedas visitar login si lo deseas */}
        <Route path="/login" element={<Login onLogin={() => {}} />} />

        {/* /chat ya no chequea autenticación, muestra directamente el Chat */}
        <Route path="/chat" element={<Chat />} />

        {/* Cualquier otra ruta (incluyendo la raíz “/”) redirige a /chat */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </div>
  );
}