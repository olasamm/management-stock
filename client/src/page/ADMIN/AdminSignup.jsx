import React, { useState } from 'react';
import { FaShieldAlt, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignup.css';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.adminCode) {
      setMessage("Please fill all the fields");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (formData.adminCode !== 'ADMIN2024') {
      setMessage("Invalid admin authorization code");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!agreeToTerms) {
      setMessage("Please agree to the Terms of Service and Privacy Policy");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);

    try {
              const url = "https://stock-management-0ywb.onrender.com/admin/signup";
      const response = await axios.post(url, formData);
      
      if (response.status === 201) {
        setMessage("Admin account created successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/admin-signin"), 3000);
      }
    } catch (error) {
      console.error("Admin signup error:", error);
      if (error.response?.status === 400) {
        setMessage(error.response.data.message || "Admin account already exists");
      } else {
        setMessage("An error occurred during admin signup");
      }
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <div className="admin-signup-header">
          <div className="admin-logo">
            <FaShieldAlt className="admin-logo-icon" />
            <span className="admin-logo-text">StockMaster Admin</span>
          </div>
          <h1>Create Admin Account</h1>
          <p>Set up administrator access for StockMaster</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`admin-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-signup-form">
          <div className="name-group">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
                disabled={isLoading}
              />
            </div>
          </div>

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
            <label htmlFor="adminCode">Admin Authorization Code</label>
            <input
              type="password"
              id="adminCode"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleInputChange}
              placeholder="Enter admin authorization code"
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
                placeholder="Create admin password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm admin password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="admin-signup-btn" disabled={isLoading}>
            {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="divider">
          <span>or sign up with</span>
        </div>


        <div className="admin-signin-link">
          <p>
            Already have admin access?{' '}
            <a href="/#/admin-signin">Sign in here</a>
          </p>
        </div>

        <div className="user-signup-link">
          <p>
            Are you a regular user?{' '}
            <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
