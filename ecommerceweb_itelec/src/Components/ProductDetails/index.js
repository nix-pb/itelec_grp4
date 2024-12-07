import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToOrderForm = () => {
    console.log('Product being passed:', product); 
    navigate('/OrderForm', { state: { id: product.id, name: product.name, price: product.price, image: product.image, seller_id: product.seller_id} });
  };
  
  const addToCart = async () => {
    const userId = '123'; // Hardcoded user ID for demonstration purposes
    const orderData = {
      productId: product.id,
      userId: userId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1, // Default quantity
      purchaseDate: new Date().toISOString().split('T')[0] // Default to current date
    };

    try {
      const response = await fetch('http://localhost:5001/api/cartlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const data = await response.json();
      console.log('Product added to cart successfully:', data);
      alert('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an issue adding the product to your cart. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data); 
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!product) {
    return <div>Product not found!</div>; 
  }

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      {product.image ? ( 
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image" 
        />
      ) : (
        <div className="placeholder-image">No Image Available</div>
      )}
      <p><strong>Rent for:</strong> PHP {product.price}/ {product.term_value} {product.term_id}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <div className='row'>
        <button onClick={goToOrderForm}>Rent now</button>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
