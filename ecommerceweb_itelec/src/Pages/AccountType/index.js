import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; 

const AccountType = () => {
    const navigate = useNavigate();

    const handleBuyerRegister = () => {
        navigate('/BuyerRegister');
    };

    const handleSellerRegister = () => {
        navigate('/SellerRegister');
    };

    return (
        <div className="account-type-wrapper">
            <div className="account-type">
                <h2>Select Account Type</h2>
                <div className="buttons">
                    <button onClick={handleBuyerRegister}>Buyer</button>
                    <button onClick={handleSellerRegister}>Seller</button>
                </div>
            </div>
        </div>
    );
};

export default AccountType;
