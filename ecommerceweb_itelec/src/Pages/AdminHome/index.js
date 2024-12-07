import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LineChart from './LineChart';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ProductListAdmin from '../ProductListAdmin';
import './index.css'; 
import HeaderAdmin from '../../Components/HeaderAdmin';
import ModalComponent from '../../Components/ModalComponent';

const AdminHome = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const userId = localStorage.getItem('user_id');

    const [chartData, setChartData] = useState({ dates: [], quantities: [] });
    const [monthlySales, setMonthlySales] = useState({ revenue: 0, products_sold: 0, products_displayed: 0 });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/chart-data') 
            .then(response => {
                setChartData(response.data);
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            });

        axios.get('/api/monthly-sales')
            .then(response => {
                setMonthlySales(response.data);
            })
            .catch(error => {
                console.error('Error fetching monthly sales data:', error);
            });
    }, []);

    // Fetch orders for the logged-in user
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:5001/api/ordersadmin?seller_id=${userId}`);
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);
    

    const handleAddProductClick = () => {
        navigate('/AdminAddProduct'); 
    };

    const handleUpdateOrderStatus = async (orderId) => {
        try {
            const response = await axios.put('http://localhost:5001/api/update-order-status', {
                order_id: orderId,
                new_status: 'In Transit',
            });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'In Transit' } : order
            ));
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div>
            <HeaderAdmin />
            <ModalComponent />
            <h1>Seller Dashboard</h1>
            <ToastContainer />
            <div className="chart-container">
                <LineChart chartData={chartData} />
            </div>
            <div className="info-container">
                <div className="info-box">
                    <p><strong>Revenue:</strong> PHP {monthlySales.revenue}</p>
                </div>
                <div className="info-box">
                    <p><strong>Products Sold:</strong> {monthlySales.products_sold}</p>
                </div>
                <div className="info-box">
                    <p><strong>Products Displayed:</strong> {monthlySales.products_displayed}</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-container">
                <h2>Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>User</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Purchase Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.name}</td>
                                    <td>{order.user_id}</td>
                                    <td>PHP {order.price}</td>
                                    <td>{order.quantity}</td>
                                    <td>{new Date(order.purchase_date).toLocaleDateString()}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.status === 'Pending' && (
                                            <button onClick={() => handleUpdateOrderStatus(order.id)} className="status-button">
                                                Mark as "In Transit"
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="button-container">
                <button onClick={handleAddProductClick} className="add-product-button">
                    Add Product
                </button>
            </div>
            <div className="line"></div>
            <div>
                <h3>Your Products:</h3>
                <ProductListAdmin />
            </div>
        </div>
    );
};

export default AdminHome;
