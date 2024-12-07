import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone for the drag-and-drop functionality
import './index.css';

const AccountProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Store user data in state
  const [loading, setLoading] = useState(true); // Manage loading state
  const [image, setImage] = useState(null); // State to hold the profile image
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview

  // Get the userId from localStorage
  const userId = localStorage.getItem('user_id');

  // Fetch user data and image
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const userImage = localStorage.getItem('user_image'); // Assuming the image URL is stored here

        if (!userId || !username || !email) {
          throw new Error('No user data found');
        }

        setUserData({ userId, username, email });
        setImage(userImage || ''); // Set the image URL if available
        setImagePreview(userImage || ''); // Set the image preview URL
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

  // Handle image drop (drag and drop functionality)
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file); // Set the selected image file
        setImagePreview(reader.result); // Set the preview image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    maxFiles: 1,
  });

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored user data
    toast.success('Logged out successfully!');
    navigate('/'); // Redirect to login page
  };

  const handleImageUpload = async () => {
    if (!image) {
      toast.error('Please select an image to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('userId', userId);  // Append userId from localStorage or state
    formData.append('image', image);    // Append the image file
  
    try {
      const response = await fetch('http://localhost:5001/api/update-profile-image', {
        method: 'PUT',
        body: formData, // Send FormData directly
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const data = await response.json();
      toast.success('Profile image updated successfully');
      localStorage.setItem('user_image', data.imageUrl); // Store the updated image URL
      setImagePreview(data.imageUrl); // Update the preview with the new image URL
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
      console.error(error);
    }
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
    <div className="account-profile-container">
      <h1>Account Details</h1>

      <div className="profile-image-container">
        <div 
          className="image-wrapper" 
          style={{ backgroundImage: `url(${imagePreview || 'default-image.jpg'})` }} 
        >
          {/* Display image preview here */}
        </div>

        {/* Dropbox for image upload */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag and drop an image here, or click to select one</p>
        </div>

        <button onClick={handleImageUpload} className="upload-button">
          Update Image
        </button>
      </div>

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

      <ToastContainer /> {/* Toast container for displaying toasts */}
    </div>
  );
};

export default AccountProfile;
