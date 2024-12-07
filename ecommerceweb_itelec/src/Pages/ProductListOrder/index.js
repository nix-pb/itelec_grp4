import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListOrder = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

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

  const handleRatingClick = (product, star) => {
    
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, rating: star } : p
    );
    setProducts(updatedProducts);
  };

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {filteredProducts.length === 0 ? (
          <p></p> 
        ) : (
          filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-card-order" 
              onClick={() => handleProductClick(product.id)} 
            >
              <div className="product-image-wrapper-order">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image-order" 
                  />
                ) : (
                  <div className="placeholder-image-order">No Image Available</div>
                )}
              </div>
              <div className="product-info-order">
                <h3>{product.name}</h3>
                <div className="product-rating-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= product.rating ? 'active' : ''}`} 
                      onClick={(event) => {
                        event.stopPropagation(); 
                        handleRatingClick(product, star); 
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="product-info-order">
                <p className="product-price-order">PHP {product.price}</p>
                <button className="buy-again-button">Buy Again</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListOrder;
