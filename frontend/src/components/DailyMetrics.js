// components/DailyMetrics.js
import React from 'react';

const DailyMetrics = ({ loadingMetrics, metrics }) => {
    return (
        <>
            <h1 className="header">Daily Metrics</h1>
            <div className="stock-info-grid">
                {loadingMetrics ? (
                    <p>Loading metrics...</p>
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
        </>
    );
};

export default DailyMetrics;
