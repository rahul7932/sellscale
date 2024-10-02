import React, { useState, useEffect } from 'react';
import '../styles/BuyPopup.css';  // Assuming you have some CSS for the popup

function BuyPopup({ onClose, onConfirm, currentPrice }) {
    const [numShares, setNumShares] = useState(0);  // State for number of shares
    const [totalOrderVolume, setTotalOrderVolume] = useState(0);  // State for total order volume

    // Update the total order volume whenever numShares changes
    useEffect(() => {
        setTotalOrderVolume(numShares * currentPrice);
    }, [numShares, currentPrice]);

    const handleConfirm = () => {
        onConfirm(numShares);  // Call the onConfirm function passed as a prop
        onClose();  // Close the popup after confirmation
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Buy Stock</h2>
                <div className="input-group">
                    <label>Number of Shares: </label>
                    <input
                        type="number"
                        value={numShares}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 1 || value === "") {
                                setNumShares(value);
                            }
                        }}
                        min="1"
                        className="popup-input"
                    />
                </div>
                <p>Current Price: ${currentPrice.toFixed(2)}</p>

                {/* Display total order volume */}
                <p>Total Order Volume: ${totalOrderVolume.toFixed(2)}</p>

                <div className="popup-buttons">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default BuyPopup;
