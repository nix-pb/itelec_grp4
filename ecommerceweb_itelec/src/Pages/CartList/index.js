import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cartlist.css';
import Header from '../Header';

function Cartlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [locationInput, setLocationInput] = useState(''); // Location input state

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        toast.error('User ID not found in localStorage.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/cartlistfetch?user_id=${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to fetch products.');
          throw new Error(errorData.message || 'Failed to fetch products.');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error(error.message); 
      }
    };

    fetchProducts();
  }, [userId]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleQuantityChange = (productId, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const newQuantity = Math.max(product.quantity + change, 0);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleDateChange = (productId, date) => {
    setSelectedDates((prev) => ({
      ...prev,
      [productId]: date,
    }));
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value); // Update location state
  };

  const removeProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const subtotal = products
    .filter((product) => selectedProducts[product.id])
    .reduce((total, product) => total + product.price * product.quantity, 0);

  const proceedToCheckout = async () => {
    // Get the selected products from the cart
    const selectedItems = products.filter(product => selectedProducts[product.id]);

    if (selectedItems.length === 0) {
      toast.error('No products selected for checkout.');
      return;
    }

    if (!locationInput) {
      toast.error('Please provide a delivery address.');
      return;
    }

    // Prepare the order data to send to the backend
    const orderData = selectedItems.map(product => ({
      user_id: userId,
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      purchase_date: new Date().toISOString(),
      image: product.image,
      seller_id: product.seller_id,  // Ensure this is included
      selected_date: selectedDates[product.id] || null,
      location: locationInput, // Include the location in the order data
    }));

    console.log('Order data being sent:', orderData);

    try {
      const response = await fetch('http://localhost:5001/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      toast.success('Order placed successfully!');
      // Optionally, redirect to an order confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      toast.error(error.message || 'An error occurred while placing the order');
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>
        <div className="cart-main">
          <div className="cart-products">
            {products.length === 0 && <p>No products found in the cart.</p>}
            {products.map((product) => (
              <div
                className="product-item"
                key={product.id}
                id={product.id}
                onClick={(e) => {
                  // Prevent redirect if clicked on the date picker or its related area
                  if (!e.target.closest('.date-picker') && !e.target.closest('.checkbox-column')) {
                    handleProductClick(product.id);
                  }
                }}
              >
                <div className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.id]}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <label htmlFor={`checkbox-${product.id}`} className="custom-checkbox"></label>
                </div>

                <div className="product-image-wrapper-cart">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image-cart"
                    />
                  ) : (
                    <div className="placeholder-image-cart">No Image Available</div>
                  )}
                </div>

                <div className="product-info-cart">
                  <h3>{product.name}</h3>
                  <p className="product-price-cart">PHP {product.price}</p>
                  {/* Display seller_id */}
                  <p className="product-seller-id">Seller ID: {product.seller_id}</p>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, -1);
                    }}
                    className="quantity-button"
                    disabled={product.quantity === 0}
                  >
                    -
                  </button>
                  <span>{product.quantity || 0}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, 1);
                    }}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>

                <div className="date-picker">
                  <label htmlFor={`date-picker-${product.id}`}>Select Date:</label>
                  <input
                    type="date"
                    id={`date-picker-${product.id}`}
                    value={selectedDates[product.id] || ''}
                    onChange={(e) => handleDateChange(product.id, e.target.value)}
                  />
                </div>

                <button className="remove-button" onClick={(e) => removeProduct(product.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Checkout</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Total</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            {/* New Location Input */}
            <label htmlFor="locationInput">Delivery Address:</label>
            <input
              type="text"
              id="locationInput"
              value={locationInput}
              onChange={handleLocationChange}
              required
              placeholder="Enter delivery address"
            />

            <button onClick={proceedToCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cartlist;
