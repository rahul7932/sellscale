import React from 'react';
import '../styles/Portfolio.css';
import PortfolioContainer from '../components/PortfolioContainer';

function Portfolio() {

    // In your parent component or data file
const stockMetrics = [
    { label: 'Previous Close', value: '419.74' },
    { label: 'Open', value: '413.20' },
    { label: 'Bid', value: '416.31 x 200' },
    { label: 'Ask', value: '417.36 x 200' },
    { label: 'Day\'s Range', value: '412.46 - 437.98' },
    { label: '52 Week Range', value: '22.66 - 437.98' },
    { label: 'Volume', value: '6,734,018' },
    { label: 'Avg. Volume', value: '77,863,452' },
    { label: 'Market Cap (Intraday)', value: '243.829B' }
];

// When rendering the PortfolioContainer component
<PortfolioContainer stockInfo={stockMetrics} />

    return (
        <div>
            <h1 className='title'>My Portfolio</h1>
            <PortfolioContainer stockInfo={stockMetrics}></PortfolioContainer>
        </div>
    );
}

export default Portfolio;
