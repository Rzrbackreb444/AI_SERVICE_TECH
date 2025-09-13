import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LocationAnalyzer from './components/LocationAnalyzer';
import PricingPage from './components/PricingPage';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import AnalysisHistory from './components/AnalysisHistory';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      if (response.data) {
        // User is authenticated
        setLoading(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (email, password, fullName, facebookMember = false) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        email,
        password,
        full_name: fullName,
        facebook_group_member: facebookMember
      });
      
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Main App Component
function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal
                mode={authMode}
                onClose={closeAuthModal}
                onSwitchMode={setAuthMode}
              />
            )}
          </AnimatePresence>

          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={<LandingPage onOpenAuth={openAuthModal} />} 
            />
            <Route 
              path="/pricing" 
              element={<PricingPage onOpenAuth={openAuthModal} />} 
            />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/analyze" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <LocationAnalyzer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <AnalysisHistory />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ProfilePage />
                </>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;