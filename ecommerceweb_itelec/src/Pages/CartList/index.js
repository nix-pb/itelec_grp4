import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cartlist.css';
import HeaderNoSearch from '../../Components/HeaderNoSearch';
import Confirmation from './Confirmation/index'; // Assuming this is the confirmation modal

function Cartlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [locationInput, setLocationInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const shippingFee = 50; // Fixed shipping fee

  const userId = localStorage.getItem('user_id');

  // Fetch products from the server
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
          throw new Error(errorData.message || 'Failed to fetch products.');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch products.');
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
        if (product.product_id === productId) {
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
    setLocationInput(e.target.value);
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch('http://localhost:5001/api/cartlistremove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to delete product: " + data.message);
        return;
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
      closeModal();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  // Calculate subtotal including shipping fee logic
  const subtotal = products
    .filter((product) => selectedProducts[product.product_id])
    .reduce((total, product) => {
      const price = product.price;
      const totalPrice = price * product.quantity;
      const fee = price <= 600 ? shippingFee : 0;  // Only add shipping fee if price <= 600
      return total + totalPrice + fee;
    }, 0);

  const proceedToCheckout = async () => {
    const selectedItems = products.filter((product) => selectedProducts[product.product_id]);
    
    if (selectedItems.length === 0) {
      toast.error('No products selected for checkout.');
      return;
    }

    if (!locationInput) {
      toast.error('Please provide a delivery address.');
      return;
    }

    for (let product of selectedItems) {
      if (!selectedDates[product.product_id]) {
        toast.error(`Please select a date for ${product.name}.`);
        return;
      }
    }

    const orderData = selectedItems.map((product) => {
      const purchaseDate = selectedDates[product.product_id] || new Date().toISOString().slice(0, 19).replace('T', ' ');

      return {
        user_id: userId,
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        purchase_date: purchaseDate,
        image: product.image,
        seller_id: product.seller_id,
        selected_date: selectedDates[product.product_id] || null,
        location: locationInput,
      };
    });

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
      setTimeout(() => navigate('/Orders'), 1500);
    } catch (error) {
      toast.error(error.message || 'An error occurred while placing the order');
    }
  };

  return (
    <>
      <HeaderNoSearch />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>
        <div className="cart-main">
          <div className="cart-products">
            {products.length === 0 && <p>No products found in the cart.</p>}
            {products.map((product) => (
              <div className="product-item" key={product.product_id}>
                <div className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.product_id]}
                    onChange={() => handleCheckboxChange(product.product_id)}
                  />
                  <label htmlFor={`checkbox-${product.product_id}`} className="custom-checkbox"></label>
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
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.product_id, -1);
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
                      handleQuantityChange(product.product_id, 1);
                    }}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>

                <div className="date-picker">
                  <label htmlFor={`date-picker-${product.product_id}`}>Select Date:</label>
                  <input
                    type="date"
                    id={`date-picker-${product.product_id}`}
                    value={selectedDates[product.product_id] || ''}
                    onChange={(e) => handleDateChange(product.product_id, e.target.value)}
                    required
                  />
                </div>

                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(product.product_id);
                  }}
                >
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

            {/* Display Shipping Fee */}
            {subtotal <= 600 ? (
              <div className="summary-line">
                <span>Shipping Fee</span>
                <span>₱{shippingFee}</span>
              </div>
            ) : (
              <div className="summary-line">
                <span>Shipping Fee</span>
                <span>Free Shipping</span>
              </div>
            )}

            <div className="summary-line">
              <span>Total</span>
              <span>₱{(subtotal + (subtotal <= 600 ? shippingFee : 0)).toFixed(2)}</span>
            </div>

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

      <Confirmation
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (productToDelete) {
            handleDeleteProduct(productToDelete);
          }
        }}
      />
    </>
  );
}

export default Cartlist;