import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import HeaderBack from "../../Components/HeaderBack";

const AccountProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // Get the userId from localStorage
  const userId = localStorage.getItem('user_id');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');

        if (!userId || !username || !email) {
          throw new Error('No user data found');
        }

        setUserData({ userId, username, email });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
        navigate('/'); // Redirect to login page if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); 
    toast.success('Logged out successfully!');
    navigate('/');
  };

  if (loading) {
    return <div className="account-profile-container">Loading your account details...</div>;
  }

  if (!userData) {
    return (
      <div className="account-profile-container">
        <h2>No user data available. Please log in.</h2>
        <button onClick={() => navigate('/')} className="btn-login">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
    <HeaderBack />
    <div className="account-profile-container">
      <h1>Account Details</h1>

      <div className="account-profile-details">
        <p><strong>User ID:</strong> {userData.userId}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      <div className="action-buttons">
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <ToastContainer /> 
    </div>
    </>
  );
};

export default AccountProfile;
