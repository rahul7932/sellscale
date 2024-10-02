import React from 'react';
import '../styles/StockTile.css';

function StockTile({ ticker, num_shares, price_bought, date_bought, onClick }) {
    return (
        <div className="stocktile-container" onClick={onClick}>
            <h2 className='ticker'>{ticker}</h2>
            <p><strong>Number of Shares Owned:</strong> {num_shares}</p>
            <p><strong>Price Bought At:</strong> ${parseFloat(price_bought).toFixed(2)}</p>
            <p><strong>Date Bought:</strong> {date_bought}</p>
        </div>
    );
}

export default StockTile;
