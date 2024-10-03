// components/Trade.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import BuySellButtons from '../components/BuySellButtons';
import BuyPopup from '../components/BuyPopup';
import SellPopup from '../components/SellPopup';
import ConfirmationBanner from '../components/ConfirmationBanner';
import ErrorPopup from '../components/ErrorPopup';
import KeyInsights from '../components/KeyInsights';
import StockChart from '../components/StockChart';
import DailyMetrics from '../components/DailyMetrics';
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

    // Fetch stock data
    const fetchStockData = (ticker) => {
        setError(null);
        setLoadingHistory(true);
        axios.get(`http://127.0.0.1:8000/stock_history/${ticker}`)
            .then(response => {
                setHistory(response.data.history);
                setLoadingHistory(false);
            })
            .catch(error => {
                setLoadingHistory(false);
                setError('Error fetching stock history.');
            });

        setLoadingMetrics(true);
        axios.get(`http://127.0.0.1:8000/stock_metrics/${ticker}`)
            .then(response => {
                setMetrics(response.data);
                const priceMetric = response.data.find(metric => metric.label === 'Previous Close');
                setCurrentPrice(priceMetric ? priceMetric.value : 0);
                setLoadingMetrics(false);
            })
            .catch(error => {
                setLoadingMetrics(false);
                setError('Error fetching stock metrics.');
            });

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
                setLoadingInsights(false);
            });
    };

    // Buy stock confirmation
    const handleBuyConfirm = (numShares) => {
        const formattedDate = new Date().toISOString().slice(0, 10);
        const url = `http://127.0.0.1:8000/buy/${ticker}/${currentPrice}/${formattedDate}/${numShares}`;
        axios.post(url)
            .then(response => {
                setShowBuyPopup(false);
                setConfirmationMessage('Stock purchased successfully!');
                setShowConfirmation(true);
                fetchCurrentBalance();
            })
            .catch(error => {
                setBuyError('An error occurred.');
                setShowBuyPopup(false);
                setTimeout(() => setBuyError(''), 3000);
            });
    };

    // Sell stock confirmation
    const handleSellConfirm = (numShares) => {
        const formattedDate = new Date().toISOString().slice(0, 10);
        const url = `http://127.0.0.1:8000/sell/${ticker}/${currentPrice}/${formattedDate}/${numShares}`;
        axios.post(url)
            .then(response => {
                setShowSellPopup(false);
                setConfirmationMessage('Stock sold successfully!');
                setShowConfirmation(true);
                fetchCurrentBalance();
            })
            .catch(error => {
                setSellError('An error occurred.');
                setShowSellPopup(false);
                setTimeout(() => setSellError(''), 3000);
            });
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue) {
            setTicker(inputValue);
            fetchStockData(inputValue);
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
                <SearchBar inputValue={inputValue} onInputChange={setInputValue} onSearchSubmit={handleSearch} />

                {error && <p className="error-message">{error}</p>}

                {ticker && !error && (
                    <div className="selected-content">
                        <h1 className="title">Key Insights</h1>
                        <KeyInsights loading={loadingInsights} keyInsights={keyInsights} />

                        <h1 className="title">Actions</h1>
                        <BuySellButtons
                            onBuyClick={() => setShowBuyPopup(true)}
                            onSellClick={() => setShowSellPopup(true)}
                        />

                        <h1 className="title">{ticker} Historical Performance</h1>
                        <StockChart loading={loadingHistory} history={history} />

                        {metrics.length > 0 && (
                            <DailyMetrics loading={loadingMetrics} metrics={metrics} />
                        )}
                    </div>
                )}
            </div>

            {showBuyPopup && (
                <BuyPopup onClose={() => setShowBuyPopup(false)} onConfirm={handleBuyConfirm} currentPrice={currentPrice} />
            )}

            {showSellPopup && (
                <SellPopup onClose={() => setShowSellPopup(false)} onConfirm={handleSellConfirm} currentPrice={currentPrice} />
            )}

            {buyError && <ErrorPopup message={buyError} />}
            {sellError && <ErrorPopup message={sellError} />}

            {showConfirmation && <ConfirmationBanner message={confirmationMessage} onClose={() => setShowConfirmation(false)} />}
        </div>
    );
}

export default Trade;
