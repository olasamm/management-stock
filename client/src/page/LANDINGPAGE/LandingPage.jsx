import React from 'react';
import { FaChartLine, FaBoxes, FaUsers, FaShieldAlt, FaRocket, FaCheckCircle } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <FaBoxes className="logo-icon" />
            <span className="logo-text">StockMaster</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <button className="nav-btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Your Inventory with
              <span className="hero-highlight"> StockMaster</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your stock management with our powerful, intuitive platform. 
              Track inventory, manage suppliers, and optimize your business operations.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Start Free Trial</button>
              <button className="btn-secondary">Watch Demo</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="dashboard-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="chart-placeholder"></div>
                <div className="stats-grid">
                  <div className="stat-card"></div>
                  <div className="stat-card"></div>
                  <div className="stat-card"></div>
                  <div className="stat-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose StockMaster?</h2>
            <p className="section-subtitle">
              Powerful features designed to transform your inventory management
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3 className="feature-title">Real-time Analytics</h3>
              <p className="feature-description">
                Get instant insights into your inventory performance with advanced analytics and reporting.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaBoxes />
              </div>
              <h3 className="feature-title">Smart Inventory Tracking</h3>
              <p className="feature-description">
                Automated stock level monitoring with intelligent reorder alerts and demand forecasting.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Work together seamlessly with role-based access control and real-time updates.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">
                Enterprise-grade security with automated backups and 99.9% uptime guarantee.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Optimized performance that scales with your business needs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCheckCircle />
              </div>
              <h3 className="feature-title">Easy Integration</h3>
              <p className="feature-description">
                Connect with your existing tools and systems through our robust API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Stock Management?</h2>
          <p>Join thousands of businesses already using StockMaster to streamline their operations</p>
          <div className="cta-buttons">
                         <a href="/company-registration" className="cta-btn primary">Get Started Free</a>
             <a href="/company-login" className="cta-btn secondary">Company Login</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <FaBoxes className="logo-icon" />
                <span className="logo-text">StockMaster</span>
              </div>
              <p className="footer-description">
                The ultimate inventory management solution for modern businesses.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#integrations">Integrations</a>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#status">Status</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 StockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
