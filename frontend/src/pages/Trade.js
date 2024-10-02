import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BuyPopup from '../components/BuyPopup';
import SellPopup from '../components/SellPopup';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Trade.css';

function Trade() {
    const [inputValue, setInputValue] = useState('');  // Store the input value from the search bar
    const [ticker, setTicker] = useState('');  // Ticker to be used for fetching data
    const [history, setHistory] = useState([]);  // Store stock history
    const [metrics, setMetrics] = useState([]);  // Store stock metrics
    const [keyInsights, setKeyInsights] = useState(null);  // Store key insights
    const [loadingHistory, setLoadingHistory] = useState(false);  // Loading state for history
    const [loadingMetrics, setLoadingMetrics] = useState(false);  // Loading state for metrics
    const [loadingInsights, setLoadingInsights] = useState(false);  // Loading state for key insights
    const [error, setError] = useState(null);  // Error state
    const [currentPrice, setCurrentPrice] = useState(0);  // Store current stock price
    const [currentBalance, setCurrentBalance] = useState(0);  // Store the current balance
    const [showBuyPopup, setShowBuyPopup] = useState(false);  // State to toggle the buy popup
    const [showSellPopup, setShowSellPopup] = useState(false);  // State to toggle the sell popup
    const [buyError, setBuyError] = useState('');  // State to handle buy errors
    const [sellError, setSellError] = useState('');  // State to handle sell errors
    const [showConfirmation, setShowConfirmation] = useState(false);  // State to show confirmation modal
    const [confirmationMessage, setConfirmationMessage] = useState('');  // Store confirmation message

    // Fetch current balance
    const fetchCurrentBalance = () => {
        axios.get('http://127.0.0.1:8000/user_balance')
            .then(response => {
                setCurrentBalance(response.data.balance);  // Set the fetched balance
            })
            .catch(error => {
                console.error('Error fetching user balance:', error);
                setCurrentBalance(0);  // Set balance to 0 on error
            });
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

        // Fetch key insights
        fetchKeyInsights(ticker);
    };

    // Fetch key insights
    const fetchKeyInsights = (ticker) => {
        setLoadingInsights(true);
        axios.get(`http://127.0.0.1:8000/key_insights/${ticker}`)
            .then(response => {
                setKeyInsights(response.data);  // Set the fetched key insights
                setLoadingInsights(false);
            })
            .catch(error => {
                console.error('Error fetching key insights:', error);
                setLoadingInsights(false);
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
                setConfirmationMessage('Stock purchased successfully!');
                setShowConfirmation(true);  // Show confirmation modal
                fetchCurrentBalance();  // Refresh the balance after the purchase
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

    // Handle the confirmation of the Sell action
    const handleSellConfirm = (numShares) => {
        const date = new Date().toISOString();  // Get current date in ISO format
        const url = `http://127.0.0.1:8000/sell/${ticker}/${currentPrice}/${date}/${numShares}`;

        // Send a POST request to the sell API endpoint
        axios.post(url)
            .then(response => {
                console.log(response.data.message);  // Log success message
                setShowSellPopup(false);  // Close the popup on success
                setConfirmationMessage('Stock sold successfully!');
                setShowConfirmation(true);  // Show confirmation modal
                fetchCurrentBalance();  // Refresh the balance after the sale
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // Handle known errors like insufficient stock quantity
                    setSellError('Insufficient stock quantity for this order.');
                } else {
                    // Handle unexpected errors
                    setSellError('An unexpected error occurred while trying to place the order.');
                }
                setShowSellPopup(false);  // Close the popup
            });
    };

    // Handle the form submit (on pressing Enter or clicking Search)
    const handleSearch = (e) => {
        e.preventDefault();  // Prevent form submission
        if (inputValue) {
            setTicker(inputValue);  // Update ticker only when form is submitted
            fetchStockData(inputValue);  // Fetch the stock data based on the input value
        }
    };

    // Helper function to format percentage gain/loss
    const formatInsight = (value) => {
        const isPositive = value > 0;
        const arrow = isPositive ? '▲' : '▼';
        const color = isPositive ? 'green' : 'red';
        return (
            <span style={{ color }}>
                {arrow} {Math.abs(value).toFixed(2)}%
            </span>
        );
    };

    // Fetch current balance on initial load
    useEffect(() => {
        fetchCurrentBalance();  // Fetch current balance when the component mounts
    }, []);

    return (
        <div>
            <h1 className='title'>Trade</h1>
            <p className='balance'><strong>Current Balance: </strong>${currentBalance}</p>

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
                        {/* Key Insights Section */}
                        <h2>Key Insights</h2>
                        {loadingInsights ? (
                            <p>Loading key insights...</p>
                        ) : keyInsights ? (
                            <div className="key-insights-grid">
                                <div className="key-insight-item">
                                    <strong>Today's Price: </strong> ${keyInsights.currentPrice ? keyInsights.currentPrice.toFixed(2) : 'N/A'}
                                </div>
                                <div className="key-insight-item">
                                    <strong>Today's Dollar Gain: </strong>
                                    {keyInsights.dollarGain ? formatInsight(keyInsights.dollarGain) : 'N/A'}
                                </div>
                                <div className="key-insight-item">
                                    <strong>Today's Percentage Gain: </strong>
                                    {keyInsights.percentageGain ? formatInsight(keyInsights.percentageGain) : 'N/A'}
                                </div>
                            </div>
                        ) : (
                            <p>No key insights available.</p>
                        )}

                         <h2>Actions</h2>
                        <div className="button-container">
                            <button
                                style={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    fontSize: '22px',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onClick={() => setShowBuyPopup(true)}  // Show the buy popup when clicked
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}  // Darker green on hover
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}  // Original color on leave
                            >
                                Buy
                            </button>
                            <button
                                style={{
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    fontSize: '22px',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onClick={() => setShowSellPopup(true)}  // Show the sell popup when clicked
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}  // Darker red on hover
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}  // Original color on leave
                            >
                                Sell
                            </button>
                        </div>

                        {/* Historical Performance Section */}
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

                        {/* Daily Metrics Section */}
                        {metrics && metrics.length > 0 && (
                            <>
                                <h2>Daily Metrics</h2>
                                <div className="stock-info-grid">
                                    {metrics.map((metric, index) => (
                                        <div key={index} className="stock-info-item">
                                            <strong>{metric.label}:</strong> {metric.value}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
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

            {/* Show the SellPopup if showSellPopup is true */}
            {showSellPopup && (
                <SellPopup
                    onClose={() => setShowSellPopup(false)}  // Close the popup
                    onConfirm={handleSellConfirm}  // Handle the confirm action
                    currentPrice={currentPrice}  // Pass the current price to the popup
                />
            )}

            {/* Show the buy or sell error messages if there are any */}
            {buyError && <div className="error-popup">{buyError}</div>}
            {sellError && <div className="error-popup">{sellError}</div>}

            {/* Show the confirmation modal if the operation was successful */}
            {showConfirmation && (
                <ConfirmationModal
                    message={confirmationMessage}
                    onClose={() => setShowConfirmation(false)}  // Close the modal automatically
                />
            )}
        </div>
    );
}

export default Trade;
