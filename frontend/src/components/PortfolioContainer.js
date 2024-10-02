import React, { useState, useEffect, useRef } from 'react';
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
    const [keyInsights, setKeyInsights] = useState(null);  // State to store key insights
    const [loadingMetrics, setLoadingMetrics] = useState(false);  // Track loading for metrics
    const [loadingHistory, setLoadingHistory] = useState(false);  // Track loading for history
    const [loadingInsights, setLoadingInsights] = useState(false);  // Track loading for key insights

    const isInitialLoad = useRef(true);  // Ref to track the initial load

    // Function to fetch stocks from the API endpoint
    const fetchStocks = () => {
        axios.get("http://127.0.0.1:8000/stocks")
            .then(response => {
                setStocks(response.data.stocks);
                setLoading(false);

                // Set the first stock as selected by default only if no stock is currently selected
                if (isInitialLoad.current && response.data.stocks.length > 0) {
                    setSelectedTicker(response.data.stocks[0].ticker);  // Select the first stock
                    isInitialLoad.current = false;  // Set to false after the first load
                }
            })
            .catch(error => {
                console.error("Error fetching stocks:", error);
                setLoading(false);
            });
    };

    // Function to fetch the key insights for the selected ticker
    const fetchKeyInsights = (ticker) => {
        setLoadingInsights(true);
        axios.get(`http://127.0.0.1:8000/key_insights/${ticker}`)
            .then(response => {
                setKeyInsights(response.data);  // Store the key insights data
                setLoadingInsights(false);
            })
            .catch(error => {
                console.error("Error fetching key insights:", error);
                setLoadingInsights(false);
            });
    };

    // Fetch stocks initially and set up polling every 5 seconds
    useEffect(() => {
        fetchStocks();  // Fetch data initially

        const intervalId = setInterval(() => {
            fetchStocks();  // Fetch data every 2 seconds
        }, 2000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []);

    // Fetch the stock metrics and history when the selected ticker changes
    useEffect(() => {
        if (selectedTicker) {
            // Fetch key insights for the selected ticker
            fetchKeyInsights(selectedTicker);

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

    // Helper function to style positive/negative insights
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

    if (loading) {
        return <div>Loading...</div>;
    }

    // Find the selected stock's details
    const selectedStock = stocks.find(stock => stock.ticker === selectedTicker);

    // Helper function to style positive/negative insights for percentage and dollar gain
const formatDollarGain = (value) => {
    const isPositive = value > 0;
    const arrow = isPositive ? '▲' : '▼';
    const color = isPositive ? 'green' : 'red';
    return (
        <span style={{ color }}>
            {arrow} ${Math.abs(value).toFixed(2)}
        </span>
    );
};

// JSX for rendering the Portfolio Container
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

        {/* Stock view containing both Key Insights and Historical Performance */}
        <div className="portfolio-stockview">
            {/* Key Insights Section */}
            <div className="key-insights">
                <h1 className="header">Key Information - {selectedTicker}</h1>
                {loadingInsights ? (
                    <p>Loading key insights...</p>
                ) : keyInsights ? (
                    <div className="key-insights-grid">
                        <div className="key-insight-item">
                            <strong>Today's Price: </strong> ${keyInsights.currentPrice ? keyInsights.currentPrice.toFixed(2) : 'N/A'}
                        </div>
                        <div className="key-insight-item">
                            <strong>Today's Dollar Gain: </strong>
                            {keyInsights.dollarGain ? formatDollarGain(keyInsights.dollarGain) : 'N/A'}
                        </div>
                        <div className="key-insight-item">
                            <strong>Today's Percentage Gain: </strong>
                            {keyInsights.percentageGain ? formatInsight(keyInsights.percentageGain) : 'N/A'}
                        </div>
                        <div className="key-insight-item">
                            <strong>Number of Shares: </strong>
                            {selectedStock ? selectedStock.quantity_bought : 'N/A'}
                        </div>
                        <div className="key-insight-item">
                            <strong>Date Bought: </strong>
                            {selectedStock ? selectedStock.date_bought_at : 'N/A'}
                        </div>
                        <div className="key-insight-item">
                            <strong>Price Bought At: </strong>
                            {selectedStock ? `$${selectedStock.price_bought_at.toFixed(2)}` : 'N/A'}
                        </div>
                    </div>
                ) : (
                    <p>No key insights available.</p>
                )}
            </div>

            {/* Historical Performance Section */}
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
                    <XAxis dataKey="Date" label={{ value: 'Date (1mo span)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis label={{ value: 'Closing Price ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Close" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            )}

            {/* Daily Metrics Section */}
            <h1 className="header">Daily Metrics</h1>
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
