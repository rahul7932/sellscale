import React, { useState } from 'react';
import Select from 'react-select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../styles/Trade.css';

function Trade() {
    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'google', label: 'Google' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'amazon', label: 'Amazon' }
    ];

    const handleChange = (option) => {
        setSelectedOption(option);
        console.log('Selected option:', option);
    };

    const data = [
        { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 300, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 200, pv: 9800, amt: 2290 }
    ];

    return (
        <div>
            <h1 className='title'>Trade</h1>
            <div className='search-container'>
                <h2>Search by Ticker</h2>
                <Select
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}
                    className="select-search-bar"
                    placeholder="Search and select..."
                />
                {selectedOption && (
                <div className="selected-content">
                    <h2>Historical Performance</h2>
                    <LineChart width={1200} height={500} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                        </LineChart>
                    <h2>Actions</h2>
                    <div className="button-container">
                        <button style={{ backgroundColor: 'green', color: 'white', fontSize: '28px' }}>Buy</button>
                        <button style={{ backgroundColor: 'red', color: 'white', fontSize: '28px' }}>Sell</button>
                        </div>
                    <h2>Metrics</h2>
                    <div className="stock-info-grid">
                        <div className="stock-info-item"><strong>Previous Close:</strong> 419.74</div>
                        <div className="stock-info-item"><strong>Open:</strong> 413.20</div>
                        <div className="stock-info-item"><strong>Bid:</strong> 416.31 x 200</div>
                        <div className="stock-info-item"><strong>Ask:</strong> 417.36 x 200</div>
                        <div className="stock-info-item"><strong>Day's Range:</strong> 412.46 - 437.98</div>
                        <div className="stock-info-item"><strong>52 Week Range:</strong> 22.66 - 437.98</div>
                        <div className="stock-info-item"><strong>Volume:</strong> 6,734,018</div>
                        <div className="stock-info-item"><strong>Avg. Volume:</strong> 77,863,452</div>
                        <div className="stock-info-item"><strong>Market Cap (Intraday):</strong> 243.829B</div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default Trade;
