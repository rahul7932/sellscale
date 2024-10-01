import React from 'react';
import '../styles/StockTile.css';

function StockTile({ ticker, num_shares, price_bought, date_bought}) {
    return (
        <div className="stocktile-container">
            <h2>{ticker}</h2>
            <p>Number of Shares Owned: {num_shares}</p>
            <p>Price Bought At: {price_bought}</p>
            <p>Date Bought: {date_bought}</p>
        </div>
    );
}

export default StockTile;