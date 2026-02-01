import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Package, BarChart3, LayoutDashboard, BarChart2, Settings, User, Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Layout from './components/Layout';
import Login from './components/Login';
import DashboardView from './views/DashboardView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import { useOrders } from './hooks/useOrders';
import './App.css';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

const SOUND_MAP = {
  'Tick': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  'Bell': 'https://assets.mixkit.co/active_storage/sfx/2558/2558-preview.mp3',
  'Chime': 'https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3'
};

const AppContent = ({
  isAuthenticated, setIsAuthenticated, orders, orderCount, loading, error,
  notifications, unreadCount, clearUnread, settings, saveSettings,
  filter, setFilter, stats, filteredOrders, sortedDates, groupedOrders, todayStr,
  renderOrderTable
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationsOpen={clearUnread}
      dashboardName={settings.dashboardName}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition>
              <DashboardView
                loading={loading} error={error} stats={stats}
                filter={filter} setFilter={setFilter}
                filteredOrders={filteredOrders} sortedDates={sortedDates}
                groupedOrders={groupedOrders} todayStr={todayStr}
                renderOrderTable={renderOrderTable}
              />
            </PageTransition>
          } />
          <Route path="/analytics" element={
            <PageTransition>
              <AnalyticsView orders={orders} loading={loading} />
            </PageTransition>
          } />
          <Route path="/settings" element={
            <PageTransition>
              <SettingsView settings={settings} onSave={saveSettings} />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { orders, totalRevenue, orderCount, loading, error } = useOrders();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('today');
  const [visibleLimits, setVisibleLimits] = useState({});

  // Settings State with Persistence
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dashboard_settings');
    return saved ? JSON.parse(saved) : {
      dashboardName: 'Dashboard',
      language: 'English',
      notificationSound: 'Tick'
    };
  });

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dashboard_settings', JSON.stringify(newSettings));
  };

  const prevOrderCountRef = useRef(0);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (loading) return;

    if (isInitialLoad.current) {
      prevOrderCountRef.current = orderCount;
      isInitialLoad.current = false;
      return;
    }

    if (orderCount > prevOrderCountRef.current) {
      const soundUrl = SOUND_MAP[settings.notificationSound] || SOUND_MAP['Tick'];
      const audio = new Audio(soundUrl);
      audio.play().catch(e => console.log('Sound blocked by browser auto-play policy'));

      const newOrdersCount = orderCount - prevOrderCountRef.current;

      const newNotification = {
        id: Date.now(),
        message: settings.language === 'Arabic' ? 'وصل طلب جديد' : 'An order has arrived',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + newOrdersCount);
    }
    prevOrderCountRef.current = orderCount;
  }, [orderCount, loading, settings.notificationSound, settings.language]);

  const clearUnread = () => setUnreadCount(0);

  const formatDateKey = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  };

  const todayStr = formatDateKey(new Date());

  const filteredOrders = filter === 'today'
    ? orders.filter(o => formatDateKey(o.created_at) === todayStr)
    : orders.filter(o => formatDateKey(o.created_at) !== todayStr);

  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const date = formatDateKey(order.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(order);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => b.localeCompare(a));
  const totalRevenueFiltered = filteredOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenueFiltered);

  const stats = [
    { title: 'Total Revenue', value: loading ? '...' : formattedRevenue, icon: <DollarSign size={20} /> },
    { title: 'Total Orders', value: loading ? '...' : filteredOrders.length.toLocaleString(), icon: <Package size={20} /> },
    { title: 'Average Order', value: loading ? '...' : (filteredOrders.length > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenueFiltered / filteredOrders.length) : '$0.00'), icon: <BarChart3 size={20} /> },
  ];

  const handleShowMore = (date) => {
    setVisibleLimits(prev => ({ ...prev, [date]: (prev[date] || 10) + 10 }));
  };

  const renderOrderTable = (orderList, dateKey) => {
    const limit = visibleLimits[dateKey] || 10;
    const itemsToShow = orderList.slice(0, limit);
    const hasMore = orderList.length > limit;

    return (
      <div key={dateKey} className="order-group">
        {filter === 'past' && (
          <h3 className="group-date-header">
            {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        )}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr><th>Order #</th><th>Description</th><th>Price</th><th>Time</th></tr>
            </thead>
            <tbody>
              {itemsToShow.map((order, idx) => (
                <tr key={order.number || idx}>
                  <td>{order.number}</td>
                  <td className="desc-cell">{order.description || 'No description'}</td>
                  <td className="price-cell">${Number(order.price).toFixed(2)}</td>
                  <td>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && (
            <div className="show-more-container">
              <button className="btn-show-more" onClick={() => handleShowMore(dateKey)}>
                Show more (+{orderList.length - limit})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        orders={orders}
        orderCount={orderCount}
        loading={loading}
        error={error}
        notifications={notifications}
        unreadCount={unreadCount}
        clearUnread={clearUnread}
        settings={settings}
        saveSettings={saveSettings}
        filter={filter}
        setFilter={setFilter}
        stats={stats}
        filteredOrders={filteredOrders}
        sortedDates={sortedDates}
        groupedOrders={groupedOrders}
        todayStr={todayStr}
        renderOrderTable={renderOrderTable}
      />
    </BrowserRouter>
  );
}

export default App;
