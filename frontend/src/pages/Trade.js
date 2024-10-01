import React, { useState } from 'react';
import Select from 'react-select';
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

            </div>
        </div>
    );
}

export default Trade;
