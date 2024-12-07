import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListInTransit = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id'); // Use 'user_id' key from localStorage

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the specific product detail page
  };

  const handleMarkAsReceived = async (orderId) => {
    try {
      const response = await fetch('http://localhost:5001/api/mark-order-ratenow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.message || 'Failed to update order status');
      }
  
      const data = await response.json();
      console.log('Success:', data.message);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error.message);
      alert('Failed to update order status. Please try again.');
    }
  };
  

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User ID is missing. Please log in.');
        return;
      }

      const url = `http://localhost:5001/api/orders_intransit?user_id=${userId}`;

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

    fetchOrders();
  }, [userId]);

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>}

        {orders.length === 0 ? (
          <p>No pending orders found for this user.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="product-card-order"
              onClick={() => handleProductClick(order.id)}
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
                <div className="product-actions">
                  <button className="buy-again-button">Buy Again</button>
                  {order.status === 'In Transit' && (
                    <button
                      className="received-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent onClick
                        handleMarkAsReceived(order.id);
                      }}
                    >
                      Mark as Received
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListInTransit;
