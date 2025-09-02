import React, { useState } from 'react';
import { FaBuilding, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './CompanyLogin.css';

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
              const response = await fetch('https://stock-management-0ywb.onrender.com/company-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

             if (response.ok) {
         // Store company admin data
         localStorage.setItem('admin', JSON.stringify(data.companyAdmin));
         localStorage.setItem('token', data.token);
        
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        
        // Redirect to company admin dashboard
        setTimeout(() => {
          navigate('/company-admin-dashboard');
        }, 1500);
      } else {
        setMessage({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="company-login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <FaBuilding className="logo-icon" />
            <h1>Company Login</h1>
          </div>
          <p>Access your company dashboard</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Company Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your company email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FaSignInAlt />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have a company account?{' '}
                         <Link to="/company-registration" className="link">
               Register here
             </Link>
           </p>
           <p>
             <Link to="/signin" className="link">
               Back to user login
             </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
