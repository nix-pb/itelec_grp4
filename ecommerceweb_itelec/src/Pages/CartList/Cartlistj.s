import React, { useState } from 'react';
import './Cartlist.css';

const productsData = [
  {
    id: 'product1',
    name: 'Product Name 1',
    description: 'Product description goes here.',
    price: 10.0,
    image: 'https://storage.googleapis.com/a1aa/image/XRKKTy7MnJ6DNh22XdOPOwOimVnbDnACVxR8e9wfqJkRshxTA.jpg',
  },
  {
    id: 'product2',
    name: 'Product Name 2',
    description: 'Product description goes here.',
    price: 20.0,
    image: 'https://storage.googleapis.com/a1aa/image/8RWfmXVccJ04VKWhhnXsFimPaoEYOlny7fm5SezWmJQkYDjnA.jpg',
  },
  {
    id: 'product3',
    name: 'Product Name 3',
    description: 'Product description goes here.',
    price: 30.0,
    image: 'https://storage.googleapis.com/a1aa/image/F3AOIDmeehmRzk4WXOy8p2l9iPjwIxEhQYKnbM9AidEl2hxTA.jpg',
  },
];

function Cart() {
  const [products, setProducts] = useState(
    productsData.map((product) => ({ ...product, quantity: 1, checked: false }))
  );

  const updateQuantity = (id, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const toggleCheckbox = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const subtotal = products
    .filter((product) => product.checked)
    .reduce((total, product) => total + product.price * product.quantity, 0);

  const proceedToCheckout = () => {
    alert(`Proceeding to checkout with total amount: ₱${subtotal.toFixed(2)}`);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Cart List</h1>
        <button onClick={() => (window.location.href = '/')}>Go to Home</button>
      </div>
      <div className="cart-main">
        <div className="cart-products">
          {products.map((product) => (
            <div className="product-item" key={product.id} id={product.id}>
              <input
                type="checkbox"
                checked={product.checked}
                onChange={() => toggleCheckbox(product.id)}
              />
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p className="product-price">₱{product.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                <input type="text" value={product.quantity} readOnly />
                <button onClick={() => updateQuantity(product.id, 1)}>+</button>
              </div>
              <button className="remove-button" onClick={() => removeProduct(product.id)}>
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
          <button onClick={proceedToCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;


