// src/hooks/useLogin.js
import { useState } from 'react';
import axios from 'axios';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/auth/login`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSuccess(true);
      return data;

    } catch (err) {
      // Manejo de errores de axios
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(false);
  };

  return {
    login,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};

export default useLogin;