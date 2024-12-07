import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Header from '../Header';

const App = () => {
  return (
    <>
      <Header />
      <div className="shop-page">
        <SellerHeader />
        <ProductListShop />
      </div>
    </>
  );
};

const SellerHeader = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/Chat");
  };

  return (
    <div className="seller-header">
      <div className="seller-info">
        <img
          src="https://via.placeholder.com/80"
          alt="Seller Logo"
          className="seller-logo"
        />
        <div className="seller-details">
          <h2>Daynee-PH</h2>
          <div className="ratings-followers">
            <span>⭐ 4.9/5.0</span>
          </div>
        </div>
      </div>
      <div className="seller-actions">
        <button className="chat-button" onClick={handleChatClick}>
          Chat
        </button>
      </div>
    </div>
  );
};

const ProductListShop = () => {
  const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ];

  return (
    <div className="recommended-products">
      <h3>Products:</h3>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src="https://via.placeholder.com/150"
              alt={product.name}
              className="product-image"
            />
            <p>{product.name}</p>
            <p>₱{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
