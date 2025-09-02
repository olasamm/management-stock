import React, { useState, useEffect } from 'react';
import { FaBox, FaChartLine, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Mock data for now - replace with API calls
    setStock([
      { id: 1, name: 'iPhone 14 Pro', category: 'Phones', quantity: 25, price: 999, image: 'https://via.placeholder.com/100x100' },
      { id: 2, name: 'Samsung Galaxy S23', category: 'Phones', quantity: 18, price: 899, image: 'https://via.placeholder.com/100x100' },
      { id: 3, name: 'MacBook Pro M2', category: 'Laptops', quantity: 12, price: 1999, image: 'https://via.placeholder.com/100x100' },
    ]);
    
    setSales([
      { id: 1, product: 'iPhone 14 Pro', quantity: 1, price: 999, date: '2024-01-15', customer: 'John Doe' },
      { id: 2, product: 'Samsung Galaxy S23', quantity: 1, price: 899, date: '2024-01-14', customer: 'Jane Smith' },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  const renderOverview = () => (
    <div className="overview-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaBox />
        </div>
        <div className="stat-content">
          <h3>Total Stock Items</h3>
          <p className="stat-number">{stock.length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>Today's Sales</h3>
          <p className="stat-number">{sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]).length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaHistory />
        </div>
        <div className="stat-content">
          <h3>Total Sales</h3>
          <p className="stat-number">{sales.length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaUser />
        </div>
        <div className="stat-content">
          <h3>Company</h3>
          <p className="stat-text">{user?.company || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  const renderStock = () => (
    <div className="stock-section">
      <h2>Available Stock</h2>
      <div className="stock-grid">
        {stock.map(item => (
          <div key={item.id} className="stock-item">
            <img src={item.image} alt={item.name} className="stock-image" />
            <div className="stock-details">
              <h3>{item.name}</h3>
              <p className="stock-category">{item.category}</p>
              <p className="stock-quantity">Quantity: {item.quantity}</p>
              <p className="stock-price">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="sales-section">
      <h2>Sales History</h2>
      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Customer</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.product}</td>
                <td>{sale.quantity}</td>
                <td>${sale.price}</td>
                <td>{sale.customer}</td>
                <td>{sale.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Sales Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaBox /> Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <FaBox /> Stock
        </button>
        <button 
          className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <FaHistory /> Sales
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'stock' && renderStock()}
        {activeTab === 'sales' && renderSales()}
      </main>
    </div>
  );
};

export default Dashboard;