import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BuyPopup from '../components/BuyPopup';  // Import the new BuyPopup component
import '../styles/Trade.css';

function Trade() {
    const [inputValue, setInputValue] = useState('');  // Store the input value from the search bar
    const [ticker, setTicker] = useState('');  // Ticker to be used for fetching data
    const [history, setHistory] = useState([]);  // Store stock history
    const [metrics, setMetrics] = useState([]);  // Store stock metrics
    const [loadingHistory, setLoadingHistory] = useState(false);  // Loading state for history
    const [loadingMetrics, setLoadingMetrics] = useState(false);  // Loading state for metrics
    const [error, setError] = useState(null);  // Error state
    const [showBuyPopup, setShowBuyPopup] = useState(false);  // State to toggle the popup
    const [currentPrice, setCurrentPrice] = useState(0);  // Store current stock price
    const [buyError, setBuyError] = useState('');  // State to handle buy errors

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

                // Set the current price from the fetched metrics
                const currentPriceMetric = response.data.find(metric => metric.label === 'Previous Close');
                if (currentPriceMetric) {
                    setCurrentPrice(currentPriceMetric.value);
                }
            })
            .catch(error => {
                console.error('Error fetching stock metrics:', error);
                setLoadingMetrics(false);
                setError('Error fetching stock metrics. Please check the ticker symbol.');
            });
    };

    // Handle the confirmation of the Buy action
    const handleBuyConfirm = (numShares) => {
        const date = new Date().toISOString();  // Get current date in ISO format
        const url = `http://127.0.0.1:8000/buy/${ticker}/${currentPrice}/${date}/${numShares}`;

        // Send a POST request to the buy API endpoint
        axios.post(url)
            .then(response => {
                console.log(response.data.message);  // Log success message
                setShowBuyPopup(false);  // Close the popup on success
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // Handle known errors like insufficient funds
                    setBuyError('Insufficient funds for this order.');
                } else {
                    // Handle unexpected errors
                    setBuyError('An unexpected error occurred while trying to place the order.');
                }
                setShowBuyPopup(false);  // Close the popup
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
                            <button
                                style={{ backgroundColor: 'green', color: 'white', fontSize: '28px' }}
                                onClick={() => setShowBuyPopup(true)}  // Show the buy popup when clicked
                            >
                                Buy
                            </button>
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

            {/* Show the BuyPopup if showBuyPopup is true */}
            {showBuyPopup && (
                <BuyPopup
                    onClose={() => setShowBuyPopup(false)}  // Close the popup
                    onConfirm={handleBuyConfirm}  // Handle the confirm action
                    currentPrice={currentPrice}  // Pass the current price to the popup
                />
            )}

            {/* Show the buy error message if there is an error */}
            {buyError && <div className="error-popup">{buyError}</div>}
        </div>
    );
}

export default Trade;
