import React, { useEffect, useState } from 'react';
import '../styles/ConfirmationBanner.css';

function ConfirmationBanner({ message, onClose }) {
    const [visible, setVisible] = useState(true);

    // Automatically close the banner after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 1500); // Hide the banner after 3 seconds
        return () => clearTimeout(timer); // Clear the timer when the component is unmounted
    }, []);

    // Trigger the onClose when the banner becomes invisible
    useEffect(() => {
        if (!visible) {
            const fadeOutTimer = setTimeout(onClose, 500); // Delay to allow fade-out transition
            return () => clearTimeout(fadeOutTimer);
        }
    }, [visible, onClose]);

    return (
        <div className={`confirmation-banner ${visible ? 'fade-in' : 'fade-out'}`}>
            <div className="banner-content">
                <p>{message}</p>
            </div>
        </div>
    );
}

export default ConfirmationBanner;
