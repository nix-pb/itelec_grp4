import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageDropBox from './ImageDropBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProduct.css';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [product, setProduct] = useState({ 
        name: '', 
        description: '', 
        price: '', 
        category: '', 
        image: '',
        term_id: '',
        term_value: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error("An error occurred while fetching the product.", {
                    position: "top-right",
                    autoClose: 5000, // Toast will disappear after 5 seconds
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

        // Cleanup: Dismiss all toasts when this component unmounts
        return () => {
            toast.dismiss();
        };
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
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
            toast.error("Please enter a valid price.", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5001/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...product, price: priceAsNumber }),
            });
    
            if (!response.ok) {
                const data = await response.json();
                toast.error("Failed to update product: " + (data.message || "Unknown error"), {
                    position: "top-right",
                    autoClose: 5000,
                });
                return;
            }
    
            // Show success message
            toast.success("Product updated successfully!", {
                position: "top-right",
                autoClose: 5000,
            });
    
            // Delay navigation to allow the toast to show
            setTimeout(() => {
                navigate('/AdminHome');
            }, 1000); // Delay for 1 second (1000 ms)
    
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while updating the product.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };
    
    
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-dashboard">
            <h2>Edit Product</h2>
            <form onSubmit={handleFormSubmit}>
                {/* Form Fields */}
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

                <div className="form-group">
                    <label htmlFor="term_id">Hourly / Daily / Weekly</label>
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

                <div className="form-group">
                    <label>Image</label>
                    {product.image && (
                        <div>
                            <img src={product.image} alt="Current" style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
                            <p>Current Image</p>
                        </div>
                    )}
                    <ImageDropBox onImageUpdate={handleImageUpdate} />
                </div>

                <button type="submit">Update Product</button>
            </form>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default EditProduct;
