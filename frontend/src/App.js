import React, { useState } from 'react';
import { useChat } from 'ai/react';
import './App.css';

function App() {
  const { input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:8000/api/chat',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with input:', input);
    setIsLoading(true);
    
    setLastQuestion(input);

    await handleSubmit(e);
    setIsLoading(false);
    
    const responseMessage = await fetchResponse();
    setLatestMessage(responseMessage);
  };

  const fetchResponse = async () => {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
    });
    const data = await response.json();
    return data.content;
  };

  console.log('Latest Message:', latestMessage);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Apartment Addicts Knowledge Base</h1>
      </header>
      <main className="App-main">
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
        <div className="last-question">
          <p>{lastQuestion}</p>
        </div>
        <div className="chat-container">
          {latestMessage && (
            <div className="message assistant">
              <strong>AI:</strong>
              <p>{latestMessage}</p>
            </div>
          )}
        </div>
        <div className="output-container">
          <h2>Response from AI:</h2>
          <p>{latestMessage}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
