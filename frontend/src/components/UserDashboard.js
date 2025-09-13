import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon,
  PresentationChartBarIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load subscriptions
      const subsResponse = await axios.get(`${API}/user/subscriptions`, {
        headers: getAuthHeaders()
      });
      setSubscriptions(subsResponse.data.subscriptions || []);

      // Load payment history
      const transResponse = await axios.get(`${API}/user/transactions`, {
        headers: getAuthHeaders()
      });
      setTransactions(transResponse.data.transactions || []);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await axios.post(`${API}/user/subscriptions/${subscriptionId}/cancel`, {}, {
        headers: getAuthHeaders()
      });
      
      alert('Subscription cancelled successfully');
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please contact support.');
    }
  };

  const getBadgeIcon = (offerType) => {
    const icons = {
      'verified_seller': ShieldCheckIcon,
      'vendor_partner': BoltIcon,
      'verified_funder': TrophyIcon,
      'featured_post': SparklesIcon,
      'logo_placement': PresentationChartBarIcon,
      'sponsored_ama': PhoneIcon
    };
    return icons[offerType] || ShieldCheckIcon;
  };

  const getBadgeColor = (offerType) => {
    const colors = {
      'verified_seller': 'from-emerald-500 to-green-500',
      'vendor_partner': 'from-blue-500 to-cyan-500',
      'verified_funder': 'from-purple-500 to-pink-500',
      'featured_post': 'from-yellow-500 to-orange-500',
      'logo_placement': 'from-rose-500 to-red-500',
      'sponsored_ama': 'from-pink-500 to-rose-500'
    };
    return colors[offerType] || 'from-slate-500 to-slate-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <ArrowPathIcon className="w-5 h-5 text-yellow-400 animate-spin" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeBadges = subscriptions.filter(sub => sub.badge_active && sub.subscription_status === 'active');
  const totalSpent = transactions.reduce((sum, trans) => sum + (trans.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-white">
              LaundroTech <span className="text-slate-400 text-sm">Powered by SiteAtlas</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/facebook-group" className="text-slate-300 hover:text-white transition-colors">
                Facebook Group
              </Link>
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="w-8 h-8 text-blue-400" />
                <span className="text-white font-medium">{user?.full_name || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Member'}!
          </h1>
          <p className="text-slate-300 text-lg">Manage your badges, subscriptions, and account settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 text-center"
          >
            <ShieldCheckIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{activeBadges.length}</div>
            <div className="text-slate-400">Active Badges</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 text-center"
          >
            <CreditCardIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{subscriptions.length}</div>
            <div className="text-slate-400">Total Subscriptions</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <CurrencyDollarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</div>
            <div className="text-slate-400">Total Spent</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 text-center"
          >
            <CalendarIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              {user?.created_at ? formatDate(user.created_at) : 'N/A'}
            </div>
            <div className="text-slate-400">Member Since</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="glass-card mb-8">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: UserCircleIcon },
                { id: 'subscriptions', name: 'Subscriptions', icon: ShieldCheckIcon },
                { id: 'payments', name: 'Payment History', icon: CreditCardIcon },
                { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Badges */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Active Badges</h3>
                  {activeBadges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeBadges.map((badge) => {
                        const IconComponent = getBadgeIcon(badge.offer_type);
                        return (
                          <div key={badge.id} className="glass-card p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getBadgeColor(badge.offer_type)} flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-white font-medium">{badge.offer_type.replace('_', ' ').toUpperCase()}</div>
                                <div className="text-slate-400 text-sm">{formatCurrency(badge.payment_amount)}/month</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              {getStatusIcon(badge.subscription_status)}
                              {badge.expires_at && (
                                <div className="text-slate-400 text-sm">
                                  Renews {formatDate(badge.expires_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShieldCheckIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No active badges</p>
                      <Link 
                        to="/facebook-group" 
                        className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Browse Available Badges
                      </Link>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCardIcon className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{transaction.offer_type.replace('_', ' ').toUpperCase()}</div>
                            <div className="text-slate-400 text-sm">{formatDate(transaction.created_at)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatCurrency(transaction.amount)}</div>
                          <div className="text-slate-400 text-sm capitalize">{transaction.payment_status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Your Subscriptions</h3>
                  <Link 
                    to="/facebook-group" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Add New Badge
                  </Link>
                </div>

                {subscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => {
                      const IconComponent = getBadgeIcon(subscription.offer_type);
                      return (
                        <div key={subscription.id} className="glass-card p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getBadgeColor(subscription.offer_type)} flex items-center justify-center`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-white">
                                  {subscription.offer_type.replace('_', ' ').toUpperCase()}
                                </h4>
                                <p className="text-slate-400">
                                  {formatCurrency(subscription.payment_amount)} • {subscription.payment_provider}
                                  {subscription.paypal_discount_applied && (
                                    <span className="text-yellow-400 ml-2">(10% PayPal Discount)</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(subscription.subscription_status)}
                                  <span className="text-white capitalize">{subscription.subscription_status}</span>
                                </div>
                                {subscription.expires_at && (
                                  <p className="text-slate-400 text-sm">
                                    {subscription.subscription_status === 'active' ? 'Renews' : 'Expires'} {formatDate(subscription.expires_at)}
                                  </p>
                                )}
                              </div>
                              
                              {subscription.subscription_status === 'active' && (
                                <button
                                  onClick={() => cancelSubscription(subscription.id)}
                                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShieldCheckIcon className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-white mb-4">No Subscriptions Yet</h3>
                    <p className="text-slate-400 mb-6">Get started with a badge to unlock exclusive community features</p>
                    <Link 
                      to="/facebook-group" 
                      className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Browse Available Badges
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Payment History</h3>
                
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-3 text-slate-300 font-medium">Date</th>
                          <th className="text-left py-3 text-slate-300 font-medium">Item</th>
                          <th className="text-left py-3 text-slate-300 font-medium">Amount</th>
                          <th className="text-left py-3 text-slate-300 font-medium">Method</th>
                          <th className="text-left py-3 text-slate-300 font-medium">Status</th>
                          <th className="text-left py-3 text-slate-300 font-medium">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-slate-700/50">
                            <td className="py-4 text-slate-300">{formatDate(transaction.created_at)}</td>
                            <td className="py-4 text-white font-medium">
                              {transaction.offer_type.replace('_', ' ').toUpperCase()}
                            </td>
                            <td className="py-4 text-white">{formatCurrency(transaction.amount)}</td>
                            <td className="py-4">
                              <span className="capitalize text-slate-300">{transaction.payment_provider}</span>
                              {transaction.paypal_discount && (
                                <span className="text-yellow-400 text-sm ml-2">(10% off)</span>
                              )}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.payment_status === 'completed' 
                                  ? 'bg-green-400/20 text-green-400'
                                  : transaction.payment_status === 'pending' 
                                  ? 'bg-yellow-400/20 text-yellow-400'
                                  : 'bg-red-400/20 text-red-400'
                              }`}>
                                {transaction.payment_status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                <DocumentArrowDownIcon className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCardIcon className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-white mb-4">No Payment History</h3>
                    <p className="text-slate-400">Your payment history will appear here after your first purchase</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Account Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Profile Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                        <div className="text-white bg-slate-800/50 px-4 py-2 rounded-lg">
                          {user?.full_name || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                        <div className="text-white bg-slate-800/50 px-4 py-2 rounded-lg">
                          {user?.email || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Facebook Group Member</label>
                        <div className={`px-4 py-2 rounded-lg ${
                          user?.facebook_group_member 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-gray-400/20 text-gray-400'
                        }`}>
                          {user?.facebook_group_member ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Account Actions</h4>
                    <div className="space-y-4">
                      <button className="w-full text-left p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="text-white font-medium">Update Profile</div>
                        <div className="text-slate-400 text-sm">Change your name and preferences</div>
                      </button>
                      
                      <button className="w-full text-left p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="text-white font-medium">Change Password</div>
                        <div className="text-slate-400 text-sm">Update your account password</div>
                      </button>
                      
                      <button className="w-full text-left p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="text-white font-medium">Download Data</div>
                        <div className="text-slate-400 text-sm">Export your account information</div>
                      </button>
                      
                      <a 
                        href="mailto:nick@laundrotech.xyz" 
                        className="block w-full text-left p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="text-white font-medium">Contact Support</div>
                        <div className="text-slate-400 text-sm">Get help with your account</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;