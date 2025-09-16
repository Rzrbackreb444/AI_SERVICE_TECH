import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChartBarIcon,
  MapPinIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CpuChipIcon,
  BellIcon,
  BuildingOffice2Icon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'AI Dashboard', href: '/dashboard', icon: CpuChipIcon },
    { name: 'Location Intelligence', href: '/analyze', icon: MapPinIcon },
    // Hidden for strategic focus:
    // { name: '🏢 Marketplace', href: '/marketplace', icon: BuildingOffice2Icon },
    // { name: '📝 Blog Manager', href: '/blog-manager', icon: DocumentTextIcon },
    // { name: 'Account Settings', href: '/account', icon: UserCircleIcon },
    // { name: 'Analysis Archive', href: '/history', icon: ClockIcon },
    // { name: '💰 MRR Dashboard', href: '/mrr', icon: ChartBarIcon },
    // { name: '🏢 Enterprise Portal', href: '/enterprise', icon: CpuChipIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getSubscriptionBadge = (tier) => {
    const badges = {
      'free': { color: 'from-slate-500 to-slate-600', label: 'Scout', textColor: 'text-slate-200' },
      'analyzer': { color: 'from-blue-500 to-blue-600', label: 'Analyzer', textColor: 'text-white' },
      'intelligence': { color: 'from-cyan-500 to-emerald-500', label: 'Intelligence', textColor: 'text-white' },
      'optimization': { color: 'from-purple-500 to-pink-500', label: 'Optimization', textColor: 'text-white' },
      'portfolio': { color: 'from-orange-500 to-red-500', label: 'Portfolio', textColor: 'text-white' },
      'watch_pro': { color: 'from-green-500 to-teal-500', label: 'Watch Pro', textColor: 'text-white' }
    };
    return badges[tier] || badges.free;
  };

  const subscriptionBadge = getSubscriptionBadge(user?.subscription_tier);

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl relative">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced LaundroTech Branding - Larger Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BuildingOffice2Icon className="h-7 w-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
                  LaundroTech
                </h1>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      active 
                        ? 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-cyan-400' : ''}`} />
                    <span>{item.name}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Facebook Group Button */}
          <motion.a
            href="https://facebook.com/groups/thelaundromat"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Join Group</span>
          </motion.a>

          {/* Enhanced User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-4 text-slate-300 hover:text-white transition-colors duration-300 group"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{user?.full_name || 'User'}</p>
                <div className="flex items-center justify-end space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${subscriptionBadge.color} ${subscriptionBadge.textColor} font-bold`}>
                    {subscriptionBadge.label}
                  </span>
                  {user?.facebook_group_member && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white font-bold">
                      67K Member
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-cyan-400/25 transition-all duration-300">
                  <span className="text-white font-bold text-lg">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
              </div>
            </button>

            {/* Enhanced User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 glass-card overflow-hidden z-50 border border-white/10"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="font-semibold text-white">{user?.full_name}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${subscriptionBadge.color} ${subscriptionBadge.textColor} font-bold`}>
                        {subscriptionBadge.label} Tier
                      </span>
                      {user?.facebook_group_member && (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white font-bold">
                          Elite Member
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    Profile & Settings
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-7 h-7" />
                ) : (
                  <Bars3Icon className="w-7 h-7" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl absolute top-full left-0 right-0 z-40"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        active 
                          ? 'text-cyan-400 bg-cyan-400/10' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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