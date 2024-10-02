import React, { useState, useEffect } from 'react';
import '../styles/PortfolioContainer.css';
import StockTile from './StockTile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function PortfolioContainer() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicker, setSelectedTicker] = useState(null);  // State for the selected stock ticker
    const [metrics, setMetrics] = useState([]);  // State to store fetched metrics
    const [history, setHistory] = useState([]);  // State to store fetched historical data
    const [loadingMetrics, setLoadingMetrics] = useState(false);  // Track loading for metrics
    const [loadingHistory, setLoadingHistory] = useState(false);  // Track loading for history

    useEffect(() => {
        // Fetch the stocks from the API endpoint
        axios.get("http://127.0.0.1:8000/stocks")
            .then(response => {
                setStocks(response.data.stocks);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching stocks:", error);
                setLoading(false);
            });
    }, []);

    // Fetch the stock metrics and history when the selected ticker changes
    useEffect(() => {
        if (selectedTicker) {
            // Fetch metrics
            setLoadingMetrics(true);  // Set loading for metrics
            axios.get(`http://127.0.0.1:8000/stock_metrics/${selectedTicker}`)
                .then(response => {
                    setMetrics(response.data);  // Directly set the fetched metrics
                    setLoadingMetrics(false);
                })
                .catch(error => {
                    console.error("Error fetching stock metrics:", error);
                    setLoadingMetrics(false);
                });

            // Fetch stock history
            setLoadingHistory(true);  // Set loading for history
            axios.get(`http://127.0.0.1:8000/stock_history/${selectedTicker}`)
                .then(response => {
                    setHistory(response.data.history);  // Set the fetched history data
                    setLoadingHistory(false);
                })
                .catch(error => {
                    console.error("Error fetching stock history:", error);
                    setLoadingHistory(false);
                });
        }
    }, [selectedTicker]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="portfolio-container">
            <div className="portfolio-list" style={{ overflowY: 'scroll', maxHeight: '200px' }}>
                {stocks.length > 0 ? (
                    stocks.map((stock, index) => (
                        <StockTile
                            key={index}
                            ticker={stock.ticker}
                            num_shares={stock.quantity_bought}
                            price_bought={stock.price_bought_at}
                            date_bought={stock.date_bought_at}
                            onClick={() => setSelectedTicker(stock.ticker)}  // Handle the stock click
                        />
                    ))
                ) : (
                    <p>No stocks found for this user.</p>
                )}
            </div>
            <div className="portfolio-stockview">
                <h1 className="header">Historical Performance</h1>
                {loadingHistory ? (
                    <p>Loading historical data...</p>
                ) : (
                    <LineChart
                        width={900}
                        height={500}
                        data={history}  // Use fetched historical data
                        margin={{ top: 5, right: 30, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Date" label={{ value: 'Date (1mo span)', position: 'insideBottomRight', offset: -5 }} />  {/* Label for X-Axis */}
                        <YAxis label={{ value: 'Closing Price ($)', angle: -90, position: 'insideLeft' }} />  {/* Label for Y-Axis */}
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Close" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                )}

                <h1 className="header">Metrics</h1>
                <div className="stock-info-grid">
                    {loadingMetrics ? (
                        <p>Loading metrics...</p>  // Show a loading message while fetching metrics
                    ) : metrics.length > 0 ? (
                        metrics.map((info, index) => (
                            <div key={index} className="stock-info-item">
                                <strong>{info.label}:</strong> {info.value}
                            </div>
                        ))
                    ) : (
                        <p>Select a stock to view its metrics.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PortfolioContainer;
