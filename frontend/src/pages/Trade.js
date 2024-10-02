import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BuyPopup from '../components/BuyPopup';
import SellPopup from '../components/SellPopup';
import ConfirmationBanner from '../components/ConfirmationBanner';
import '../styles/Trade.css';

function Trade() {
    const [inputValue, setInputValue] = useState('');
    const [ticker, setTicker] = useState('');
    const [history, setHistory] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [keyInsights, setKeyInsights] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [error, setError] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [showBuyPopup, setShowBuyPopup] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [buyError, setBuyError] = useState('');
    const [sellError, setSellError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Fetch current balance
    const fetchCurrentBalance = () => {
        axios.get('http://127.0.0.1:8000/user_balance')
            .then(response => {
                setCurrentBalance(response.data.balance);
            })
            .catch(error => {
                console.error('Error fetching user balance:', error);
                setCurrentBalance(0);
            });
    };

    // Fetch stock history and metrics from the backend
    const fetchStockData = (ticker) => {
        setError(null);

        // Fetch stock history
        setLoadingHistory(true);
        axios.get(`http://127.0.0.1:8000/stock_history/${ticker}`)
            .then(response => {
                setHistory(response.data.history);
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
                setMetrics(response.data);
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
                setKeyInsights(response.data);
                setLoadingInsights(false);
            })
            .catch(error => {
                console.error('Error fetching key insights:', error);
                setLoadingInsights(false);
            });
    };

    // Handle the confirmation of the Buy action
    const handleBuyConfirm = (numShares) => {
        const date = new Date();
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
        const url = `http://127.0.0.1:8000/buy/${ticker}/${currentPrice}/${formattedDate}/${numShares}`;

        // Send a POST request to the buy API endpoint
        axios.post(url)
            .then(response => {
                console.log(response.data.message);
                setShowBuyPopup(false);
                setConfirmationMessage('Stock purchased successfully!');
                setShowConfirmation(true);
                fetchCurrentBalance();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setBuyError('Insufficient funds for this order.');
                } else {
                    setBuyError('An unexpected error occurred while trying to place the order.');
                }
                setShowBuyPopup(false);

                // Clear the error after 3 seconds
                setTimeout(() => setBuyError(''), 3000);
            });
    };

    // Handle the confirmation of the Sell action
    const handleSellConfirm = (numShares) => {
        const date = new Date();
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
        const url = `http://127.0.0.1:8000/sell/${ticker}/${currentPrice}/${formattedDate}/${numShares}`;

        // Send a POST request to the sell API endpoint
        axios.post(url)
            .then(response => {
                console.log(response.data.message);
                setShowSellPopup(false);
                setConfirmationMessage('Stock sold successfully!');
                setShowConfirmation(true);
                fetchCurrentBalance();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setSellError('Insufficient stock quantity for this order.');
                } else {
                    setSellError('An unexpected error occurred while trying to place the order.');
                }
                setShowSellPopup(false);

                // Clear the error after 3 seconds
                setTimeout(() => setSellError(''), 3000);
            });
    };

    // Handle the form submit (on pressing Enter or clicking Search)
    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue) {
            setTicker(inputValue);
            fetchStockData(inputValue);
        }
    };

    // Helper function to format percentage gain/loss
    const formatInsight = (value, type) => {
        const isPositive = value > 0;
        const arrow = isPositive ? '▲' : '▼';
        const color = isPositive ? 'green' : 'red';
        if (type === 'percent') {
            return (
                <span style={{ color }}>
                    {arrow} {Math.abs(value).toFixed(2)}%
                </span>
            );
        }
       else {
            return (
                <span style={{ color }}>
                    {arrow} ${Math.abs(value).toFixed(2)}
                </span>
            );
        }
        
    };

    // Fetch current balance on initial load
    useEffect(() => {
        fetchCurrentBalance();
    }, []);

    return (
        <div>
            <h1 className='main-title'>Trade</h1>
            <p className='balance'><strong>Current Balance: </strong>${currentBalance}</p>

            <div className='search-container'>
                <h1 className="title">Search by Ticker</h1>
                <form onSubmit={handleSearch} className="search-bar-form">
                    <input
                        type="text"
                        placeholder="Enter ticker symbol (e.g., AAPL)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        className="search-bar-input"
                    />
                    <button type="submit" className="search-bar-button">Search</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {ticker && !error && (
                    <div className="selected-content">
                        {/* Key Insights Section */}
                        <h1 className="title">Key Insights</h1>
                        {loadingInsights ? (
                            <p>Loading key insights...</p>
                        ) : keyInsights ? (
                            <div className="key-insights-grid">
                                <div className="key-insight-item">
                                    <strong>Today's Price: </strong> ${keyInsights.currentPrice ? keyInsights.currentPrice.toFixed(2) : 'N/A'}
                                </div>
                                <div className="key-insight-item">
                                    <strong>Today's Dollar Gain: </strong>
                                    {keyInsights.dollarGain ? formatInsight(keyInsights.dollarGain, 'dollar') : 'N/A'}
                                </div>
                                <div className="key-insight-item">
                                    <strong>Today's Percentage Gain: </strong>
                                    {keyInsights.percentageGain ? formatInsight(keyInsights.percentageGain, 'percent') : 'N/A'}
                                </div>
                            </div>
                        ) : (
                            <p>No key insights available.</p>
                        )}

                        <h1 className="title">Actions</h1>
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
                                onClick={() => setShowBuyPopup(true)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
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
                                onClick={() => setShowSellPopup(true)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Historical Performance Section */}
                        <h1 className="title">{ticker} Historical Performance</h1>
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
                                <h1 className="title">Daily Metrics</h1>
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
                    onClose={() => setShowBuyPopup(false)}
                    onConfirm={handleBuyConfirm}
                    currentPrice={currentPrice}
                />
            )}

            {/* Show the SellPopup if showSellPopup is true */}
            {showSellPopup && (
                <SellPopup
                    onClose={() => setShowSellPopup(false)}
                    onConfirm={handleSellConfirm}
                    currentPrice={currentPrice}
                />
            )}

            {/* Show the buy or sell error messages if there are any */}
            {buyError && <div className="error-popup">{buyError}</div>}
            {sellError && <div className="error-popup">{sellError}</div>}

            {/* Show the confirmation modal if the operation was successful */}
            {showConfirmation && (
                <ConfirmationBanner
                    message={confirmationMessage}
                    onClose={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default Trade;
