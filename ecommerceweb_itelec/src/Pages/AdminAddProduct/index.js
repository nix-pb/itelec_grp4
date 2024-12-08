import React, { useState, useRef, useEffect } from 'react';
import ImageDropBox from './ImageDropBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; 
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../../Components/ModalComponent';
import HeaderBack from "../../Components/HeaderBack";

const AdminAddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        term_id: '',
        term_value: ''
    });

    const navigate = useNavigate();
    const isMounted = useRef(false); // Ref to track if the component is mounted

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false; // Cleanup on unmount
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleImageUpdate = (imageUrl) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            image: imageUrl 
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const priceAsNumber = parseFloat(product.price);
        if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        // Retrieve the seller ID (user ID) from local storage
        const sellerId = localStorage.getItem('user_id');
        console.log("Seller ID:", sellerId); // Debugging line to check seller ID

        if (!sellerId) {
            toast.error("Seller ID not found. Please log in again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...product,
                    price: priceAsNumber,
                    seller_id: sellerId // Add the seller_id from local storage
                }),
            });

            const data = await response.json();
            console.log("Response data:", data); // Debugging line to check the response

            if (!response.ok) {
                toast.error("Failed to add product: " + (data.message || "Unknown error"), {
                    position: "top-right",
                    autoClose: 5000,
                });
                return;
            }
    
            // Show success message
            toast.success("Product added successfully!", {
                position: "top-right",
                autoClose: 5000,
            });
    
            // Delay navigation to allow the toast to show
            setTimeout(() => {
                navigate('/AdminHome');
            }, 1000); // Delay for 1 second (1000 ms)
    
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while adding the product.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <div>
            <HeaderBack />
            <ModalComponent />
            <div className="admin-dashboard">
                <h2>Admin Dashboard - Add New Product</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="1">Hand Tools</option>
                            <option value="2">Electric Tools</option>
                            <option value="3">Heavy Tools</option>
                        </select>
                    </div>
                    
                    <div className="row-product">
                        <div className="row-item-product"> 
                            <div className="form-group">
                                <label htmlFor="term_value">Term Value</label>
                                <input
                                    type="text"
                                    id="term_value"
                                    name="term_value"
                                    value={product.term_value}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="row-item-product">
                            <div className="form-group">
                                <label htmlFor="term_id">Hourly/ Daily/ Weekly</label>
                                <select
                                    id="term_id"
                                    name="term_id"
                                    value={product.term_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Term</option>
                                    <option value="Hour">Hour</option>
                                    <option value="Day">Day</option>
                                    <option value="Week">Week</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <ImageDropBox onImageUpdate={handleImageUpdate} /> 
                    </div>

                    <button type="submit">Add Product</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminAddProduct;
