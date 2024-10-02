import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../styles/Trade.css';

function Trade() {
    const [inputValue, setInputValue] = useState('');  // Store the input value from the search bar
    const [ticker, setTicker] = useState('');  // Ticker to be used for fetching data
    const [history, setHistory] = useState([]);  // Store stock history
    const [metrics, setMetrics] = useState([]);  // Store stock metrics
    const [loadingHistory, setLoadingHistory] = useState(false);  // Loading state for history
    const [loadingMetrics, setLoadingMetrics] = useState(false);  // Loading state for metrics
    const [error, setError] = useState(null);  // Error state

    // Handle the form submit (on pressing Enter or clicking Search)
    const handleSearch = (e) => {
        e.preventDefault();  // Prevent form submission
        if (inputValue) {
            setTicker(inputValue);  // Update ticker only when form is submitted
            fetchStockData(inputValue);  // Fetch the stock data based on the input value
        }
    };

    // Fetch stock history and metrics from the backend
    const fetchStockData = (ticker) => {
        setError(null);  // Reset error state

        // Fetch stock history
        setLoadingHistory(true);
        axios.get(`http://127.0.0.1:8000/stock_history/${ticker}`)
            .then(response => {
                setHistory(response.data.history);  // Set the stock history data
                setLoadingHistory(false);
            })
            .catch(error => {
                console.error('Error fetching stock history:', error);
                setLoadingHistory(false);
                setError('Error fetching stock history. Please check the ticker symbol.');
            });

        // Fetch stock metrics
        setLoadingMetrics(true);
        axios.get(`http://127.0.0.1:8000/stock_metrics/${ticker}`)
            .then(response => {
                setMetrics(response.data);  // Set the stock metrics data
                setLoadingMetrics(false);
            })
            .catch(error => {
                console.error('Error fetching stock metrics:', error);
                setLoadingMetrics(false);
                setError('Error fetching stock metrics. Please check the ticker symbol.');
            });
    };

    return (
        <div>
            <h1 className='title'>Trade</h1>
            <p className='balance'><strong>Current Balance: </strong>$100000</p>

            <div className='search-container'>
                <h2>Search by Ticker</h2>
                <form onSubmit={handleSearch} className="search-bar-form">
                    <input
                        type="text"
                        placeholder="Enter ticker symbol (e.g., AAPL)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}  // Update inputValue while typing
                        className="search-bar-input"
                    />
                    <button type="submit" className="search-bar-button">Search</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {ticker && !error && (
                    <div className="selected-content">
                        <h2>{ticker} Historical Performance</h2>

                        {loadingHistory ? (
                            <p>Loading historical data...</p>
                        ) : (
                            <LineChart width={1200} height={500} data={history}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis label={{ value: 'Closing Price ($)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Close" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        )}

                        <h2>Actions</h2>
                        <div className="button-container">
                            <button style={{ backgroundColor: 'green', color: 'white', fontSize: '28px' }}>Buy</button>
                            <button style={{ backgroundColor: 'red', color: 'white', fontSize: '28px' }}>Sell</button>
                        </div>

                        <h2>Daily Metrics</h2>
                        <div className="stock-info-grid">
                            {loadingMetrics ? (
                                <p>Loading metrics...</p>
                            ) : metrics.length > 0 ? (
                                metrics.map((metric, index) => (
                                    <div key={index} className="stock-info-item">
                                        <strong>{metric.label}:</strong> {metric.value}
                                    </div>
                                ))
                            ) : (
                                <p>Select a stock to view its metrics.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Trade;
