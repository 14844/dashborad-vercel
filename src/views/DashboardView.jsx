import React from 'react';
import StatCard from '../components/StatCard';
import Dropdown from '../components/Dropdown';

const DashboardView = ({
    loading,
    error,
    stats,
    filter,
    setFilter,
    filteredOrders,
    sortedDates,
    groupedOrders,
    todayStr,
    renderOrderTable
}) => {
    return (
        <div className="dashboard-content-view">
            <section className="welcome-section">
                <h1>Order Dashboard</h1>
                {error && <div className="error-banner">Error: {error}</div>}
            </section>

            <section className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </section>

            <section className="data-section">
                <div className="card-container data-table-card">
                    <div className="card-header">
                        <h2>Recent Orders</h2>
                        <Dropdown
                            options={[
                                { label: 'Today', value: 'today' },
                                { label: 'Past Days', value: 'past' }
                            ]}
                            value={filter}
                            onChange={setFilter}
                        />
                    </div>

                    {loading ? (
                        <div className="placeholder-table">
                            <p>Loading your orders...</p>
                            <div className="skeleton-rows">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="skeleton-row"></div>
                                ))}
                            </div>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        filter === 'today'
                            ? renderOrderTable(filteredOrders, todayStr)
                            : sortedDates.map(date => renderOrderTable(groupedOrders[date], date))
                    ) : (
                        <div className="placeholder-table">
                            <p>No orders found for {filter === 'today' ? 'today' : 'past days'}.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DashboardView;
