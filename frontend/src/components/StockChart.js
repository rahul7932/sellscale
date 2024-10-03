// components/StockChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockChart = ({ loadingHistory, history }) => {
    return (
        <>
            {loadingHistory ? (
                <p>Loading historical data...</p>
            ) : (
                <LineChart
                    width={900}
                    height={500}
                    data={history}
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
        </>
    );
};

export default StockChart;
