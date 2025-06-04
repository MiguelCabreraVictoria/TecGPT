import React, { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.response || 'No response');
      } else {
        setResponse(data.message || 'Error from server');
      }
    } catch (err) {
      setResponse('Network error');
    }
    setPrompt('');
  };
  return (
    <div className="main-container">
      {/* Aquí va la respuesta simulada, arriba del input */}
      {response && (
        <div className="response-box">
          {response}
        </div>
      )}

      {/* Formulario de chat */}
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="How can I help you?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" className="arrow-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4L12 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 10L12 4L18 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}