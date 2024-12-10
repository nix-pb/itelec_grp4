import React from 'react';
import './index.css';

const Coupon = ({ totalCost }) => {
  const shippingFeeThreshold = 599;
  const isEligibleForFreeShipping = totalCost >= shippingFeeThreshold;

  return (
    <div className="coupon-container">
      {isEligibleForFreeShipping ? (
        <p className="coupon-message success">Congratulations! You qualify for free shipping!</p>
      ) : (
        <p className="coupon-message info">
          Spend PHP {shippingFeeThreshold - totalCost} more (PHP {shippingFeeThreshold}+) to qualify for free shipping.
        </p>
      )}
    </div>
  );
};

export default Coupon;
