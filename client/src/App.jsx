import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './page/LANDINGPAGE/LandingPage'
import './App.css'

// Import components
import Signin from './page/USER/Signin'
import Signup from './page/USER/Signup'
import AdminSignin from './page/ADMIN/AdminSignin'
import AdminSignup from './page/ADMIN/AdminSignup'
import CompanyRegistration from './page/COMPANY/CompanyRegistration'
import CompanyLogin from './page/COMPANY/CompanyLogin'
import CompanyAdminDashboard from './page/COMPANY/CompanyAdminDashboard'
import AcceptInvitation from './page/COMPANY/AcceptInvitation'
import TeamLogin from './page/COMPANY/TeamLogin'
import Dashboard from './page/USER/Dashboard'
import AdminDashboard from './page/ADMIN/AdminDashboard'

// Simple guard to require company admin auth
const RequireAdmin = ({ children }) => {
  const admin = localStorage.getItem('admin')
  const token = localStorage.getItem('token')
  if (!admin || !token) {
    return <Navigate to="/company-login" replace />
  }
  return children
}

function App() {
  return (
    
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/admin-signin' element={<AdminSignin />} />
      <Route path='/admin-signup' element={<AdminSignup />} />
      <Route path='/company-registration' element={<CompanyRegistration />} />
      <Route path='/company-login' element={<CompanyLogin />} />
      <Route path='/user-dashboard' element={<Dashboard />} />
      <Route path='/company/:companyId/dashboard' element={<Dashboard />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/company-admin-dashboard/:companyId' element={<RequireAdmin><CompanyAdminDashboard /></RequireAdmin>} />
      <Route path='/accept-invitation/:token' element={<AcceptInvitation />} />
      <Route path='/team-login' element={<TeamLogin />} />

    </Routes>
    
  )
}

export default App