import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        type: 'message',
        ...data
      }]);
    });

    socket.on('user_joined', (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        type: 'system',
        message: `${data.username} joined the chat`,
        timestamp: data.timestamp
      }]);
      setUserCount(data.userCount);
    });

    socket.on('user_left', (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        type: 'system',
        message: `${data.username} left the chat`,
        timestamp: data.timestamp
      }]);
      setUserCount(data.userCount);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { message });
      setMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isJoined) {
    return (
      <div className="app">
        <div className="join-container">
          <h1>Real-Time Chat</h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
            />
            <button type="submit" className="join-button">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Real-Time Chat</h2>
          <div className="user-info">
            <span className="current-user">{username}</span>
            <span className="user-count">{userCount} user{userCount !== 1 ? 's' : ''} online</span>
          </div>
        </div>
        
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.type === 'system' ? 'system-message' : ''} ${msg.username === username ? 'own-message' : ''}`}
            >
              {msg.type === 'message' ? (
                <>
                  <div className="message-header">
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-text">{msg.message}</div>
                </>
              ) : (
                <div className="system-text">
                  {msg.message}
                  <span className="system-time">{formatTime(msg.timestamp)}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;