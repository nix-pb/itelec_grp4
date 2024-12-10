import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListRateNow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [selectedOrderId, setSelectedOrderId] = useState(null); 
  const [selectedRating, setSelectedRating] = useState(0); 
  const userId = localStorage.getItem('user_id'); 

  // Fetch orders from the API
  const fetchOrders = async () => {
    if (!userId) {
      setError('User ID is missing. Please log in.');
      return;
    }

    const url = `http://localhost:5001/api/orders_ratenow?user_id=${userId}`;

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

  // Handle opening the rating modal
  const handleRateNowClick = (orderId, event) => {
    event.stopPropagation(); 
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  // Handle star click event in the modal
  const handleStarClick = (star) => {
    setSelectedRating(star); 
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      alert('Please select a rating.');
      return;
    }
  
    try {
      // Send rating to the server
      const response = await fetch(`http://localhost:5001/api/orders/${selectedOrderId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedRating }),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Failed to submit rating.');
      }
  
      const responseData = await response.json();
  
      // Update the order with the submitted rating
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, rating: selectedRating } : order
        )
      );
  
      // Call API to update order status to "Received"
      const statusResponse = await fetch('http://localhost:5001/api/mark-order-received', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: selectedOrderId }),
      });
  
      if (!statusResponse.ok) {
        const statusResponseData = await statusResponse.json();
        throw new Error(statusResponseData.message || 'Failed to update order status.');
      }
  
      const statusResponseData = await statusResponse.json();
      alert(statusResponseData.message || 'Order status updated to Received.');
  
      // Update the order status in the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: 'Received' } : order
        )
      );
  
      setShowModal(false); 
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };
  

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>}

        {!error && orders.length === 0 ? (
          <p>No products to rate for this user.</p>
        ) : (
          orders.map((order) => {
            // Calculate price with shipping fee if price is less than or equal to 600
            const totalPrice = parseFloat(order.price) <= 600 ? parseFloat(order.price) + 50 : parseFloat(order.price);

            return (
              <div
                key={order.id}
                className="product-card-order"
                onClick={(e) => {
                  if (!showModal) {
                    handleProductClick(order.product_id); 
                  }
                }} 
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

                  {/* Rate Now button or Rating stars */}
                  {order.rating ? (
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${order.rating >= star ? 'active' : ''}`}
                          style={{
                            color: order.rating >= star ? 'yellow' : 'gray',
                            cursor: 'default', 
                          }}
                        >
                          ★
                        </span>
                      ))}
                      <p>Rated: {order.rating} Stars</p>
                    </div>
                  ) : (
                    <button
                      className="rate-now-button"
                      onClick={(e) => handleRateNowClick(order.id, e)} 
                    >
                      Rate Now
                    </button>
                  )}
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

      {/* Modal for rating */}
      {showModal && (
        <div className="rating-modal">
          <div className="rating-modal-content">
            <h3>Rate this order</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${selectedRating >= star ? 'active' : ''}`}
                  onClick={() => handleStarClick(star)}
                  style={{ cursor: 'pointer' }}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-modal-actions">
              <button onClick={handleRatingSubmit} className="submit-rating-button">
                Submit Rating
              </button>
              <button onClick={handleCloseModal} className="close-rating-modal">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListRateNow;
