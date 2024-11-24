import React, { useState } from 'react';
import axios from 'axios';

import './PaymentMethod.css';  
const PaymentPage = () => {
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState(0);

   const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };


  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

   const handlePayment = async () => {
    try {
      const response = await axios.post('/api/payment', {
        paymentMethod,
        amount,
      });
      

      console.log(response.data);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="container"> {}
      <h1>Payment Method</h1>
      <div>
        <label>
         
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="">Select a payment method</option>
            <option value="gcash">GCash</option>
            <option value="paypal">PayPal</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
      </div>
      <button onClick={handlePayment}>Process Payment</button>
    </div>
  );
};

export default PaymentPage;

