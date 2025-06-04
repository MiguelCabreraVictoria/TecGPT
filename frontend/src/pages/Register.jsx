// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegister from '../hooks/useRegister';

export default function Register() {
  const [campus, setCampus] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState('');
  
  const navigate = useNavigate();
  const { register, loading, error, success, clearError } = useRegister();

  // Redirigir al chat cuando el registro sea exitoso
  useEffect(() => {
    if (success) {
      navigate('/chat');
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');
    clearError();

    // Validación básica: todos los campos obligatorios
    if (
      !campus.trim() ||
      !name.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setClientError('Please fill in all fields');
      return;
    }

    try {
      await register({
        campus: campus.trim(),
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (err) {
      // El error ya está manejado en el hook
      console.error('Registration error:', err);
    }
  };

  // Mostrar error del cliente o del servidor
  const displayError = clientError || error;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Create Account</h2>
        {displayError && <div className="login-error">{displayError}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}