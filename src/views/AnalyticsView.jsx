import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const AnalyticsView = ({ orders, loading }) => {
    const chartData = useMemo(() => {
        const dailyMap = {};
        const now = new Date();

        // Initialize exactly 10 days (today + 9 previous) with 0 values
        for (let i = 9; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const sortKey = d.toISOString().split('T')[0];
            dailyMap[sortKey] = { date: label, revenue: 0, orders: 0, sortKey };
        }

        // Aggregate actual orders into the 10-day window
        orders.forEach(order => {
            const d = new Date(order.created_at);
            const sortKey = d.toISOString().split('T')[0];
            if (dailyMap[sortKey]) {
                dailyMap[sortKey].revenue += Number(order.price) || 0;
                dailyMap[sortKey].orders += 1;
            }
        });

        // Return sorted array for Recharts
        return Object.values(dailyMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }, [orders]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const avgRevenuePerDay = chartData.length > 0 ? totalRevenue / chartData.length : 0;

    if (loading) {
        return <div className="placeholder-table"><p>Analyzing data...</p></div>;
    }

    return (
        <div className="analytics-view">
            <section className="welcome-section">
                <h1>Analytics Overview</h1>
                <p>Insights into your business performance and revenue trends.</p>
            </section>

            <div className="analytics-grid">
                <div className="card-container chart-card wide">
                    <div className="card-header">
                        <h2>Revenue Trend</h2>
                    </div>
                    <div className="chart-wrapper" style={{ height: '300px', width: '100%', minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-sidebar)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--primary)"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-container chart-card">
                    <div className="card-header">
                        <h2>Order Volume</h2>
                    </div>
                    <div className="chart-wrapper" style={{ height: '300px', width: '100%', minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-sidebar)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="orders" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
