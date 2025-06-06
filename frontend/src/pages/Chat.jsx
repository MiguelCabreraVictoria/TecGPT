import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const textareaRef = useRef(null); // 1. Ref para el textarea

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setMessages((msgs) => [...msgs, { type: 'user', text: prompt }]);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    let botMsg = 'Network error, please try again later';
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
        botMsg = data.response || 'No response';
      } else {
        botMsg = data.message || 'Error from server';
      }
    } catch {
    }
    setPrompt('');
    textareaRef.current?.focus(); // 3. Vuelve a enfocar el textarea

    setTimeout(() => {
      setMessages((msgs) => [...msgs, { type: 'bot', text: botMsg }]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="main-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}
          >
            <div className="chat-avatar">
              {msg.type === 'user' ? "🧑" : "🤖"}
            </div>
            <div className="bubble-content">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble bot-bubble loading">
            <div className="chat-avatar">🤖</div>
            <div className="bubble-content">El bot está escribiendo…</div>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            ref={textareaRef} // 2. Asigna el ref
            rows={1}
            placeholder="How can I help you?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button type="submit" className="arrow-btn" disabled={isLoading}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 4L12 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 10L12 4L18 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}