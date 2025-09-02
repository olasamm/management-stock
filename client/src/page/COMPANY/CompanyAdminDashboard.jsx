import React, { useState, useEffect } from 'react';
import { FaBoxes, FaUsers, FaChartLine, FaPlus, FaSearch, FaFilter, FaSignOutAlt, FaUser, FaBell, FaCog, FaUpload, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/config';
import './CompanyAdminDashboard.css';

const CompanyAdminDashboard = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [stockItems, setStockItems] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Low stock alert: Infinix Note 30', time: '2 hours ago', read: false },
    { id: 2, message: 'New team member invitation sent', time: '1 day ago', read: false }
  ]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Get company admin data from localStorage
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    
    if (adminData && token) {
      const adminInfo = JSON.parse(adminData);
      setAdmin(adminInfo);
      
      // Set company data from admin info
      setCompany({
        id: adminInfo.companyId,
        companyName: adminInfo.companyName,
        industry: 'Electronics & Technology', // This would come from API
        companyEmail: adminInfo.email,
        status: 'active',
        subscription: 'free'
      });
      
      // Load dashboard data
      loadDashboardData();
    } else {
      // Redirect to company login if no admin data
      navigate('/company-login');
      return;
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Fetch real data from API
      if (company?.id) {
        try {
          // Fetch stock items
          const stockResponse = await fetch(`${API_ENDPOINTS.STOCK_ITEMS}/${company.id}`);
          if (stockResponse.ok) {
            const stockData = await stockResponse.json();
            setStockItems(stockData.stockItems);
          } else {
            console.error('Failed to fetch stock items');
            setStockItems([]);
          }
        } catch (error) {
          console.error('Error fetching stock items:', error);
          setStockItems([]);
        }

        try {
          // Fetch categories
          const categoryResponse = await fetch(`${API_ENDPOINTS.CATEGORIES}/${company.id}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategories(categoryData.categories);
          } else {
            console.error('Failed to fetch categories');
            setCategories([]);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        }

        try {
          // Fetch team members
          const teamResponse = await fetch(`${API_ENDPOINTS.TEAM_MEMBERS}/${company.id}`);
          if (teamResponse.ok) {
            const teamData = await teamResponse.json();
            setTeamMembers(teamData.teamMembers);
          } else {
            console.error('Failed to fetch team members');
            setTeamMembers([]);
          }
        } catch (error) {
          console.error('Error fetching team members:', error);
          setTeamMembers([]);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    navigate('/company-login');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Product management functions
  const handleEditProduct = (item) => {
    setEditingItem(item);
    setShowEditProductModal(true);
  };

  const handleDeleteProduct = async (itemId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.STOCK_ITEMS}/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const deletedItem = stockItems.find(item => item.id === itemId);
        setStockItems(stockItems.filter(item => item.id !== itemId));
        setSuccessMessage(`${deletedItem?.name || 'Product'} deleted successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setSuccessMessage(`Error: ${data.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setSuccessMessage('Error: Failed to delete product. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.STOCK_ITEMS}/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const data = await response.json();
        setStockItems(stockItems.map(item => 
          item.id === updatedProduct.id ? data.stockItem : item
        ));
        setShowEditProductModal(false);
        setEditingItem(null);
        setSuccessMessage(`${updatedProduct.name} updated successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setSuccessMessage(`Error: ${errorData.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setSuccessMessage('Error: Failed to update product. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Team management functions
  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowEditMemberModal(true);
  };

  const handleDeleteMember = async (memberId) => {
    try {
      // For now, we'll just remove from local state since we don't have a delete endpoint
      // In a real app, you'd call an API to delete the team member
      const deletedMember = teamMembers.find(member => member.id === memberId);
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      setSuccessMessage(`${deletedMember?.firstName} ${deletedMember?.lastName} removed from team`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setSuccessMessage('Error: Failed to remove team member. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleUpdateMember = async (updatedMember) => {
    try {
      // For now, we'll just update local state since we don't have an update endpoint
      // In a real app, you'd call an API to update the team member
      setTeamMembers(teamMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      ));
      setShowEditMemberModal(false);
      setEditingMember(null);
      setSuccessMessage(`${updatedMember.firstName} ${updatedMember.lastName} updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating team member:', error);
      setSuccessMessage('Error: Failed to update team member. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Category management functions
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const deletedCategory = categories.find(category => category.id === categoryId);
        setCategories(categories.filter(category => category.id !== categoryId));
        // Also remove products in this category
        setStockItems(stockItems.filter(item => {
          const category = categories.find(cat => cat.id === categoryId);
          return item.category !== category?.name;
        }));
        setSuccessMessage(`${deletedCategory?.name} category deleted successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setSuccessMessage(`Error: ${data.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setSuccessMessage('Error: Failed to delete category. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${updatedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(categories.map(category => 
          category.id === updatedCategory.id ? data.category : category
        ));
        setShowEditCategoryModal(false);
        setEditingCategory(null);
        setSuccessMessage(`${updatedCategory.name} category updated successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setSuccessMessage(`Error: ${errorData.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setSuccessMessage('Error: Failed to update category. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCategory,
          companyId: company.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data.category]);
        setShowAddCategoryModal(false);
        setSuccessMessage(`${newCategory.name} category added successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setSuccessMessage(`Error: ${errorData.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setSuccessMessage('Error: Failed to add category. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Add new product function
  const handleAddProduct = async (product) => {
    try {
      const response = await fetch(API_ENDPOINTS.STOCK_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          companyId: company.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStockItems([...stockItems, data.stockItem]);
        setShowAddProductModal(false);
        setSuccessMessage(`${product.name} added successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setSuccessMessage(`Error: ${errorData.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setSuccessMessage('Error: Failed to add product. Please try again.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Real API function for inviting or directly creating team members
  const handleInviteTeamMember = async (memberData) => {
    try {
      const isDirectCreate = !!memberData.createWithPassword;
      const endpoint = isDirectCreate ? API_ENDPOINTS.CREATE_TEAM_MEMBER : API_ENDPOINTS.INVITE_TEAM_MEMBER;
      const payload = {
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        companyId: company.id,
      };
      if (isDirectCreate) {
        payload.password = memberData.password;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        data = { message: raw };
      }

      if (response.ok) {
        // Add the new member to the list
        setTeamMembers([...teamMembers, data.teamMember]);
        setShowInviteMemberModal(false);
        setSuccessMessage(isDirectCreate
          ? `Team member ${memberData.firstName} ${memberData.lastName} created`
          : `Invitation sent to ${memberData.firstName} ${memberData.lastName}`
        );
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setSuccessMessage(`Error (${response.status}): ${data.message || 'Request failed'}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error inviting team member:', error);
      setSuccessMessage(`Error: ${error.message || 'Failed to send invitation. Please try again.'}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Notification functions
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'status-success';
      case 'Low Stock': return 'status-warning';
      case 'Out of Stock': return 'status-danger';
      default: return 'status-default';
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab company={company} stockItems={stockItems} teamMembers={teamMembers} />;
      case 'stock':
        return <StockTab 
          stockItems={filteredItems} 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
          filterCategory={filterCategory} 
          onFilterChange={handleFilterChange} 
          getStatusColor={getStatusColor}
          onAddProduct={() => setShowAddProductModal(true)}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />;
      case 'team':
        return <TeamTab 
          teamMembers={teamMembers}
          onInviteMember={() => setShowInviteMemberModal(true)}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />;
      case 'categories':
        return <CategoriesTab 
          categories={categories}
          onAddCategory={() => setShowAddCategoryModal(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab company={company} stockItems={stockItems} teamMembers={teamMembers} />;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your company dashboard...</p>
      </div>
    );
  }

  return (
    <div className="company-admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <FaBoxes className="logo-icon" />
            <span className="logo-text">StockMaster</span>
          </div>
          <div className="company-info">
            <h1>{company?.companyName}</h1>
            <span className="company-status active">{company?.status}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <FaUser className="admin-icon" />
            <span>Admin: {admin?.firstName} {admin?.lastName}</span>
          </div>
          <button className="notification-btn" onClick={toggleNotifications}>
            <FaBell />
            <span className="notification-badge">{notifications.filter(notif => !notif.read).length}</span>
          </button>
          <button className="settings-btn" onClick={toggleSettings}>
            <FaCog />
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
          <button 
            className="close-success-btn" 
            onClick={() => setSuccessMessage('')}
            title="Close message"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine />
              <span>Overview</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              <FaBoxes />
              <span>Stock Management</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <FaUsers />
              <span>Team Management</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <FaFilter />
              <span>Categories</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FaChartLine />
              <span>Reports</span>
            </button>
          </nav>
        </aside>

        {/* Main Dashboard Area */}
        <main className="dashboard-main">
          {getTabContent()}
        </main>
      </div>

      {/* Modals */}
      {showAddProductModal && (
        <AddProductModal 
          onClose={() => setShowAddProductModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {showInviteMemberModal && (
        <InviteMemberModal 
          onClose={() => setShowInviteMemberModal(false)}
          onInvite={handleInviteTeamMember}
        />
      )}

      {showAddCategoryModal && (
        <AddCategoryModal 
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={(category) => {
            handleAddCategory(category);
            setSuccessMessage(`${category.name} category added successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
        />
      )}

      {showEditProductModal && editingItem && (
        <EditProductModal 
          item={editingItem}
          onClose={() => {
            setShowEditProductModal(false);
            setEditingItem(null);
          }}
          onUpdate={handleUpdateProduct}
        />
      )}

      {showEditMemberModal && editingMember && (
        <EditMemberModal 
          member={editingMember}
          onClose={() => {
            setShowEditMemberModal(false);
            setEditingMember(null);
          }}
          onUpdate={handleUpdateMember}
        />
      )}

      {showEditCategoryModal && editingCategory && (
        <EditCategoryModal 
          category={editingCategory}
          onClose={() => {
            setShowEditCategoryModal(false);
            setEditingCategory(null);
          }}
          onUpdate={handleUpdateCategory}
        />
      )}

      {showNotifications && (
        <NotificationsModal 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={(id) => markNotificationAsRead(id)}
        />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          company={company}
          teamMembers={teamMembers}
          stockItems={stockItems}
          categories={categories}
        />
      )}
    </div>
  );
};

// Tab Components
const OverviewTab = ({ company, stockItems, teamMembers }) => (
  <div className="overview-tab">
    <h2>Company Overview</h2>
    
    {/* Stats Cards */}
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaBoxes />
        </div>
        <div className="stat-content">
          <h3>Total Products</h3>
          <p className="stat-number">{stockItems.length}</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-content">
          <h3>Team Members</h3>
          <p className="stat-number">{teamMembers.length}</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>Categories</h3>
          <p className="stat-number">{new Set(stockItems.map(item => item.category)).size}</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <FaFilter />
        </div>
        <div className="stat-content">
          <h3>Low Stock Items</h3>
          <p className="stat-number">{stockItems.filter(item => item.status === 'Low Stock').length}</p>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        <div className="activity-item">
          <span className="activity-time">2 hours ago</span>
          <span className="activity-text">New product added: iPhone 15 Pro</span>
        </div>
        <div className="activity-item">
          <span className="activity-time">1 day ago</span>
          <span className="activity-text">Team member John Doe made a sale</span>
        </div>
        <div className="activity-item">
          <span className="activity-time">2 days ago</span>
          <span className="activity-text">Low stock alert: Infinix Note 30</span>
        </div>
      </div>
    </div>
  </div>
);

const StockTab = ({ stockItems, searchTerm, onSearch, filterCategory, onFilterChange, getStatusColor, onAddProduct, onEditProduct, onDeleteProduct }) => (
  <div className="stock-tab">
    <div className="tab-header">
      <h2>Stock Management</h2>
      <button className="add-product-btn" onClick={onAddProduct}>
        <FaPlus />
        Add Product
      </button>
    </div>

    {/* Search and Filter */}
    <div className="search-filter-section">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={onSearch}
        />
      </div>
      <div className="filter-box">
        <select value={filterCategory} onChange={onFilterChange}>
          <option value="all">All Categories</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
    </div>

    {/* Products Table */}
    <div className="products-table">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map(item => (
            <tr key={item.id}>
              <td className="product-cell">
                <img src={item.image} alt={item.name} className="product-image" />
                <span>{item.name}</span>
              </td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>{item.quantity}</td>
              <td>${item.price}</td>
              <td>
                <span className={`status-badge ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="actions-cell">
                <button className="action-btn view" title="View" onClick={() => alert(`Viewing ${item.name}`)}>
                  <FaEye />
                </button>
                <button className="action-btn edit" title="Edit" onClick={() => onEditProduct(item)}>
                  <FaEdit />
                </button>
                <button 
                  className="action-btn delete" 
                  title="Delete this product permanently" 
                  onClick={() => onDeleteProduct(item.id)}
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

const TeamTab = ({ teamMembers, onInviteMember, onEditMember, onDeleteMember }) => (
  <div className="team-tab">
    <div className="tab-header">
      <h2>Team Management</h2>
      <button className="invite-member-btn" onClick={onInviteMember}>
        <FaPlus />
        Invite Member
      </button>
    </div>

    <div className="team-members-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map(member => (
            <tr key={member.id}>
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>
                <span className={`status-badge ${member.status === 'Active' ? 'status-success' : 'status-warning'}`}>
                  {member.status}
                </span>
              </td>
              <td>{member.lastLogin}</td>
              <td className="actions-cell">
                <button className="action-btn edit" title="Edit" onClick={() => onEditMember(member)}>
                  <FaEdit />
                </button>
                <button 
                  className="action-btn delete" 
                  title="Remove this team member permanently" 
                  onClick={() => onDeleteMember(member.id)}
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

const CategoriesTab = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => (
  <div className="categories-tab">
    <div className="tab-header">
      <h2>Category Management</h2>
      <button className="add-category-btn" onClick={onAddCategory}>
        <FaPlus />
        Add Category
      </button>
    </div>

    <div className="categories-grid">
      {categories.map(category => (
        <div className="category-card" key={category.id}>
          <h3>{category.name}</h3>
          <p>{category.subcategories.length} subcategories</p>
          <div className="category-actions">
            <button className="action-btn edit" onClick={() => onEditCategory(category)}>Edit</button>
            <button 
              className="action-btn delete" 
              title="Delete this category and all its products permanently"
              onClick={() => onDeleteCategory(category.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ReportsTab = () => (
  <div className="reports-tab">
    <h2>Reports & Analytics</h2>
    
    <div className="reports-grid">
      <div className="report-card">
        <h3>Sales Report</h3>
        <p>Monthly sales performance</p>
        <button className="generate-report-btn">Generate Report</button>
      </div>
      <div className="report-card">
        <h3>Stock Report</h3>
        <p>Inventory levels and trends</p>
        <button className="generate-report-btn">Generate Report</button>
      </div>
      <div className="report-card">
        <h3>Team Performance</h3>
        <p>Sales team metrics</p>
        <button className="generate-report-btn">Generate Report</button>
      </div>
    </div>
  </div>
);

// Modal Components
const AddProductModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    quantity: '',
    price: '',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      status: 'In Stock',
      image: formData.image || 'https://via.placeholder.com/50x50'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Phones">Phones</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InviteMemberModal = ({ onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    createWithPassword: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onInvite({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.createWithPassword ? formData.password : undefined,
      createWithPassword: formData.createWithPassword,
      role: 'Sales Person',
      status: formData.createWithPassword ? 'Active' : 'Pending',
      lastLogin: 'Never'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Invite Team Member</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.createWithPassword}
                onChange={(e) => setFormData({...formData, createWithPassword: e.target.checked})}
              />
              {' '}Create with password (don’t send invitation email)
            </label>
          </div>
          {formData.createWithPassword && (
            <div className="form-group">
              <label>Temporary Password</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                minLength={6}
                required
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{formData.createWithPassword ? 'Create Member' : 'Send Invitation'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddCategoryModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Category</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditProductModal = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    subcategory: item.subcategory,
    quantity: item.quantity,
    price: item.price,
    image: item.image
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      id: item.id
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Product</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Phones">Phones</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditMemberModal = ({ member, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    role: member.role,
    status: member.status,
    lastLogin: member.lastLogin
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      id: member.id
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Team Member</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Sales Person">Sales Person</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Last Login</label>
            <input
              type="text"
              value={formData.lastLogin}
              onChange={(e) => setFormData({...formData, lastLogin: e.target.value})}
              disabled
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Update Member</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditCategoryModal = ({ category, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      id: category.id
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Category</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Update Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationsModal = ({ notifications, onClose, onMarkAsRead }) => (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="notifications-list">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
            <p>{notif.message}</p>
            <span className="notification-time">{notif.time}</span>
            {!notif.read && (
              <button className="mark-read-btn" onClick={() => onMarkAsRead(notif.id)}>Mark as Read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsModal = ({ onClose, company, teamMembers, stockItems, categories }) => (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Settings</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="settings-content">
        <h4>General Settings</h4>
        <p>Company Name: {company?.companyName}</p>
        <p>Industry: {company?.industry}</p>
        <p>Email: {company?.companyEmail}</p>
        <p>Subscription: {company?.subscription}</p>
        <p>Status: {company?.status}</p>

        <h4>Team Settings</h4>
        <p>Total Team Members: {teamMembers.length}</p>
        <p>Active Members: {teamMembers.filter(member => member.status === 'Active').length}</p>

        <h4>Stock Settings</h4>
        <p>Total Products: {stockItems.length}</p>
        <p>Low Stock Items: {stockItems.filter(item => item.status === 'Low Stock').length}</p>

        <h4>Category Settings</h4>
        <p>Total Categories: {categories.length}</p>
        <p>Subcategories: {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}</p>
      </div>
    </div>
  </div>
);

export default CompanyAdminDashboard;
