import React, { useState } from 'react';
import { useChat } from 'ai/react';
import './App.css';

function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:8000/api/chat',
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await handleSubmit(e);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Apartment Addicts Knowledge Base</h1>
      </header>
      <main className="App-main">
        <div className="chat-container">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.role}`}>
              <strong>{m.role === 'user' ? 'You:' : 'AI:'}</strong>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="input-form">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="What can we help you with in your multifamily investing journey?"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
