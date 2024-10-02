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
                setBalance(response.data.balance);  // Set the fetched balance
                setLoading(false);  // Turn off loading
            })
            .catch(error => {
                console.error("Error fetching balance:", error);
                setLoading(false);  // Turn off loading even if there's an error
            });
    };

    // Fetch the balance initially and set up a timer to update it every 5 seconds
    useEffect(() => {
        fetchBalance();  // Fetch the balance when the component mounts

        const intervalId = setInterval(() => {
            fetchBalance();  // Fetch the balance every 5 seconds
        }, 5000);

        // Clear the interval when the component is unmounted to avoid memory leaks
        return () => clearInterval(intervalId);
    }, []);  // Empty dependency array ensures this runs only once on mount

    return (
        <div>
            <h1 className='title'>My Portfolio</h1>
            {/* Display loading or the balance */}
            <h2 className='subtitle'>
                <strong>Current Balance: </strong>
                {loading ? 'Loading...' : `$${balance}`}  {/* Show the balance or loading message */}
            </h2>
            <PortfolioContainer></PortfolioContainer>
        </div>
    );
}

export default Portfolio;
