import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Orders List</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        {order.product_name} - {order.rent_price} - {order.quantity} - {order.purchase_date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;
