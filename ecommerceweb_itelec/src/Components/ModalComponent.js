
import React from 'react';

const ModalComponent = ({ isOpen, toggleModal }) => {
    if (!isOpen) return null; // Don't render the modal if it's closed

    return (
        <div className="modal">
            <p>This is a modal</p>
            <button onClick={toggleModal}>Close Modal</button>
        </div>
    );
};

export default ModalComponent;
