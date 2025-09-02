import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaChartBar, FaCog, FaSignOutAlt, FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Get admin data from localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    
    // Mock data for now - replace with API calls
    setCompanies([
      { id: 1, name: 'TechCorp Solutions', email: 'admin@techcorp.com', status: 'Active', users: 8, created: '2024-01-01' },
      { id: 2, name: 'Digital Innovations', email: 'boss@digital.com', status: 'Active', users: 5, created: '2024-01-05' },
      { id: 3, name: 'Smart Systems', email: 'admin@smart.com', status: 'Pending', users: 3, created: '2024-01-10' },
    ]);
    
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@techcorp.com', company: 'TechCorp Solutions', role: 'Sales Person', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', company: 'TechCorp Solutions', role: 'Sales Person', status: 'Active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@digital.com', company: 'Digital Innovations', role: 'Sales Person', status: 'Active' },
    ]);
    
    setStats({
      totalCompanies: 3,
      activeCompanies: 2,
      pendingCompanies: 1,
      totalUsers: 16,
      activeUsers: 15,
      totalRevenue: 0, // Platform revenue
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-signin';
  };

  const handleCompanyAction = (companyId, action) => {
    // Handle company actions (approve, suspend, etc.)
    console.log(`${action} company ${companyId}`);
  };

  const handleUserAction = (userId, action) => {
    // Handle user actions (suspend, delete, etc.)
    console.log(`${action} user ${userId}`);
  };

  const renderOverview = () => (
    <div className="overview-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaBuilding />
        </div>
        <div className="stat-content">
          <h3>Total Companies</h3>
          <p className="stat-number">{stats.totalCompanies}</p>
          <p className="stat-detail">{stats.activeCompanies} Active, {stats.pendingCompanies} Pending</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-content">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <p className="stat-detail">{stats.activeUsers} Active</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartBar />
        </div>
        <div className="stat-content">
          <h3>Platform Revenue</h3>
          <p className="stat-number">${stats.totalRevenue}</p>
          <p className="stat-detail">Monthly earnings</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaCog />
        </div>
        <div className="stat-content">
          <h3>System Status</h3>
          <p className="stat-text">Healthy</p>
          <p className="stat-detail">All systems operational</p>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="companies-section">
      <h2>Company Management</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Admin Email</th>
              <th>Status</th>
              <th>Users</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>
                  <span className={`status-badge ${company.status.toLowerCase()}`}>
                    {company.status}
                  </span>
                </td>
                <td>{company.users}/10</td>
                <td>{company.created}</td>
                <td className="actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleCompanyAction(company.id, 'view')}
                  >
                    <FaEye />
                  </button>
                  {company.status === 'Pending' && (
                    <button 
                      className="action-btn approve"
                      onClick={() => handleCompanyAction(company.id, 'approve')}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className="action-btn suspend"
                    onClick={() => handleCompanyAction(company.id, 'suspend')}
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h2>User Management</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleUserAction(user.id, 'view')}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleUserAction(user.id, 'edit')}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleUserAction(user.id, 'delete')}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <h2>Platform Settings</h2>
      <div className="settings-grid">
        <div className="setting-card">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>Platform Name</label>
            <input type="text" defaultValue="StockMaster" />
          </div>
          <div className="setting-item">
            <label>Max Users Per Company</label>
            <input type="number" defaultValue="10" />
          </div>
          <div className="setting-item">
            <label>Email Verification Required</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        
        <div className="setting-card">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <label>Session Timeout (minutes)</label>
            <input type="number" defaultValue="30" />
          </div>
          <div className="setting-item">
            <label>Password Min Length</label>
            <input type="number" defaultValue="8" />
          </div>
          <div className="setting-item">
            <label>Enable 2FA</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        
        <div className="setting-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Admin Alerts</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  if (!admin) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>System Admin Dashboard</h1>
          <div className="admin-info">
            <span>Welcome, {admin.name}</span>
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
          <FaChartBar /> Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <FaBuilding /> Companies
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Users
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Settings
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'companies' && renderCompanies()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
};

export default AdminDashboard;