import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChartBarIcon,
  MapPinIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Analyze Location', href: '/analyze', icon: MapPinIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/kw0rymvw_logo1.png" 
                alt="SiteTitan Logo"
                className="h-8 w-8"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">SiteTitan</h1>
                <p className="text-xs text-slate-400 -mt-1">LaundroTech Intelligence</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-200"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.subscription_tier || 'free'} tier</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 glass-card overflow-hidden z-50"
              >
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserCircleIcon className="w-4 h-4 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowUserMenu(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;