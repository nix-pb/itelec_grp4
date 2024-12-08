import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [revenue, setRevenue] = useState(0);
    const [productsRented, setProductsRented] = useState(0);
    const [productsDisplayed, setProductsDisplayed] = useState(0);
    const [topItems, setTopItems] = useState([]);
  
    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const storedUserId = localStorage.getItem('user_id');
          if (!storedUserId) {
            throw new Error('User ID not found in local storage.');
          }
  
          const response = await fetch(`/api/analytics?seller_id=${storedUserId}`);
  
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('text/html')) {
            const htmlResponse = await response.text();
            throw new Error(`Unexpected response format. Received HTML instead of JSON. Response: ${htmlResponse}`);
          }
  
          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
          }
  
          const data = await response.json();
  
          // Calculate revenue, products rented, and prepare top items
          let totalRevenue = 0;
          let rentedProducts = 0;
          let displayedProducts = data.length;
  
          const itemsCount = {};
          data.forEach(item => {
            totalRevenue += item.price * item.quantity;
            rentedProducts += item.quantity;
  
            if (!itemsCount[item.name]) {
              itemsCount[item.name] = { quantity: 0, price: item.price };
            }
            itemsCount[item.name].quantity += item.quantity;
          });
  
          const topItems = Object.keys(itemsCount)
            .map(name => ({ name, quantity: itemsCount[name].quantity, price: itemsCount[name].price }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3);
  
          setRevenue(totalRevenue);
          setProductsRented(rentedProducts);
          setProductsDisplayed(displayedProducts);
          setTopItems(topItems);
          
        } catch (error) {
          console.error('Error fetching analytics:', error);
  
          if (error.message.includes('User ID not found')) {
            toast.error('Error: User ID not found. Please log in again.');
          } else if (error.message.includes('Unexpected response format')) {
            toast.error(`Error: ${error.message}`);
          } else if (error.message.includes('API Error')) {
            toast.error(`Error: ${error.message}`);
          } else {
            toast.error('Error: Something went wrong while fetching analytics data.');
          }
        }
      };
  
      fetchAnalytics();
    }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Revenue</h3>
          <p>Php {revenue.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Products Rented</h3>
          <p>{productsRented}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Products Displayed</h3>
          <p>{productsDisplayed}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '45%' }}>
          <h3>Top 3 Items Sold</h3>
          <Doughnut
            data={{
              labels: topItems.map(item => item.name),
              datasets: [
                {
                  data: topItems.map(item => item.quantity),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                },
              ],
            }}
          />
        </div>
        <div style={{ width: '45%' }}>
          <h3>Revenue by Products</h3>
          <Bar
            data={{
              labels: topItems.map(item => item.name),
              datasets: [
                {
                  label: 'Revenue',
                  data: topItems.map(item => item.quantity * 10), // Replace 10 with actual price logic
                  backgroundColor: '#42A5F5',
                },
              ],
            }}
            options={{ maintainAspectRatio: true }}
          />
        </div>
      </div>

      {/* Toast container to display error messages */}
      <ToastContainer />
    </div>
  );
};

export default AnalyticsDashboard;
