import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import HeaderCustomer from "../../Components/HeaderCustomer";
import Coupon from "../../Components/Coupon";

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name, price, term_value, term_id, description, image, seller_id } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const shippingFee = 50; // Fixed shipping fee

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handleDateChange = (e) => {
    setPurchaseDate(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    
    const user_id = localStorage.getItem('user_id');
    let hasError = false;

    // Form validation
    if (!user_id) {
      toast.error("User information is missing. Please log in first.");
      hasError = true;
    }

    if (!id) {
      toast.error("Product ID is missing.");
      hasError = true;
    }

    if (!name) {
      toast.error("Product name is missing.");
      hasError = true;
    }

    if (!price) {
      toast.error("Product price is missing.");
      hasError = true;
    }

    if (!quantity || quantity <= 0) {
      toast.error("Quantity must be greater than 0.");
      hasError = true;
    }

    if (!purchaseDate) {
      toast.error("Purchase date is required.");
      hasError = true;
    }

    if (!seller_id) {
      toast.error("Seller ID is missing.");
      hasError = true;
    }

    if (!locationInput) {
      toast.error("Location is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Calculate total cost
    const priceNum = parseFloat(price); // Ensure price is a number
    const subtotal = priceNum * quantity;
    let totalCost = subtotal;

    // Add shipping fee only if price is 600 or less
    if (priceNum <= 600) {
      totalCost += shippingFee;
    }

    // Format total cost for sending to backend
    const formattedTotalCost = totalCost.toFixed(2);

    // Send order data
    const orderData = [{
      user_id: user_id,
      product_id: id,
      name: name,
      price: formattedTotalCost,  // Use formatted total cost here
      quantity: quantity,
      purchase_date: purchaseDate,
      image: image,
      seller_id: seller_id,
      location: locationInput,
    }];
    
    try {
      const response = await fetch('http://localhost:5001/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(`Failed to place order: ${responseData.message || "Unknown error"}`);
        return;
      }

      toast.success("Your order has been processed successfully!");
      setTimeout(() => navigate('/Orders'), 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("There was an issue placing your order. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
    else setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Product not found!</div>;

  // Calculate total cost
  const priceNum = parseFloat(price); // Ensure price is a number
  const subtotal = priceNum * quantity;
  let totalCost = subtotal;

  // Add shipping fee only if price is 600 or less
  if (priceNum <= 600) {
    totalCost += shippingFee;
  }

  const formattedTotalCost = totalCost.toFixed(2);  // Format the total cost to 2 decimal places

  return (
    <>
      <HeaderCustomer />
      <form className="order-form" onSubmit={handleConfirmOrder}>
        <h2>Order Form</h2>
        {id && name && price ? (
          <>
            <p><strong>Product Name:</strong> {name}</p>
            <p><strong>Product Price:</strong> PHP {priceNum} / {term_value} {term_id}</p>

            {image ? (
              <div className="product-image-container">
                <img src={image} alt={name} className="product-image" />
              </div>
            ) : (
              <div className="product-image-container">
                <img src="https://via.placeholder.com/150" alt="Placeholder" className="product-image" />
              </div>
            )}

            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              required
            />

            <label htmlFor="purchaseDate">Choose a date to book:</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={purchaseDate}
              onChange={handleDateChange}
              required
            />

            <label htmlFor="location">Delivery Address:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={locationInput}
              onChange={handleLocationChange}
              required
              placeholder="Enter delivery address"
            />

            <Coupon totalCost={totalCost} />

            

            {/* Order Summary Section */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><span>Subtotal:</span> PHP {subtotal.toFixed(2)}</p>
              {priceNum <= 600 ? (
                <p><span>Shipping Fee:</span> PHP {shippingFee}</p>
              ) : (
                <p><span>Shipping Fee:</span> Free Shipping</p>
              )}
              <hr />
              <p><span>Total:</span> <strong>PHP {formattedTotalCost}</strong></p>
            </div>

            <button type="submit">Confirm Order</button>
          </>
        ) : (
          <p>Product details not available.</p>
        )}
        <ToastContainer
          closeButton={false}
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </form>
    </>
  );
};

export default OrderForm;
