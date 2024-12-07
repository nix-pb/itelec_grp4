// CheckoutTab.js
import React from 'react';
import './index.css'; 


const CheckoutTab = () => {
  return (
    <div className="checkout-tab">
      <div className="checkout-content">
        <span>Your Total: PHP 0.00</span> 
      </div>
      <button className="checkout-button">Check Out</button>
    </div>
  );
};

export default CheckoutTab;
