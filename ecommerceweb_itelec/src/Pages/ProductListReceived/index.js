import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListReceived = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('user_id'); // Ensure 'user_id' is properly stored in localStorage

  // Fetch orders from the API
  const fetchOrders = async () => {
    if (!userId) {
      setError('User ID is missing. Please log in.');
      return;
    }

    const url = `http://localhost:5001/api/orders_received?user_id=${userId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [userId]);

  // Navigate to the product detail page
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Handle Buy Again button click, navigate to the product page using product_id
  const handleBuyAgain = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>}

        {!error && orders.length === 0 ? (
          <p>No received orders found for this user.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="product-card-order"
              onClick={() => handleProductClick(order.product_id)} // Navigate to product page
            >
              <div className="product-image-wrapper-order">
                {order.image ? (
                  <img
                    src={order.image}
                    alt={order.name}
                    className="product-image-order"
                  />
                ) : (
                  <div className="placeholder-image-order">No Image Available</div>
                )}
              </div>
              <div className="product-info-order">
                <h3>{order.name}</h3>
                <p className="product-status-order">Status: {order.status}</p>
              </div>

              <div className="product-info-order">
                <p className="product-price-order">PHP {order.price}</p>
                <p className="product-quantity-order">Quantity: {order.quantity}</p>
                <p className="product-purchase-date-order">
                  Purchase Date: {new Date(order.purchase_date).toLocaleDateString()}
                </p>

                <button
                  className="buy-again-button"
                  onClick={() => handleBuyAgain(order.product_id)} // Use product_id for Buy Again
                >
                  Buy Again
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListReceived;
