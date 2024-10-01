import React from 'react';
import '../styles/StockTile.css';

function StockTile({ ticker, num_shares, price_bought, date_bought}) {
    return (
        <div className="stocktile-container">
            <h2>{ticker}</h2>
            <p><strong>Number of Shares Owned:</strong> {num_shares}</p>
            <p><strong>Price Bought At:</strong> {price_bought}</p>
            <p><strong>Date Bought:</strong> {date_bought}</p>
        </div>
    );
}

export default StockTile;