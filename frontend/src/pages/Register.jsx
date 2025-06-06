import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [campus, setCampus] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !campus.trim() ||
      !name.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@tec\.mx$/.test(email)) {
      setError('Email must be a valid @tec.mx address');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campus, name, lastName, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setSuccess("Registration Success");
        setTimeout(() => navigate('/chat'), 1000);
        return;
      }

    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Create Account</h2>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          />
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <button type="submit">Register</button>

        <div className="login-bottom-text">
          Already have an account?{" "}
          <span
            className="login-link"
            tabIndex={0}
            style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/login')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/login'); }}
          >
            Login
          </span>
        </div>

        </form>
      </div>
    </div>
  );
}