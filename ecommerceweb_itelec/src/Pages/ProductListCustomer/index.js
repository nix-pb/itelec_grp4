import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListCustomer = ({ selectedCategory, searchQuery  }) => {
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

// Combine both filters: category and search
const filteredProducts = products.filter((product) => {
  const matchesCategory = !selectedCategory || product.category === selectedCategory;
  const matchesSearch = 
    searchQuery && product.name 
      ? product.name.toLowerCase().startsWith(searchQuery.toLowerCase()) 
      : true; // Allow all if searchQuery or product.name is undefined
  return matchesCategory && matchesSearch;
});

  

  return (
    <div>
      <div className='category_title-customer'></div>
      <div className="product-list-customer">
        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p> 
        ) : (
          filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-card-customer" 
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image-wrapper-customer">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image-customer" 
                  />
                ) : (
                  <div className="placeholder-image-customer">No Image Available</div>
                )}
              </div>
              <h3>{product.name}</h3>
              <div>
                  <strong>PHP</strong> {product.price} / <i className="term">{product.term_value} {product.term_id}</i>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListCustomer;
