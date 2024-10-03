// components/PortfolioContainer.js
import React, { useState, useEffect, useRef } from 'react';
import '../styles/PortfolioContainer.css';
import axios from 'axios';
import StockList from './StockList';
import KeyInsights from './KeyInsights';
import StockChart from './StockChart';
import DailyMetrics from './DailyMetrics';

function PortfolioContainer() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [history, setHistory] = useState([]);
    const [keyInsights, setKeyInsights] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const isInitialLoad = useRef(true);

    const fetchStocks = () => {
        axios.get("http://127.0.0.1:8000/stocks")
            .then(response => {
                setStocks(response.data.stocks);
                setLoading(false);
                if (isInitialLoad.current && response.data.stocks.length > 0) {
                    setSelectedTicker(response.data.stocks[0].ticker);
                    isInitialLoad.current = false;
                }
            })
            .catch(error => {
                console.error("Error fetching stocks:", error);
                setLoading(false);
            });
    };

    const fetchKeyInsights = (ticker) => {
        setLoadingInsights(true);
        axios.get(`http://127.0.0.1:8000/key_insights/${ticker}`)
            .then(response => {
                setKeyInsights(response.data);
                setLoadingInsights(false);
            })
            .catch(error => {
                console.error("Error fetching key insights:", error);
                setLoadingInsights(false);
            });
    };

    useEffect(() => {
        fetchStocks();
        const intervalId = setInterval(() => fetchStocks(), 2000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (selectedTicker) {
            fetchKeyInsights(selectedTicker);
            setLoadingMetrics(true);
            axios.get(`http://127.0.0.1:8000/stock_metrics/${selectedTicker}`)
                .then(response => {
                    setMetrics(response.data);
                    setLoadingMetrics(false);
                })
                .catch(error => {
                    console.error("Error fetching stock metrics:", error);
                    setLoadingMetrics(false);
                });

            setLoadingHistory(true);
            axios.get(`http://127.0.0.1:8000/stock_history/${selectedTicker}`)
                .then(response => {
                    setHistory(response.data.history);
                    setLoadingHistory(false);
                })
                .catch(error => {
                    console.error("Error fetching stock history:", error);
                    setLoadingHistory(false);
                });
        }
    }, [selectedTicker]);

    if (loading) return <div>Loading...</div>;
    const selectedStock = stocks.find(stock => stock.ticker === selectedTicker);

    return (
        <div className="portfolio-container">
            <StockList stocks={stocks} onStockClick={setSelectedTicker} />
            <div className="portfolio-stockview">
                <h1 className="title">Key Insights</h1>
                <KeyInsights
                    loadingInsights={loadingInsights}
                    keyInsights={keyInsights}
                    selectedStock={selectedStock}
                />
                <h1 className="header">{selectedTicker} Historical Performance </h1>
                <StockChart loadingHistory={loadingHistory} history={history} />
                <DailyMetrics loadingMetrics={loadingMetrics} metrics={metrics} />
            </div>
        </div>
    );
}

export default PortfolioContainer;
