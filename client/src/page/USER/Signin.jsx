import React, { useState } from 'react';
import { FaBoxes, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/config';
import './Signin.css';

const Signin = () => {
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
      const response = await axios.post(API_ENDPOINTS.SIGNIN, formData);
      
      if (response.status === 200) {
        setMessage("Login successful!");
        setMessageType("success");
        
        // Store user data in localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Signin error:", error);
      
      if (error.response?.status === 401) {
        setMessage("Invalid email or password");
      } else if (error.response?.status === 400) {
        setMessage(error.response.data.message || "Invalid credentials");
      } else {
        setMessage("An error occurred during signin");
      }
      
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <div className="logo">
            <FaBoxes className="logo-icon" />
            <span className="logo-text">StockMaster</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
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
                onChange={handleInputChange}
                placeholder="Enter your password"
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
            className="signin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
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

        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <a href="/signup">Sign up for free</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;