import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListReceived = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('user_id');

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
          orders.map((order) => {
            // Calculate price with shipping fee if price is less than or equal to 600
            const totalPrice = parseFloat(order.price) <= 600 ? parseFloat(order.price) + 50 : parseFloat(order.price);

            return (
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
                  {/* Display total price and shipping fee if applicable */}
                  <p className="product-price-order">
                    PHP {totalPrice}
                    {parseFloat(order.price) <= 600 }
                  </p>
                  {parseFloat(order.price) <= 600 && <p className="shipping-text">(shipping fee included)</p>}
                  <p className="product-quantity-order">Quantity: {order.quantity}</p>
                  <p className="product-purchase-date-order">
                    Purchase Date: {new Date(order.purchase_date).toLocaleDateString()}
                  </p>

                  <button
                    className="buy-again-button"
                    onClick={() => handleBuyAgain(order.product_id)} 
                  >
                    Buy Again
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductListReceived
