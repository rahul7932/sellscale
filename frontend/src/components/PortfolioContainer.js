import React from 'react';
import '../styles/PortfolioContainer.css';
import StockTile from './StockTile';  // Adjust the import path as needed

function PortfolioContainer() {
    // Example fake data
    const stocks = [
        { ticker: "AAPL", num_shares: 10, price_bought: 150.50, date_bought: "2021-08-01" },
        { ticker: "MSFT", num_shares: 15, price_bought: 210.75, date_bought: "2021-08-02" },
        { ticker: "AMZN", num_shares: 5, price_bought: 3110.28, date_bought: "2021-08-03" },
        { ticker: "AAPL", num_shares: 10, price_bought: 150.50, date_bought: "2021-08-01" },
        { ticker: "MSFT", num_shares: 15, price_bought: 210.75, date_bought: "2021-08-02" },
        { ticker: "AMZN", num_shares: 5, price_bought: 3110.28, date_bought: "2021-08-03" },
        { ticker: "AAPL", num_shares: 10, price_bought: 150.50, date_bought: "2021-08-01" },
        { ticker: "MSFT", num_shares: 15, price_bought: 210.75, date_bought: "2021-08-02" },
        { ticker: "AMZN", num_shares: 5, price_bought: 3110.28, date_bought: "2021-08-03" },
    ];

    return (
        <div className="portfolio-container">
            <div className="portfolio-list" style={{ overflowY: 'scroll', maxHeight: '400px' }}>  {/* Make this div scrollable */}
                {stocks.map((stock, index) => (
                    <StockTile
                        key={index}
                        ticker={stock.ticker}
                        num_shares={stock.num_shares}
                        price_bought={stock.price_bought}
                        date_bought={stock.date_bought}
                    />
                ))}
            </div>
            <div className="portfolio-stockview">
                {/* Additional content can go here */}
            </div>
        </div>
    );
}

export default PortfolioContainer;
