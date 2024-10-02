import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <img src={`${process.env.PUBLIC_URL}/favicon.jpeg`} alt="favicon" className="favicon-icon" />
                <h1>SellScaleHood</h1>
            </div>
            <ul className="sidebar-list">
                <li><Link to="/portfolio">My Portfolio</Link></li>
                <li><Link to="/trade">Trade</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
