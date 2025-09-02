import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBox, FaChartLine, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/config';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [teamMember, setTeamMember] = useState(null);
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvedCompanyId, setResolvedCompanyId] = useState('');

  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTeamMember = localStorage.getItem('teamMember');
    const token = localStorage.getItem('teamToken');

    if (!savedTeamMember || !token) {
      navigate('/team-login');
      return;
    }

    const parsedMember = JSON.parse(savedTeamMember);
    setTeamMember(parsedMember);

    const idToUse = companyId || parsedMember?.companyId;
    if (!idToUse) {
      setError('Missing company. Please contact your administrator.');
      setLoading(false);
      return;
    }
    setResolvedCompanyId(idToUse);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE_URL}/stock-items/${idToUse}`);
        const data = await res.json();
        if (res.ok) {
          setStock(Array.isArray(data.stockItems) ? data.stockItems : []);
        } else {
          setError(data.message || 'Failed to load stock items');
        }
        // Fetch sales for this company
        try {
          const resSales = await fetch(`${API_BASE_URL}/sales/${idToUse}`);
          const dataSales = await resSales.json();
          if (resSales.ok) {
            setSales(Array.isArray(dataSales.sales) ? dataSales.sales : []);
          }
        } catch (_) {
          // ignore sales fetch errors
        }
      } catch (e) {
        setError('Network error while loading company data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, navigate]);

  // Polling to keep user dashboard in sync with company changes
  useEffect(() => {
    if (!resolvedCompanyId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/stock-items/${resolvedCompanyId}`);
        const data = await res.json();
        if (res.ok) {
          setStock(Array.isArray(data.stockItems) ? data.stockItems : []);
        }
      } catch (_) {
        // ignore transient polling errors
      }
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, [resolvedCompanyId]);

  const handleLogout = () => {
    localStorage.removeItem('teamMember');
    localStorage.removeItem('teamToken');
    navigate('/team-login');
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
          <p className="stat-number">{sales.filter(sale => (sale.createdAt || '').slice(0,10) === new Date().toISOString().slice(0,10)).length}</p>
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
          <p className="stat-text">{teamMember?.companyName || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  const clearAllStock = async () => {
    if (!teamMember?.companyId) return;
    const confirmClear = window.confirm('Delete all stock items for this company? This cannot be undone.');
    if (!confirmClear) return;
    try {
      const res = await fetch(`${API_BASE_URL}/stock-items/company/${teamMember.companyId}`, { method: 'DELETE' });
      if (res.ok) {
        setStock([]);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to clear stock');
      }
    } catch (e) {
      alert('Network error while clearing stock');
    }
  };

  const renderStock = () => (
    <div className="stock-section">
      <div className="stock-header">
        <h2>Available Stock</h2>
        <button className="clear-stock-btn" onClick={clearAllStock}>Clear Company Stock</button>
      </div>
      {stock.length === 0 ? (
        <div className="empty-state">This company doesn't have any stock items yet.</div>
      ) : (
      <div className="stock-grid">
        {stock.map(item => (
            <div key={item._id || item.id} className="stock-item">
              <img src={item.image || 'https://via.placeholder.com/100x100'} alt={item.name} className="stock-image" />
            <div className="stock-details">
              <h3>{item.name}</h3>
              <p className="stock-category">{item.category}</p>
              <p className="stock-quantity">Quantity: {item.quantity}</p>
              <p className="stock-price"># {item.price}</p>
                <p className="stock-status">Status: {item.status}</p>
              </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );

  const renderSales = () => (
    <div className="sales-section">
      <h2>Sales History</h2>
      <RecordSaleForm companyId={teamMember?.companyId} stock={stock} onRecorded={(updatedItem, newSale) => {
        // Refresh stock after sale
        setStock(prev => prev.map(i => (String(i._id) === String(updatedItem._id) ? updatedItem : i)));
        if (newSale) {
          setSales(prev => [newSale, ...prev]);
        }
        setActiveTab('stock');
      }} />
      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id || sale.id}>
                <td>{sale.itemId?.name || sale.product || 'Item'}</td>
                <td>{sale.quantity}</td>
                <td># {sale.price}</td>
                <td># {sale.total}</td>
                <td>{(sale.createdAt || '').replace('T', ' ').slice(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="loading">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Sales Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {teamMember ? `${teamMember.firstName} ${teamMember.lastName}` : ''}</span>
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

// Inline simple Record Sale form component
const RecordSaleForm = ({ companyId, stock, onRecorded }) => {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId || !itemId || !quantity || !price) {
      setMsg('Please select an item and enter quantity and price.');
      return;
    }
    try {
      setSubmitting(true);
      setMsg('');
      const res = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, itemId, quantity: Number(quantity), price: Number(price) })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Sale recorded');
        setItemId('');
        setQuantity(1);
        setPrice('');
        onRecorded && onRecorded(data.updatedItem, data.sale);
      } else {
        setMsg(data.message || 'Failed to record sale');
      }
    } catch (err) {
      setMsg('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="record-sale-form">
      <h3>Record a Sale</h3>
      {msg && <div className="message">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Item</label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="">Select item</option>
            {stock.map(i => (
              <option value={i._id} key={i._id}>{i.name} (Qty: {i.quantity})</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Price</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Record Sale'}</button>
      </form>
    </div>
  );
};