// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState('');
  
  const navigate = useNavigate();
  const { login, loading, error, success, clearError } = useLogin();

  // Redirigir al chat cuando el login sea exitoso
  useEffect(() => {
    if (success) {
      console.log('✅ Login successful! Redirecting to chat...');
      // Llamar onLogin si se pasa como prop (para actualizar estado global)
      if (onLogin) {
        onLogin();
      }
      navigate('/chat');
    }
  }, [success, navigate, onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');
    clearError();

    // Validación básica
    if (!email.trim() || !password.trim()) {
      setClientError('Please fill in both fields');
      return;
    }

    console.log('🚀 Attempting to login user...');

    try {
      const userData = {
        email: email.trim().toLowerCase(),
        password,
      };
      
      console.log('📝 Login data:', { email: userData.email, password: '***' });
      
      const result = await login(userData);
      console.log('✅ Login result:', result);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      // El error ya está manejado en el hook
    }
  };

  // Mostrar error del cliente o del servidor
  const displayError = clientError || error;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome Back</h2>
        {displayError && <div className="login-error">{displayError}</div>}
        <form onSubmit={handleSubmit} className="login-form">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Opción de Registrarse */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>

        {/* Debug info (remover en producción) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
            <strong>Debug:</strong><br/>
            Loading: {loading ? 'Yes' : 'No'}<br/>
            Error: {error || 'None'}<br/>
            Success: {success ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    </div>
  );
}