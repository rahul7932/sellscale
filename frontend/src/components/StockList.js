// components/StockList.js
import React from 'react';
import StockTile from './StockTile';

const StockList = ({ stocks, onStockClick }) => {
    return (
        <div className="portfolio-list" style={{ overflowY: 'scroll', maxHeight: '200px' }}>
            {stocks.length > 0 ? (
                stocks.map((stock, index) => (
                    <StockTile
                        key={index}
                        ticker={stock.ticker}
                        num_shares={stock.quantity_bought}
                        price_bought={stock.price_bought_at}
                        date_bought={stock.date_bought_at}
                        onClick={() => onStockClick(stock.ticker)}
                    />
                ))
            ) : (
                <p>No stocks found for this user.</p>
            )}
        </div>
    );
};

export default StockList;
