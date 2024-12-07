import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './index.css';

const a_BuyerRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault(); 

        // Basic validation
        if (!username || !password || !email) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/buyerregister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/');
            } else {
                // Here we extract the error message or convert the object to a string
                const errorMessage = data.error
                    ? typeof data.error === 'string' 
                        ? data.error 
                        : JSON.stringify(data.error)
                    : 'Registration failed. Please try again.';
                setError(errorMessage);
                console.error('Registration error:', data.error); // Log the error to the console
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error('Fetch error:', error); // Log fetch errors
        }
    };

    return (
        <>
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>} 
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </>
    );
};

export default a_BuyerRegister;
