import React, { useState } from 'react';
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/config';
import './CompanyRegistration.css';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const industries = [
    'Electronics & Technology',
    'Fashion & Apparel',
    'Food & Beverage',
    'Home & Garden',
    'Automotive',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Jewelry & Accessories',
    'Other'
  ];

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
    if (!formData.companyName || !formData.industry || !formData.companyEmail || 
        !formData.adminFirstName || !formData.adminLastName || !formData.adminEmail || 
        !formData.adminPassword || !formData.confirmPassword) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (formData.adminPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.COMPANY_REGISTER, formData);
      
      if (response.status === 201) {
        setMessage("Company registered successfully! Redirecting to login...");
        setMessageType("success");
        
        // Redirect to company login after 3 seconds
        setTimeout(() => {
          navigate("/company-login");
        }, 3000);
      }
    } catch (error) {
      console.error("Company registration error:", error);
      
      if (error.response?.status === 400) {
        setMessage(error.response.data.message || "Company registration failed");
      } else {
        setMessage("An error occurred during registration");
      }
      
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="company-registration-container">
      <div className="company-registration-card">
        <div className="registration-header">
          <div className="logo">
            <FaShieldAlt className="logo-icon" />
            <span className="logo-text">StockMaster</span>
          </div>
          <h1>Register Your Company</h1>
          <p>Join thousands of businesses managing their stock efficiently</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Company Information */}
          <div className="form-section">
            <h3>Company Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">
                  <FaBuilding /> Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">
                  <FaGlobe /> Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyEmail">
                  <FaEnvelope /> Company Email *
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="company@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="companyPhone">
                  <FaPhone /> Company Phone
                </label>
                <input
                  type="tel"
                  id="companyPhone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="website">
                <FaGlobe /> Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Admin Account Information */}
          <div className="form-section">
            <h3>Admin Account</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adminFirstName">
                  <FaUser /> First Name *
                </label>
                <input
                  type="text"
                  id="adminFirstName"
                  name="adminFirstName"
                  value={formData.adminFirstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminLastName">
                  <FaUser /> Last Name *
                </label>
                <input
                  type="text"
                  id="adminLastName"
                  name="adminLastName"
                  value={formData.adminLastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adminEmail">
                <FaEnvelope /> Admin Email *
              </label>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adminPassword">
                  <FaShieldAlt /> Password *
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaShieldAlt /> Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Creating Company...' : 'Create Company Account'}
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have a company account?{' '}
                         <a href="/company-login">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
