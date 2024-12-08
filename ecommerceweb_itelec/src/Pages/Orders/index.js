import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListPending from '../ProductListPending';
import ProductListInTransit from '../ProductListInTransit';
import ProductListRateNow from '../ProductListRateNow';
import ProductListReceived from '../ProductListReceived';
import HeaderNoSearch from '../../Components/HeaderNoSearch';

const Orders = () => {
    const navigate = useNavigate();

    const [orderStatus, setOrderStatus] = useState("Pending");

    return (
        <>
            <HeaderNoSearch />

            
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                    marginTop: "20px",
                    gap: "10px", 
                }}
            >
                <button
                    onClick={() => setOrderStatus("Pending")}
                    style={{
                        padding: "10px",
                        backgroundColor: orderStatus === "Pending" ? "#192B44" : "#f0f0f0",
                        color: orderStatus === "Pending" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                    }}
                >
                    Pending
                </button>
                <button
                    onClick={() => setOrderStatus("In Transit")}
                    style={{
                        padding: "10px",
                        backgroundColor: orderStatus === "In Transit" ? "#192B44" : "#f0f0f0",
                        color: orderStatus === "In Transit" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                    }}
                >
                    In Transit
                </button>
                <button
                    onClick={() => setOrderStatus("Rate Now")}
                    style={{
                        padding: "10px",
                        backgroundColor: orderStatus === "Rate Now" ? "#192B44" : "#f0f0f0",
                        color: orderStatus === "Rate Now" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                    }}
                >
                    Rate Now
                </button>
                <button
                    onClick={() => setOrderStatus("Received")}
                    style={{
                        padding: "10px",
                        backgroundColor: orderStatus === "Received" ? "#192B44" : "#f0f0f0",
                        color: orderStatus === "Received" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                    }}
                >
                    Received
                </button>
            </div>

            
            {orderStatus === "Pending" && <ProductListPending />}
            {orderStatus === "In Transit" && <ProductListInTransit />}
            {orderStatus === "Rate Now" && <ProductListRateNow />}
            {orderStatus === "Received" && <ProductListReceived />}
        </>
    );
};

export default Orders;
