import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Starting = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/buyerlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);

        toast.success('Login successful!');
        navigate('/Home'); // Navigate to the home page
      } else {
        setError(data.message || 'Login failed.');
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred while trying to log in.');
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleRegister = () => {
    navigate('/AccountType');
  };

  const handleSigninSeller = () => {
    navigate('/SignIn');
  };

  return (
    <div className="start-page">
      <div className="left-section">
        <img
          src="https://storage.googleapis.com/a1aa/image/OtRcMNHfsyTGeEa3FpdtsCmBmFoYfZMnQvmIJ7Uv84ZCfbJPB.jpg"
          alt="Tool Zone Logo"
          className="logo-image"
          style={{ width: '500px', height: '500px' }}
        />
        <h1>TOOL ZONE</h1>
        <p>Your Project, Our Tools!</p>
      </div>

      <div className="right-section">
        <h2>SIGN IN AS BUYER</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="sign-in-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-signin">
            Sign In
          </button>
          <button type="button" className="btn-register" onClick={handleRegister}>
            Register
          </button>
          <button type="button" className="btn-seller" onClick={handleSigninSeller}>
            Sign in as Seller
          </button>
        </form>
      </div>
    </div>
  );
};

export default Starting;
