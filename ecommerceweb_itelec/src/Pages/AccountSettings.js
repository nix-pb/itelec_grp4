import React, { useEffect, useState } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [currentData, setCurrentData] = useState({
    username: "No username provided",
    email: "No email provided",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username, email } = JSON.parse(storedUser);
      setCurrentData({
        username: username || "No username provided",
        email: email || "No email provided",
      });
      setFormData((prev) => ({
        ...prev,
        username: username || "",
        email: email || "",
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("Profile updated:", data);
      alert("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="container">
      <h1>Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <p className="info-text">
            <strong>Username:</strong> <span>{currentData.username}</span>
          </p>
          <label htmlFor="username">Change Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <p className="info-text">
            <strong>Email:</strong> <span>{currentData.email}</span>
          </p>
          <label htmlFor="email">Change Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Change Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;


