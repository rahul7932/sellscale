// components/BuySellButtons.js
import React from 'react';

const BuySellButtons = ({ onBuyClick, onSellClick }) => {
    return (
        <div className="button-container">
            <button
                style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontSize: '22px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onClick={onBuyClick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
            >
                Buy
            </button>
            <button
                style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontSize: '22px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onClick={onSellClick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
            >
                Sell
            </button>
        </div>
    );
};

export default BuySellButtons;
