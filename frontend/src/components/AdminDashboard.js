import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon,
  PresentationChartBarIcon,
  PhoneIcon,
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    loadAdminData();
  }, [selectedPeriod]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load admin statistics
      const statsResponse = await axios.get(`${API}/admin/stats?period=${selectedPeriod}`, {
        headers: getAuthHeaders()
      });
      setStats(statsResponse.data);

      // Load users data
      const usersResponse = await axios.get(`${API}/admin/users`, {
        headers: getAuthHeaders()
      });
      setUsers(usersResponse.data.users || []);

      // Load subscriptions
      const subsResponse = await axios.get(`${API}/admin/subscriptions`, {
        headers: getAuthHeaders()
      });
      setSubscriptions(subsResponse.data.subscriptions || []);

      // Load transactions
      const transResponse = await axios.get(`${API}/admin/transactions?limit=50`, {
        headers: getAuthHeaders()
      });
      setTransactions(transResponse.data.transactions || []);

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBadgeStatus = async (subscriptionId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.post(`${API}/admin/subscriptions/${subscriptionId}/toggle`, {
        status: newStatus
      }, {
        headers: getAuthHeaders()
      });
      
      alert(`Badge ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      loadAdminData(); // Reload data
    } catch (error) {
      console.error('Failed to toggle badge status:', error);
      alert('Failed to update badge status. Please try again.');
    }
  };

  const processRefund = async (transactionId, amount) => {
    if (!window.confirm(`Are you sure you want to process a $${amount} refund?`)) {
      return;
    }

    try {
      await axios.post(`${API}/admin/transactions/${transactionId}/refund`, {
        amount: amount
      }, {
        headers: getAuthHeaders()
      });
      
      alert('Refund processed successfully');
      loadAdminData(); // Reload data
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert('Failed to process refund. Please try again.');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading admin dashboard...</p>
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
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                LaundroTech Admin <span className="text-slate-400 text-sm">SiteAtlas</span>
              </h1>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-slate-300">
                Admin: <span className="text-white font-medium">Nick</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center text-sm">
                  {stats.revenueChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={stats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {Math.abs(stats.revenueChange || 0)}%
                  </span>
                  <span className="text-slate-400 ml-1">vs prev period</span>
                </div>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Subscribers</p>
                <p className="text-2xl font-bold text-white">{stats.activeSubscribers || 0}</p>
                <div className="flex items-center text-sm">
                  <span className="text-blue-400">{stats.newSubscribers || 0} new</span>
                  <span className="text-slate-400 ml-1">this period</span>
                </div>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{stats.totalTransactions || 0}</p>
                <div className="flex items-center text-sm">
                  <span className="text-purple-400">{stats.successRate || 0}%</span>
                  <span className="text-slate-400 ml-1">success rate</span>
                </div>
              </div>
              <CreditCardIcon className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Average Order Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.averageOrderValue)}</p>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-400">{stats.churnRate || 0}%</span>
                  <span className="text-slate-400 ml-1">churn rate</span>
                </div>
              </div>
              <ChartBarIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="glass-card mb-8">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Revenue Overview', icon: ChartBarIcon },
                { id: 'subscriptions', name: 'Badge Management', icon: ShieldCheckIcon },
                { id: 'users', name: 'User Management', icon: UserGroupIcon },
                { id: 'transactions', name: 'Transactions', icon: CreditCardIcon }
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
            {/* Revenue Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Revenue by Badge Type */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Revenue by Badge Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stats.revenueByBadge || {}).map(([badgeType, revenue]) => {
                      const IconComponent = getBadgeIcon(badgeType);
                      return (
                        <div key={badgeType} className="glass-card p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getBadgeColor(badgeType)} flex items-center justify-center`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-white font-medium capitalize">
                              {badgeType.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-white">{formatCurrency(revenue)}</div>
                          <div className="text-slate-400 text-sm">
                            {stats.countByBadge?.[badgeType] || 0} subscribers
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Breakdown */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <h4 className="text-lg font-medium text-white mb-4">PayPal Transactions</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Total Revenue:</span>
                          <span className="text-white font-medium">{formatCurrency(stats.paypalRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Transaction Count:</span>
                          <span className="text-white font-medium">{stats.paypalCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Discounts Applied:</span>
                          <span className="text-yellow-400 font-medium">{formatCurrency(stats.paypalDiscounts)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h4 className="text-lg font-medium text-white mb-4">Stripe Transactions</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Total Revenue:</span>
                          <span className="text-white font-medium">{formatCurrency(stats.stripeRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Transaction Count:</span>
                          <span className="text-white font-medium">{stats.stripeCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Success Rate:</span>
                          <span className="text-green-400 font-medium">{stats.stripeSuccessRate || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Badge Management Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Active Badge Subscriptions</h3>
                  <div className="text-slate-400">
                    {subscriptions.filter(sub => sub.subscription_status === 'active').length} active
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 text-slate-300 font-medium">User</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Badge</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Amount</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Status</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Next Billing</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((subscription) => {
                        const user = users.find(u => u.id === subscription.user_id);
                        const IconComponent = getBadgeIcon(subscription.offer_type);
                        return (
                          <tr key={subscription.id} className="border-b border-slate-700/50">
                            <td className="py-4">
                              <div className="text-white font-medium">{user?.full_name || 'Unknown'}</div>
                              <div className="text-slate-400 text-sm">{user?.email || 'N/A'}</div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded bg-gradient-to-r ${getBadgeColor(subscription.offer_type)} flex items-center justify-center`}>
                                  <IconComponent className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-white capitalize">
                                  {subscription.offer_type.replace('_', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-white">{formatCurrency(subscription.payment_amount)}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscription.subscription_status === 'active' 
                                  ? 'bg-green-400/20 text-green-400'
                                  : subscription.subscription_status === 'cancelled' 
                                  ? 'bg-red-400/20 text-red-400'
                                  : 'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {subscription.subscription_status}
                              </span>
                            </td>
                            <td className="py-4 text-slate-300">
                              {subscription.expires_at ? formatDate(subscription.expires_at) : 'N/A'}
                            </td>
                            <td className="py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toggleBadgeStatus(subscription.id, subscription.subscription_status)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    subscription.subscription_status === 'active'
                                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  }`}
                                  title={subscription.subscription_status === 'active' ? 'Suspend' : 'Activate'}
                                >
                                  {subscription.subscription_status === 'active' ? 
                                    <XMarkIcon className="w-4 h-4" /> : 
                                    <CheckIcon className="w-4 h-4" />
                                  }
                                </button>
                                <button
                                  className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <div className="text-slate-400">
                    {users.length} total users
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 text-slate-300 font-medium">User</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Join Date</th>
                        <th className="text-left py-3 text-slate-300 font-medium">FB Member</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Active Badges</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Total Spent</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 20).map((user) => {
                        const userSubscriptions = subscriptions.filter(sub => sub.user_id === user.id && sub.subscription_status === 'active');
                        const userTransactions = transactions.filter(trans => trans.user_id === user.id);
                        const totalSpent = userTransactions.reduce((sum, trans) => sum + (trans.amount || 0), 0);
                        
                        return (
                          <tr key={user.id} className="border-b border-slate-700/50">
                            <td className="py-4">
                              <div className="text-white font-medium">{user.full_name}</div>
                              <div className="text-slate-400 text-sm">{user.email}</div>
                            </td>
                            <td className="py-4 text-slate-300">{formatDate(user.created_at)}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.facebook_group_member
                                  ? 'bg-green-400/20 text-green-400'
                                  : 'bg-gray-400/20 text-gray-400'
                              }`}>
                                {user.facebook_group_member ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-4 text-white">{userSubscriptions.length}</td>
                            <td className="py-4 text-white">{formatCurrency(totalSpent)}</td>
                            <td className="py-4">
                              <button
                                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                                title="View User Details"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                  <div className="text-slate-400">
                    Last 50 transactions
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 text-slate-300 font-medium">Date</th>
                        <th className="text-left py-3 text-slate-300 font-medium">User</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Item</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Amount</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Method</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Status</th>
                        <th className="text-left py-3 text-slate-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => {
                        const user = users.find(u => u.id === transaction.user_id);
                        return (
                          <tr key={transaction.id} className="border-b border-slate-700/50">
                            <td className="py-4 text-slate-300">{formatDate(transaction.created_at)}</td>
                            <td className="py-4">
                              <div className="text-white font-medium">{user?.full_name || 'Unknown'}</div>
                              <div className="text-slate-400 text-sm">{user?.email || 'N/A'}</div>
                            </td>
                            <td className="py-4 text-white capitalize">
                              {transaction.offer_type.replace('_', ' ')}
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
                              <div className="flex space-x-2">
                                <button
                                  className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                {transaction.payment_status === 'completed' && (
                                  <button
                                    onClick={() => processRefund(transaction.id, transaction.amount)}
                                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    title="Process Refund"
                                  >
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;