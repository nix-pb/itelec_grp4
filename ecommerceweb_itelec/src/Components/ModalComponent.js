
import React from 'react';
import './ModalComponent.css';


const ModalComponent = ({ isOpen, toggleModal }) => {
    if (!isOpen) return null; 

    return (
        <div className="modal">
            <p>This is a modal</p>
            <button onClick={toggleModal}>Close Modal</button>
        </div>
    );
};

export default ModalComponent;
