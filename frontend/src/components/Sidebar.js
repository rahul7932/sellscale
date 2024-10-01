import React from 'react';
import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar-container">
            <h1>SellScaleHood</h1>
            <ul className="sidebar-list">
                <li>My Portfolio</li>
                <li>Trade</li>
            </ul>
        </div>
    );
}

export default Sidebar;
