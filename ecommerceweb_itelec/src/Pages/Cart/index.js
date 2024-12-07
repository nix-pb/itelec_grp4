import React from 'react';
import { useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const { id, name, price, quantity } = location.state || {};

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {id && name && price ? (
        <div>
          <p><strong>Product ID:</strong> {id}</p>
          <p><strong>Product Name:</strong> {name}</p>
          <p><strong>Product Price:</strong> PHP {price}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Total Price:</strong> PHP {price * quantity}</p>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default Cart;
