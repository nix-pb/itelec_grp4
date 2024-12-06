import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStore, FaComments } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import './ProductDetails.css';
import HeaderCustomer from '../HeaderCustomer';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigate to Order Form with product details
  const goToOrderForm = () => {
    console.log('Product being passed:', product);
    navigate('/OrderForm', { state: { id: product.id, name: product.name, price: product.price, image: product.image, seller_id: product.seller_id } });
  };

  // Function to add the product to the cart
  const addToCart = async () => {
    const userId = localStorage.getItem('user_id'); // Fetch dynamic user ID from local storage
  
    console.log('User ID from localStorage:', userId);
  
    if (!userId) {
      toast.error('User not logged in. Please log in to add items to the cart.');
      return;
    }
  
    // Check for missing fields and show a toast for each missing one
    let hasError = false;
  
    if (!product.id) {
      toast.error('Product ID is required.');
      hasError = true;
    }
    if (!product.name) {
      toast.error('Product name is required.');
      hasError = true;
    }
    if (!product.price) {
      toast.error('Product price is required.');
      hasError = true;
    }
    if (!product.image) {
      toast.error('Product image is required.');
      hasError = true;
    }
    if (!product.seller_id) {
      toast.error('Seller ID is required.');
      hasError = true;
    }
  
    if (hasError) {
      return;
    }
  
    const orderData = {
      productId: product.id, 
      userId: userId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      seller_id: product.seller_id,  // Add seller_id to the order data
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product to cart');
      }
  
      const data = await response.json();
      console.log('Product added to cart successfully:', data);
      toast.success('Product added to cart successfully');  // Display success message
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error(`There was an issue adding the product to your cart. ${error.message}`);  // Error message if the request fails
    }
  };
  

  // Navigate to the shop page of the product seller
  const goToShop = () => {
    if (product?.seller_id) {
      navigate(`/shop?seller_id=${product.seller_id}`);
    }
  };

  // Navigate to the chat page with the product seller
  const goToChat = () => {
    if (product?.seller_id) {
      navigate(`/chat?seller_id=${product.seller_id}`);
    }
  };

  // Fetch product details
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

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display product not found message
  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <>
      <HeaderCustomer />
      <div className="product-details">
        <div className="top-buttons">
          <button className="icon-button" onClick={goToShop} title="Shop">
            <FaStore size={24} /> View Shop
          </button>
          {/* 
          <button className="icon-button" onClick={goToChat} title="Chat">
            <FaComments size={24} /> Chat Seller
          </button>
          */}
        </div>

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

        <div className="rowrent">
          <button className="rent-button" onClick={goToOrderForm}>Rent now</button>
          
          <button className="add-to-cart-button" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
