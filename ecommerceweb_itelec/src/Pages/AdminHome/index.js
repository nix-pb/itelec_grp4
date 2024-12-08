import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ProductListAdmin from '../ProductListAdmin';
import './index.css';
import HeaderAdmin from '../../Components/HeaderAdmin';
import ModalComponent from '../../Components/ModalComponent';

const AdminHome = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);  // Track current page
    const [ordersPerPage] = useState(15); // Orders per page
    const [modalLocation, setModalLocation] = useState(null); // State to store location for modal

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

    // Handle opening the modal to display location
    const handleViewLocation = (location) => {
        setModalLocation(location);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setModalLocation(null);
    };

    // Calculate the orders to display for the current page
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination logic
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div>
            <HeaderAdmin />
            <ModalComponent />
            <h1 className="seller-dashboard-heading">Seller Dashboard</h1>

            <ToastContainer />

            {/* Orders Table */}
            <div className="orders-container">
                <h2>Orders</h2>
                {currentOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>User</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Booking Date</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.name}</td>
                                    <td>{order.user_id}</td>
                                    <td>PHP {order.price}</td>
                                    <td>{order.quantity}</td>
                                    <td>{new Date(order.purchase_date).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="view-location-button"
                                            onClick={() => handleViewLocation(order.location)}
                                        >
                                            View Location
                                        </button>
                                    </td>
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

            {/* Pagination Buttons */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={number === currentPage ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                >
                    Next
                </button>
            </div>

            <div className="button-container">
                <button onClick={handleAddProductClick} className="add-product-button">
                    Add Product
                </button>
            </div>

            {/* Location Modal */}
            {modalLocation && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Order Location</h2>
                        <p>{modalLocation}</p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}

            <div className="line"></div>
            <div>
                <h3>Your Products:</h3>
                <ProductListAdmin />
            </div>
        </div>
    );
};

export default AdminHome;
