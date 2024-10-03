// components/ErrorPopup.js
import React from 'react';

const ErrorPopup = ({ message }) => {
    return (
        <div className="error-popup">
            {message}
        </div>
    );
};

export default ErrorPopup;
