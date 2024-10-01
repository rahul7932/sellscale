import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar-container">
            <h1>SellScaleHood</h1>
            <ul className="sidebar-list">
                <li><Link to="/portfolio">My Portfolio</Link></li>
                <li><Link to="/trade">Trade</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
