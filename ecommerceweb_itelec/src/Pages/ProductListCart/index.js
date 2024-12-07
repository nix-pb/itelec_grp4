import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListCart = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched Products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  console.log('Selected Category:', selectedCategory);
  console.log('All Products:', products);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  console.log('Filtered Products:', filteredProducts);

  const handleQuantityChange = (productId, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const newQuantity = product.quantity + change;
          return { ...product, quantity: newQuantity < 0 ? 0 : newQuantity };
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
      <div className="product-list-cart">
        {filteredProducts.length === 0 ? (
          <p></p>
        ) : (
          filteredProducts.map((product) => (
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
                  onClick={() => handleQuantityChange(product.id, -1)} 
                  className="quantity-button"
                  disabled={product.quantity === 0}
                >
                  -
                </button>
                <span>{product.quantity || 0}</span>
                <button 
                  onClick={() => handleQuantityChange(product.id, 1)} 
                  className="quantity-button"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListCart;
