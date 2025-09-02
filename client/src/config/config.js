// API Configuration
export const API_BASE_URL = 'https://stock-management-0ywb.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  SIGNUP: `${API_BASE_URL}/signup`,
  SIGNIN: `${API_BASE_URL}/signin`,
  
  // Admin endpoints
  ADMIN_SIGNUP: `${API_BASE_URL}/admin/signup`,
  ADMIN_SIGNIN: `${API_BASE_URL}/admin/signin`,
  
  // Company endpoints
  COMPANY_REGISTER: `${API_BASE_URL}/company/register`,
  COMPANY_LOGIN: `${API_BASE_URL}/company-login`,
  
  // Team endpoints
  TEAM_LOGIN: `${API_BASE_URL}/team-login`,
  INVITE_TEAM_MEMBER: `${API_BASE_URL}/invite-team-member`,
  CREATE_TEAM_MEMBER: `${API_BASE_URL}/create-team-member`,
  ACCEPT_INVITATION: `${API_BASE_URL}/accept-invitation`,
  VALIDATE_INVITATION: `${API_BASE_URL}/validate-invitation`,
  
  // Stock management endpoints
  STOCK_ITEMS: `${API_BASE_URL}/stock-items`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  TEAM_MEMBERS: `${API_BASE_URL}/team-members`,
};

// Frontend URL for invitation links
export const FRONTEND_URL = 'https://stock-management-rosy.vercel.app';
