// components/KeyInsights.js
import React from 'react';

const KeyInsights = ({ loading, keyInsights }) => {
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
        } else {
            return (
                <span style={{ color }}>
                    {arrow} ${Math.abs(value).toFixed(2)}
                </span>
            );
        }
    };

    return (
        <div className="key-insights">
            {loading ? (
                <p>Loading key insights...</p>
            ) : keyInsights ? (
                
                <div className="key-insights-grid">
                    <div className="key-insight-item">
                        <strong>Today's Price: </strong> ${keyInsights.currentPrice ? keyInsights.currentPrice.toFixed(2) : 'N/A'}
                    </div>
                    <div className="key-insight-item">
                        <strong>Today's $ Gain: </strong>
                        {keyInsights.dollarGain ? formatInsight(keyInsights.dollarGain, 'dollar') : 'N/A'}
                    </div>
                    <div className="key-insight-item">
                        <strong>Today's % Gain: </strong>
                        {keyInsights.percentageGain ? formatInsight(keyInsights.percentageGain, 'percent') : 'N/A'}
                    </div>
                </div>
            ) : (
                <p>No key insights available.</p>
            )}
        </div>
    );
};

export default KeyInsights;
