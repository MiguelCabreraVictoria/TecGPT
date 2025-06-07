import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch("http://172.20.100.111:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (onLogin) onLogin();
        navigate('/chat');
        return;
      } else {
        setError('No token received. Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="brand-logo">TecGPT</div>
        <h2>Welcome Back!</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <div className="login-bottom-text">
          Register {" "}
          <span
            className="login-link"
            style= {{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/register')}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/register'); }}
            >
              Here!
            </span>

            
        </div>

      </div>
    </div>
  );
}