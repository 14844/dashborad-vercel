import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon-wrapper">{icon}</div>
            </div>
            <div className="stat-body">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-title">{title}</p>
            </div>
        </div>
    );
};

export default StatCard;
