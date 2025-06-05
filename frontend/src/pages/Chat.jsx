import React, { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Agrega el prompt del usuario como ventana
    setMessages((msgs) => [...msgs, { type: 'user', text: prompt }]);

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
        setMessages((msgs) => [...msgs, { type: 'bot', text: data.response || 'No response' }]);
      } else {
        setMessages((msgs) => [...msgs, { type: 'bot', text: data.message || 'Error from server' }]);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { type: 'bot', text: 'Network error' }]);
    }
    setPrompt('');
  };

  return (
    <div className="main-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
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