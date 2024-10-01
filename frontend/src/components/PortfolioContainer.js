import React from 'react';
import '../styles/PortfolioContainer.css';
import StockTile from './StockTile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


function PortfolioContainer( { stockInfo } ) {
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

    const data = [
        { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 189, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 239, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 349, pv: 4300, amt: 2100 },
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
                <h1 className='header'>Historical Performance</h1>
                <LineChart width={900} height={500} data={data}
                    margin={{ top: 5, right: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                </LineChart>
                <h1 className='header'>Metrics</h1>
                <div class="stock-info-grid">
                    {stockInfo.map((info, index) => (
                        <div key={index} className="stock-info-item">
                            <strong>{info.label}:</strong> {info.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PortfolioContainer;
