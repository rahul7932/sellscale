import React, { useState, useEffect } from 'react';
import '../styles/Portfolio.css';
import PortfolioContainer from '../components/PortfolioContainer';
import axios from 'axios';

function Portfolio() {
    const [balance, setBalance] = useState(null);  // State to store the balance
    const [loading, setLoading] = useState(true);  // State to track loading

    // Function to fetch balance
    const fetchBalance = () => {
        axios.get("http://127.0.0.1:8000/user_balance")
            .then(response => {
                setBalance(response.data.balance);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching balance:", error);
                setLoading(false);
            });
    };

    // Fetch the balance initially and set up a timer to update it every 5 seconds
    useEffect(() => {
        fetchBalance();

        const intervalId = setInterval(() => {
            fetchBalance();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1 className='title'>My Portfolio</h1>
            <p className='subtitle'>
                <strong>Current Balance: </strong>
                {loading ? 'Loading...' : `$${balance}`}
            </p>
            <PortfolioContainer></PortfolioContainer>
        </div>
    );
}

export default Portfolio;
