import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatPage.css';  

const socket = io('http://localhost:5001');

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const msgData = { username, message, timestamp: new Date() };
    socket.emit('chat message', msgData);
    setChat((prevChat) => [...prevChat, msgData]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Name</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {chat.map((msg, idx) => (
          <div key={idx} className="message">
            <strong>{msg.username}:</strong> {msg.message} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          aria-label="Chat message input"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;


