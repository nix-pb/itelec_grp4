// App.js (React Component)
import React, { useState } from 'react';
import './Starting.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [registeredPassword, setRegisteredPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);

    const handleRegister = () => {
        const newUsername = prompt('Enter a username to register:');
        const newPassword = prompt('Enter a password to register:');
        if (newUsername && newPassword) {
            setRegisteredUsername(newUsername);
            setRegisteredPassword(newPassword);
            alert('Registration successful! You can now sign in.');
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (username !== registeredUsername || password !== registeredPassword) {
            setErrorMessage(true);
        } else {
            setErrorMessage(false);
            window.location.href = '/home.html'; // Change to React Router if needed
        }
    };

    const handleSellerSignIn = () => {
        if (username !== registeredUsername || password !== registeredPassword) {
            setErrorMessage(true);
        } else {
            setErrorMessage(false);
            window.location.href = '/seller_home.html'; // Change to React Router if needed
        }
    };

    return (
        <div className="bg-gray-800 text-white h-full flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4">
                <a className="text-white cursor-pointer" href="#about-us">About us</a>
            </div>
            <div className="flex items-center justify-center w-full max-w-6xl space-x-8">
                <div className="flex flex-col items-center w-1/2">
                    <img 
                        alt="Tool Zone Logo with various tools" 
                        className="w-64 h-64" 
                        src="https://storage.googleapis.com/a1aa/image/amNsa5cOaMaDFxgJbtqUkOcKPwoStt2mNMh4fWa74UdXay4JA.jpg" 
                    />
                </div>
                <div className="bg-blue-900 p-8 rounded-lg shadow-lg w-1/2 max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">SIGN IN AS BUYER</h2>
                    <form onSubmit={handleSignIn}>
                        <div className="mb-4">
                            <label className="block mb-2" htmlFor="username">Username:</label>
                            <input 
                                className="w-full p-2 rounded-lg text-black" 
                                id="username" 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2" htmlFor="password">Password:</label>
                            <input 
                                className="w-full p-2 rounded-lg text-black" 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="w-full bg-orange-600 text-white py-2 rounded-lg mb-4" type="submit">
                            Sign in
                        </button>
                        <button 
                            className="w-full bg-green-700 text-white py-2 rounded-lg mb-4" 
                            type="button" 
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                        <button 
                            className="w-full bg-red-700 text-white py-2 rounded-lg" 
                            type="button" 
                            onClick={handleSellerSignIn}
                        >
                            Sign in as Seller
                        </button>
                        {errorMessage && <p className="text-red-500 mt-4">Wrong username and password</p>}
                    </form>
                </div>
            </div>
            <div id="about-us" className="mt-16 p-8 bg-gray-700 rounded-lg w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-4 text-center">About Us</h2>
                <p className="text-lg">
                    Welcome to Tool Zone! We are dedicated to providing the best tools for your projects. Whether you are a
                    professional or a DIY enthusiast, we have the right tools for you. Our mission is to ensure that you
                    have access to high-quality tools that make your work easier and more efficient. Thank you for choosing
                    Tool Zone for your tool needs.
                </p>
            </div>
        </div>
    );
}

export default App;




