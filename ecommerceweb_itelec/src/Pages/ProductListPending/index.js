import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListPending = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id'); // Get user_id from localStorage

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'DELETE',
      });
    
      if (!response.ok) {
        // Attempt to parse JSON for detailed error, fallback to text
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Failed to cancel order';
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
    
      const data = await response.json();
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      alert(data.message || 'Order canceled successfully');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert(error.message);
    }
    
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User ID is missing. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/orders_pending?user_id=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch orders: ${errorData.message || response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching pending orders:', err);
        setError(err.message);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>}

        {!error && orders.length === 0 ? (
          <p>No pending orders found for this user.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="product-card-order"
              onClick={() => handleProductClick(order.product_id)}
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
                  className="cancel-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    cancelOrder(order.id);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListPending;
