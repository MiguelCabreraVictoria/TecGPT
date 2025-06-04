// src/hooks/useRegister.js
import { useState } from 'react';
import axios from 'axios';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/auth/register`, userData, {
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
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
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
    register,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};

export default useRegister;