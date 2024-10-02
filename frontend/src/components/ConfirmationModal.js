import React, { useEffect } from 'react';
import '../styles/ConfirmationModal.css';

function ConfirmationModal({ message, onClose }) {
    // Automatically close the modal after 3 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer); // Clear the timer when the component is unmounted
    }, [onClose]);

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <p>{message}</p>
            </div>
        </div>
    );
}

export default ConfirmationModal;
