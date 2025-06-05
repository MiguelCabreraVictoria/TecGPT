import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Elimina el token
    localStorage.removeItem("token");
    // Redirige al usuario a la página de login después de 2 segundos
    const timer = setTimeout(() => { navigate('/login'); }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Espero TecGPT haya resuelto tu duda</h2>
        <p>¡Te esperamos pronto!</p>
      </div>
    </div>
  );
}