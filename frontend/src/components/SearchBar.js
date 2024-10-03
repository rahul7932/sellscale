// components/SearchBar.js
import React from 'react';

const SearchBar = ({ inputValue, onInputChange, onSearchSubmit }) => {
    return (
        <form onSubmit={onSearchSubmit} className="search-bar-form">
            <input
                type="text"
                placeholder="Enter ticker symbol (e.g., AAPL)"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value.toUpperCase())}
                className="search-bar-input"
            />
            <button type="submit" className="search-bar-button">Search</button>
        </form>
    );
};

export default SearchBar;
