import React from 'react';
import '../styles/StockTile.css';

function StockTile({ ticker, num_shares, price_bought, date_bought}) {
    return (
        <div className="stocktile-container">
            <h2>{ticker}</h2>
            <p>{num_shares}</p>
            <p>{price_bought}</p>
            <p>{date_bought}</p>
        </div>
    );
}

export default StockTile;