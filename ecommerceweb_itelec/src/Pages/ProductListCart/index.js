import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './index.css';

const ProductListCart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        const message = 'User ID not found in localStorage.';
        console.error(message);
        toast.error(message); // Show toast error
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/cartlistfetch?user_id=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          const message = errorData.message || 'Failed to fetch products.';
          throw new Error(message);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err.message);
        toast.error(err.message); // Show toast error
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
          const newQuantity = Math.max(product.quantity + change, 0); // Prevent negative quantity
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

  return (
    <div className="product-list-container-cart">
      {/* ToastContainer to show toasts */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h2>Your Cart</h2>

      {products.length === 0 && (
        <p>No products found in the cart.</p>
      )}

      <div className="product-list-cart">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card-cart"
            onClick={(e) => {
              if (!e.target.closest('.checkbox-column')) {
                handleProductClick(product.id);
              }
            }}
          >
            <div className="checkbox-column">
              <input
                type="checkbox"
                id={`checkbox-${product.id}`}
                className="checkbox"
                checked={!!selectedProducts[product.id]}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(product.id);
                }}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListCart;
