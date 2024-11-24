import React from "react";
import "./ShopPage.css";

const Shop = () => {
  return (
    <div className="shop-page">
      <SellerHeader />
      <Coupons />
      <FlashDeals />
      <RecommendedProducts />
    </div>
  );
};

const SellerHeader = () => {
  return (
    <div className="seller-header">
      <div className="seller-info">
        <img src="https://via.placeholder.com/80" alt="Seller Logo" className="seller-logo" />
        <div className="seller-details">
          <h2>Daynee-PH</h2>
          <p>Active 3 minutes ago</p>
          <div className="ratings-followers">
            <span>⭐ 4.9/5.0</span>
            <span>5K Followers</span>
          </div>
        </div>
      </div>
      <div className="seller-actions">
        <button className="follow-button">Follow</button>
        <button className="chat-button">Chat</button>
      </div>
    </div>
  );
};

const Coupons = () => {
  return (
    <div className="coupons">
      <div className="coupon">
        <p>₱10 off</p>
        <p>Min. Spend ₱0</p>
        <p>Valid Till: 21.11.2024</p>
        <button className="claim-button">Claim</button>
      </div>
      <div className="coupon">
        <p>₱5 off</p>
        <p>Min. Spend ₱100</p>
        <p>Valid Till: 04.12.2024</p>
        <button className="claim-button">Claim</button>
      </div>
    </div>
  );
};

const FlashDeals = () => {
  const products = [
    { id: 1, name: "Micronized Creatine", discount: 89, oldPrice: 7000, newPrice: 631 },
    { id: 2, name: "Micronized Creatine", discount: 90, oldPrice: 8000, newPrice: 623 },
    { id: 3, name: "BCAA", discount: 85, oldPrice: 5000, newPrice: 423 },
  ];

  return (
    <div className="flash-deals">
      <h3>FLASH DEALS</h3>
      <div className="countdown">00:52:11</div>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src="https://via.placeholder.com/150" alt={product.name} />
            <p>{product.name}</p>
            <p>Discount: {product.discount}%</p>
            <p>
              <span className="old-price">₱{product.oldPrice}</span>{" "}
              <span className="new-price">₱{product.newPrice}</span>
            </p>
            <button className="selling-fast">Selling Fast</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendedProducts = () => {
  const products = [
    { id: 1, name: "Micronized Creatine", price: 631 },
    { id: 2, name: "BCAA", price: 423 },
    { id: 3, name: "Creatine Monohydrate", price: 750 },
  ];

  return (
    <div className="recommended-products">
      <h3>Recommended For You</h3>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src="https://via.placeholder.com/150" alt={product.name} />
            <p>{product.name}</p>
            <p>₱{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
