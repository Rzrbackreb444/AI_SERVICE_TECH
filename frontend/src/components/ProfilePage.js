import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  EnvelopeIcon,
  KeyIcon,
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    analysisAlerts: true,
    marketUpdates: false,
    promotions: true,
    weeklyReport: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // TODO: Implement password change API call
    console.log('Changing password');
  };

  const getSubscriptionBadge = (tier) => {
    const badges = {
      'free': { color: 'bg-slate-600', label: 'Free' },
      'basic': { color: 'bg-blue-600', label: 'Analyzer' },
      'intelligence': { color: 'bg-cyan-600', label: 'Intelligence' },
      'optimization': { color: 'bg-purple-600', label: 'LaundroMax' },
      'portfolio': { color: 'bg-orange-600', label: 'Empire' },
      'pro': { color: 'bg-green-600', label: 'Watch Pro' }
    };
    return badges[tier] || badges.free;
  };

  const subscriptionBadge = getSubscriptionBadge(user?.subscription_tier);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {user?.full_name || 'User Profile'}
              </h1>
              <p className="text-slate-400 mb-2">{user?.email}</p>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${subscriptionBadge.color}`}>
                  {subscriptionBadge.label} Tier
                </span>
                {user?.facebook_group_member && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold text-blue-100 bg-blue-600">
                    Facebook Member
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card mb-8"
        >
          <div className="flex border-b border-slate-600">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Enter your full name"
                      />
                      <UserCircleIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Enter your email"
                      />
                      <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Enter current password"
                      />
                      <KeyIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Enter new password"
                      />
                      <KeyIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Confirm new password"
                      />
                      <KeyIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Update Password
                  </button>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { key: 'analysisAlerts', label: 'Analysis Completion Alerts', description: 'Get notified when your location analysis is ready' },
                    { key: 'marketUpdates', label: 'Market Updates', description: 'Receive alerts about market changes affecting your locations' },
                    { key: 'promotions', label: 'Promotions & Special Offers', description: 'Stay informed about discounts and new features' },
                    { key: 'weeklyReport', label: 'Weekly Intelligence Report', description: 'Get a summary of market trends and opportunities' }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">{notification.label}</h3>
                        <p className="text-slate-400 text-sm">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[notification.key]}
                          onChange={() => handleNotificationChange(notification.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Billing & Subscription</h2>
                
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${subscriptionBadge.color}`}>
                        {subscriptionBadge.label} Tier
                      </span>
                    </div>
                    <p className="text-slate-400 mb-4">
                      {user?.subscription_tier === 'free' 
                        ? 'You are currently on the free tier with basic features.'
                        : 'You have access to premium features and unlimited analyses.'
                      }
                    </p>
                    <button className="btn-primary">
                      {user?.subscription_tier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                    </button>
                  </div>

                  {/* Billing History */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                    <div className="text-slate-400 text-center py-8">
                      <CreditCardIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No billing history available</p>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">0</div>
                        <div className="text-slate-400 text-sm">This Month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">0</div>
                        <div className="text-slate-400 text-sm">Total Analyses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">∞</div>
                        <div className="text-slate-400 text-sm">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;