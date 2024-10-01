import React from 'react';
import '../styles/Portfolio.css';
import PortfolioContainer from '../components/PortfolioContainer';

function Portfolio() {
    return (
        <div>
            <h1 className='title'>My Portfolio</h1>
            <PortfolioContainer></PortfolioContainer>
        </div>
    );
}

export default Portfolio;
