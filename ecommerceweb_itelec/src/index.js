import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Ensure your global styles are applied
// import reportWebVitals from './reportWebVitals'; // Uncomment if you plan to use it
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer /> 
  </React.StrictMode>
);

// Optional: Log performance metrics
// If you're not using this, you can remove the import and the function below
// reportWebVitals(console.log);
