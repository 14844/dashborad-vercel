import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart2,
    Settings,
    Bell,
    ChevronLeft,
    ChevronRight,
    Search,
    Package,
    User
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children, notifications = [], unreadCount = 0, onNotificationsOpen, dashboardName = 'Dashboard' }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    // Update document title when dashboard name changes
    React.useEffect(() => {
        document.title = `${dashboardName} | Admin`;
    }, [dashboardName]);

    const handleToggleNotifications = () => {
        const nextState = !showNotifications;
        setShowNotifications(nextState);
        if (nextState && onNotificationsOpen) {
            onNotificationsOpen();
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">{dashboardName.substring(0, 2).toUpperCase()}</div>
                    <span className="logo-text">{dashboardName}</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="nav-label">Overview</span>
                        <ul className="nav-list">
                            <li>
                                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                    <LayoutDashboard size={18} className="nav-icon" />
                                    <span className="nav-text">Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                    <BarChart2 size={18} className="nav-icon" />
                                    <span className="nav-text">Analytics</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="nav-group">
                        <span className="nav-label">Management</span>
                        <ul className="nav-list">
                            <li>
                                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                    <Settings size={18} className="nav-icon" />
                                    <span className="nav-text">Settings</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">
                            <User size={16} />
                        </div>
                        <div className="user-info">
                            <p className="user-name">Owner</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <button className="toggle-sidebar" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div className="header-actions">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search data..." />
                        </div>
                        <div className="notifications-wrapper">
                            <div className="notifications" onClick={handleToggleNotifications}>
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount}</span>
                                )}
                            </div>

                            {showNotifications && (
                                <div className="notifications-dropdown">
                                    <div className="dropdown-header">
                                        <h3>Notifications</h3>
                                        {notifications.length > 0 && <span>{notifications.length} New</span>}
                                    </div>
                                    <div className="dropdown-content">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div key={n.id} className="notification-item">
                                                    <div className="n-icon">
                                                        <Package size={16} />
                                                    </div>
                                                    <div className="n-info">
                                                        <p className="n-msg">{n.message}</p>
                                                        <span className="n-time">{n.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-notifications">
                                                <p>No new updates</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
