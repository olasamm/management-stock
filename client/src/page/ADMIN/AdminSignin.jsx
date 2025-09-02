import React, { useState } from 'react';
import { FaShieldAlt, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignin.css';

const AdminSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
              const url = "https://stock-management-0ywb.onrender.com/admin/signin";
      const response = await axios.post(url, formData);
      
      if (response.status === 200) {
        setMessage("Admin login successful!");
        setMessageType("success");
        
        // Store admin data in localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('admin', JSON.stringify(response.data.admin));
        } else {
          sessionStorage.setItem('admin', JSON.stringify(response.data.admin));
        }
        
        // Navigate to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Admin signin error:", error);
      
      if (error.response?.status === 401) {
        setMessage("Invalid admin credentials");
      } else if (error.response?.status === 400) {
        setMessage(error.response.data.message || "Invalid credentials");
      } else {
        setMessage("An error occurred during admin signin");
      }
      
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-signin-container">
      <div className="admin-signin-card">
        <div className="admin-signin-header">
          <div className="admin-logo">
            <FaShieldAlt className="admin-logo-icon" />
            <span className="admin-logo-text">StockMaster Admin</span>
          </div>
          <h1>Admin Access</h1>
          <p>Sign in to your admin panel</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`admin-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-signin-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter admin email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="admin-signin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Admin Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn google" disabled={isLoading}>
            <FaGoogle />
            Google
          </button>
          <button type="button" className="social-btn github" disabled={isLoading}>
            <FaGithub />
            GitHub
          </button>
        </div>

        <div className="admin-signup-link">
          <p>
            Need admin access?{' '}
            <a href="/admin-signup">Contact system administrator</a>
          </p>
        </div>

        <div className="user-signin-link">
          <p>
            Are you a regular user?{' '}
            <a href="/signin">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;
