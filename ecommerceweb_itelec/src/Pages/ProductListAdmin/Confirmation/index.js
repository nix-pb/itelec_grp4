import React from 'react';
import './index.css'; // Optional for styling

const Confirmation = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Render nothing if the modal is closed

    const handleConfirm = () => {
        console.log("Confirm clicked"); // Debug log
        onConfirm(); // Call the confirm function passed as a prop
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Are you sure?</h2>
                <p>Do you really want to delete this product?</p>
                <div className="modal-buttons">
                    <button onClick={onClose}>No</button>
                    <button onClick={handleConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
