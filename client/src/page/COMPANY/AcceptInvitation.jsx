import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_ENDPOINTS } from '../../config/config';
import './AcceptInvitation.css';

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationData, setInvitationData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Validate token on component mount
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.VALIDATE_INVITATION}/${token}`);
      if (response.ok) {
        const data = await response.json();
        setInvitationData(data.invitation);
      } else {
        setMessage({ 
          text: 'Invalid or expired invitation link', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: 'Error validating invitation. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(API_ENDPOINTS.ACCEPT_INVITATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: 'Invitation accepted successfully! Redirecting to login...', 
          type: 'success' 
        });
        
        // Redirect to team login after 2 seconds
        setTimeout(() => {
          navigate('/team-login');
        }, 2000);
      } else {
        setMessage({ text: data.message || 'Failed to accept invitation', type: 'error' });
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!invitationData && !message.text) {
    return (
      <div className="accept-invitation-container">
        <div className="loading-spinner"></div>
        <p>Validating invitation...</p>
      </div>
    );
  }

  if (message.type === 'error' && !invitationData) {
    return (
      <div className="accept-invitation-container">
        <div className="error-card">
          <FaExclamationTriangle className="error-icon" />
          <h2>Invalid Invitation</h2>
          <p>{message.text}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invitation-container">
      <div className="invitation-card">
        <div className="invitation-header">
          <FaCheckCircle className="success-icon" />
          <h1>Accept Team Invitation</h1>
          <p>You've been invited to join <strong>{invitationData?.companyName}</strong></p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="invitation-form">
          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength="6"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="accept-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FaCheckCircle />
                Accept Invitation
              </>
            )}
          </button>
        </form>

        <div className="invitation-footer">
          <p>
            By accepting this invitation, you agree to join the team and follow the company's policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
