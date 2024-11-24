// Dashboard.js
import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    // Initialize Chart
    const ctx = document.getElementById("rentalsChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Number of Rentals",
            data: [30, 45, 28, 50, 60, 70, 90, 100, 80, 60, 50, 40],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  const handleAddProduct = () => {
    const productsGrid = document.getElementById("productsGrid");
    const newProduct = document.createElement("div");
    newProduct.classList.add("product-card");
    newProduct.innerHTML = `
      <button class="remove-product-btn">
        <i class="fas fa-times"></i>
      </button>
      <img alt="Placeholder image of a tool product" class="product-image" src="https://storage.googleapis.com/a1aa/image/wwMPFRoxTwZ5AJmdPebtN5hkTCGearkzp1th4easRKufKALPB.jpg" />
      <h3 class="product-title">New Product</h3>
      <p class="product-description">Description of new product.</p>
      <p class="product-price">₱0</p>
    `;
    productsGrid.appendChild(newProduct);
    attachRemoveEvent(newProduct.querySelector(".remove-product-btn"));
  };

  const attachRemoveEvent = (button) => {
    button.addEventListener("click", () => {
      button.parentElement.remove();
    });
  };

  useEffect(() => {
    document.querySelectorAll(".remove-product-btn").forEach((button) => {
      attachRemoveEvent(button);
    });
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="dashboard-main">
        <section className="overview-section">
          <h2>Monthly Rentals Overview</h2>
          <canvas id="rentalsChart" width="400" height="200"></canvas>
        </section>
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₱12,345</p>
          </div>
          <div className="stat-card">
            <h3>Products Sold</h3>
            <p>1,234</p>
          </div>
          <div className="stat-card">
            <h3>Products Displayed</h3>
            <p>567</p>
          </div>
        </section>
        <section className="products-section">
          <div className="products-header">
            <h2>Your Products</h2>
            <button onClick={handleAddProduct} className="add-product-btn">
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>
          <div id="productsGrid" className="products-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="product-card">
                <button className="remove-product-btn">
                  <i className="fas fa-times"></i>
                </button>
                <img
                  alt={`Placeholder image of product ${index + 1}`}
                  className="product-image"
                  src="https://storage.googleapis.com/a1aa/image/wwMPFRoxTwZ5AJmdPebtN5hkTCGearkzp1th4easRKufKALPB.jpg"
                />
                <h3 className="product-title">Product {index + 1}</h3>
                <p className="product-description">
                  Description of product {index + 1}.
                </p>
                <p className="product-price">₱{(index + 1) * 1000}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="dashboard-footer">
        &copy; 2023 Rent A Tool. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;


