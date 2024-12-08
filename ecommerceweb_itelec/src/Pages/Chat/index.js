import React, { useState } from 'react';
import './ChatPage.css';  

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'hi!', time: '8:42:35 pm', sent: false },
    { text: 'hello', time: '8:42:35 pm', sent: false },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { text: message, time: new Date().toLocaleTimeString(), sent: true },
      ]);
      setMessage('');  
    }
  };

  return (
    <>
    <div className="chat-app">
      <div className="header">
        <div className="profile">
          <img alt="Profile picture" className="profile-img" src="https://placehold.co/40x40" />
          <span className="name">NAME</span>
        </div>
        <div className="status">
          <div className="dot"></div>
          <span>Active now</span>
        </div>
      </div>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sent ? 'sent' : ''}`}>
            <img alt="Profile picture" className="message-img" src="https://placehold.co/40x40" />
            <div className="text">
              <span>{msg.text}</span>
              <span className="time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          placeholder="Type a message..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </div>
    </>
  );
};

export default ChatApp;



