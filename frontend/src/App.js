import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LocationAnalyzer from './components/LocationAnalyzer';
import CompletePricingPage from './components/CompletePricingPage'; // Updated import
import ImprovedAuthModal from './components/ImprovedAuthModal';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import AnalysisHistory from './components/AnalysisHistory';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import SupportCenter from './components/SupportCenter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import UserProfileSettings from './components/UserProfileSettings';
import SecuritySettings from './components/SecuritySettings';
import InteractiveMap from './components/InteractiveMap';
import HeatmapComponent from './components/HeatmapComponent';
import EnterpriseLocationAnalyzer from './components/EnterpriseLocationAnalyzer';
import FacebookGroupMonetization from './components/FacebookGroupMonetization';
import MRRDashboard from './components/MRRDashboard';
import EnterprisePortal from './components/EnterprisePortal';
import AboutUs from './components/AboutUs';
import RevenueAnalyzer from './components/RevenueAnalyzer';
import EnhancedConsultantWidget from './components/EnhancedConsultantWidget';
import MediaKit from './components/MediaKit';
import APIDocumentation from './components/APIDocumentation';
import BlogSystem from './components/BlogSystem';
import MarketplaceDashboard from './components/ProfessionalMarketplace';
import ListingCreator from './components/ListingCreator';
import UserManagement from './components/UserManagement';

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

  // Auth Provider with access to state
  const AuthProviderWithState = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUserData();
      } else {
        setLoading(false);
      }
    }, [token]);

    // Listen for auth events from components
    useEffect(() => {
      const handleOpenAuth = (event) => {
        const mode = event.detail || 'login';
        setShowAuthModal(true);
        setAuthMode(mode);
      };

      window.addEventListener('openAuth', handleOpenAuth);
      return () => window.removeEventListener('openAuth', handleOpenAuth);
    }, []);

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API}/dashboard/stats`);
        if (response.data) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Only logout on 401 Unauthorized, not on other errors
        if (error.response?.status === 401) {
          logout();
        } else {
          // For other errors, just stop loading but keep user logged in
          setLoading(false);
        }
      }
    };

    const login = async (email, password) => {
      try {
        const response = await axios.post(`${API}/auth/login`, { email, password });
        const { access_token, user: userData } = response.data;
        
        setToken(access_token);
        setUser(userData);
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
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
        localStorage.setItem('user', JSON.stringify(userData));
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

  return (
    <AuthProviderWithState>
      <BrowserRouter>
        <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <AnimatePresence>
            {showAuthModal && (
              <ImprovedAuthModal
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
              element={<CompletePricingPage />} 
            />
            <Route 
              path="/facebook-group" 
              element={<FacebookGroupMonetization />} 
            />
            <Route 
              path="/about" 
              element={<AboutUs />} 
            />
            <Route 
              path="/media-kit" 
              element={<MediaKit />} 
            />
            <Route 
              path="/api-docs" 
              element={<APIDocumentation />} 
            />
            <Route 
              path="/blog" 
              element={<BlogSystem />} 
            />
            <Route 
              path="/blog/:slug" 
              element={<BlogSystem />} 
            />

            {/* Case Study Showcase - Public Access */}
            <Route path="/analyze" element={<RevenueAnalyzer />} />

            {/* NEW: Professional Marketplace */}
            <Route path="/marketplace" element={<MarketplaceDashboard />} />
            
            {/* NEW: User Management System */}
            <Route path="/account" element={<UserManagement />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <UserDashboard />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <AdminDashboard />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/security" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SecuritySettings />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <AnalyticsDashboard />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/support" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SupportCenter />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/mrr" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MRRDashboard />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/enterprise" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <EnterprisePortal />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/map" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Interactive Geographic Map</h1>
                        <p className="text-slate-400">Real-time location intelligence and user analytics</p>
                      </div>
                      <div className="h-[600px] rounded-2xl overflow-hidden">
                        <InteractiveMap />
                      </div>
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/heatmap" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <HeatmapComponent title="Enterprise Analytics Heatmap" className="h-full" />
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/enterprise-analyzer" element={
              <ProtectedRoute>
                <>
                  <EnterpriseLocationAnalyzer />
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
                  <UserProfileSettings />
                </>
              </ProtectedRoute>
            } />

            {/* Legal/Compliance Routes */}
            <Route path="/privacy" element={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Information We Collect</h2>
                      <p className="text-slate-300 mb-4">
                        LaundroTech collects information you provide directly to us, such as when you create an account, 
                        request location analyses, or contact us for support.
                      </p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">How We Use Your Information</h2>
                      <p className="text-slate-300 mb-4">
                        We use the information we collect to provide, maintain, and improve our services, 
                        process transactions, and communicate with you.
                      </p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Data Security</h2>
                      <p className="text-slate-300 mb-4">
                        We implement appropriate technical and organizational measures to protect your personal information 
                        against unauthorized access, alteration, disclosure, or destruction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/terms" element={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Acceptance of Terms</h2>
                      <p className="text-slate-300 mb-4">
                        By accessing and using LaundroTech, you accept and agree to be bound by the terms 
                        and provision of this agreement.
                      </p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Service Description</h2>
                      <p className="text-slate-300 mb-4">
                        LaundroTech provides location intelligence and analysis services for the laundromat industry. 
                        Our platform uses AI and data analytics to provide insights and recommendations.
                      </p>
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Disclaimer</h2>
                      <p className="text-red-300 mb-4 font-semibold">
                        IMPORTANT: All analysis results, ROI projections, and business recommendations are for 
                        informational purposes only and should not be considered as investment advice. 
                        LaundroTech makes no guarantees about the accuracy or completeness of the information provided.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/disclaimer" element={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold text-white mb-8">Investment Disclaimer</h1>
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-red-300 mb-4">⚠️ Important Investment Warning</h2>
                        <ul className="text-red-200 space-y-2">
                          <li>• All financial projections and ROI estimates are hypothetical and for informational purposes only</li>
                          <li>• Past performance does not guarantee future results</li>
                          <li>• Laundromat investments carry significant financial risk</li>
                          <li>• You may lose some or all of your investment</li>
                          <li>• Consult qualified financial advisors before making investment decisions</li>
                        </ul>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">No Investment Advice</h2>
                      <p className="text-slate-300 mb-4">
                        LaundroTech is a data analysis platform and does not provide investment advice. 
                        Our analysis is based on publicly available data and should be considered as one of many factors 
                        in your due diligence process.
                      </p>
                      
                      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Data Accuracy</h2>
                      <p className="text-slate-300 mb-4">
                        While we strive for accuracy, we cannot guarantee that all data and analysis results are 
                        error-free or current. Market conditions change rapidly and may affect the validity of our analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Enhanced Consultant Widget - Intelligent guide to consultant transformation */}
          <EnhancedConsultantWidget />
        </div>
      </BrowserRouter>
    </AuthProviderWithState>
  );
}

export default App;