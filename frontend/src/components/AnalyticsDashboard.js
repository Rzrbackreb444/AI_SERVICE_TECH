import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  MapIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadialBarChart,
  RadialBar
} from '../utils/SimpleCharts';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [activeView, setActiveView] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [badgeDistribution, setBadgeDistribution] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [cohortData, setCohortData] = useState([]);

  const timeframes = [
    { id: '7d', name: '7 Days', days: 7 },
    { id: '30d', name: '30 Days', days: 30 },
    { id: '90d', name: '90 Days', days: 90 },
    { id: '1y', name: '1 Year', days: 365 }
  ];

  const viewTabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'revenue', name: 'Revenue Analytics', icon: CurrencyDollarIcon },
    { id: 'users', name: 'User Insights', icon: UserGroupIcon },
    { id: 'conversion', name: 'Conversion Funnel', icon: FunnelIcon },
    { id: 'geography', name: 'Geographic Analysis', icon: MapIcon },
    { id: 'predictions', name: 'Predictions & Forecasting', icon: ArrowTrendingUpIcon }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTimeframe]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load comprehensive analytics data with proper error handling
      const [
        analyticsResponse,
        revenueResponse,
        userGrowthResponse,
        badgeResponse,
        conversionResponse,
        geoResponse,
        cohortResponse
      ] = await Promise.all([
        axios.get(`${API}/analytics/overview?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/revenue?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/user-growth?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/badge-distribution?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/conversion-funnel?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/geographic?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/cohort-analysis?timeframe=${activeTimeframe}`, { headers: getAuthHeaders() })
      ]);

      // Process analytics overview
      const overview = analyticsResponse.data;
      setAnalyticsData({
        totalUsers: overview.totalUsers || 0,
        totalRevenue: overview.totalRevenue || 0,
        monthlyRevenue: overview.monthlyRevenue || 0,
        activeSubscriptions: overview.activeSubscriptions || 0,
        revenueGrowth: overview.revenueGrowth || 0,
        userGrowth: overview.userGrowth || 0,
        conversionRate: overview.conversionRate || 0,
        customerLifetimeValue: overview.customerLifetimeValue || 0,
        churnRate: overview.churnRate || 0,
        totalTransactions: overview.totalTransactions || 0,
        averageRevenuePer: overview.averageRevenuePer || 0
      });

      // Process revenue data
      const revenueData = revenueResponse.data;
      setRevenueData(revenueData.dailyRevenue || []);

      // Process user growth data
      const userGrowthData = userGrowthResponse.data;
      setUserGrowthData(userGrowthData.dailyGrowth || []);

      // Process badge distribution
      const badgeData = badgeResponse.data;
      setBadgeDistribution(badgeData.distribution || []);

      // Process conversion funnel
      const conversionData = conversionResponse.data;
      setConversionFunnel(conversionData.funnel || []);

      // Process geographic data
      const geoData = geoResponse.data;
      setGeographicData(geoData.locations || []);

      // Process cohort analysis
      const cohortAnalysis = cohortResponse.data;
      setCohortData(cohortAnalysis.cohorts || []);

      console.log('✅ Analytics data loaded successfully:', {
        overview: overview,
        revenue: revenueData,
        userGrowth: userGrowthData,
        badges: badgeData,
        conversion: conversionData,
        geographic: geoData,
        cohorts: cohortAnalysis
      });

    } catch (error) {
      console.error('❌ Failed to load analytics data:', error);
      
      // Set default values to show current state (not mock data)
      setAnalyticsData({
        totalUsers: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        revenueGrowth: 0,
        userGrowth: 0,
        conversionRate: 0,
        customerLifetimeValue: 0,
        churnRate: 0,
        totalTransactions: 0,
        averageRevenuePer: 0
      });
      
      // Set empty arrays for charts
      setRevenueData([]);
      setUserGrowthData([]);
      setBadgeDistribution([]);
      setConversionFunnel([]);
      setGeographicData([]);
      setCohortData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format = 'pdf') => {
    try {
      const response = await axios.get(`${API}/analytics/export?format=${format}&timeframe=${activeTimeframe}`, {
        headers: getAuthHeaders(),
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${activeTimeframe}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Premium Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Analytics Dashboard
                  </h1>
                  <p className="text-xs text-slate-400">Enterprise Intelligence • Real-time</p>
                </div>
              </div>
              
              {/* Premium Timeframe Selector */}
              <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.id}
                    onClick={() => setActiveTimeframe(timeframe.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTimeframe === timeframe.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {timeframe.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Live Indicator */}
              <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Live Data</span>
              </div>
              
              {/* Export Buttons */}
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 rounded-lg hover:from-slate-600 hover:to-slate-500 transition-all duration-200 shadow-lg shadow-slate-700/25"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              
              <button
                onClick={() => exportReport('csv')}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(analyticsData.totalRevenue)}</p>
                <div className="flex items-center text-sm mt-1">
                  {analyticsData.revenueGrowth >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={analyticsData.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(analyticsData.revenueGrowth)}
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
                <p className="text-slate-400 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-white">{analyticsData.totalUsers?.toLocaleString()}</p>
                <div className="flex items-center text-sm mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400">{formatPercentage(analyticsData.userGrowth)}</span>
                  <span className="text-slate-400 ml-1">growth</span>
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
                <p className="text-slate-400 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">{analyticsData.conversionRate}%</p>
                <div className="flex items-center text-sm mt-1">
                  <FunnelIcon className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-purple-400">{analyticsData.activeSubscriptions}</span>
                  <span className="text-slate-400 ml-1">active subs</span>
                </div>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
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
                <p className="text-slate-400 text-sm font-medium">Customer LTV</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(analyticsData.customerLifetimeValue)}</p>
                <div className="flex items-center text-sm mt-1">
                  <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-yellow-400">{analyticsData.churnRate}%</span>
                  <span className="text-slate-400 ml-1">churn rate</span>
                </div>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* View Tabs */}
        <div className="glass-card mb-8">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {viewTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeView === tab.id
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
            {activeView === 'overview' && (
              <div className="space-y-8">
                {/* Revenue Chart */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Revenue Trends</h3>
                  <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stackId="1" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.6}
                          name="Total Revenue"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="subscriptions" 
                          stackId="2" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.6}
                          name="Subscriptions"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="oneTime" 
                          stackId="3" 
                          stroke="#F59E0B" 
                          fill="#F59E0B" 
                          fillOpacity={0.6}
                          name="One-time Payments"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Badge Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Badge Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={badgeDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {badgeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Badge Performance</h3>
                    <div className="space-y-4">
                      {badgeDistribution.map((badge, index) => (
                        <div key={index} className="glass-card p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: badge.color || COLORS[index % COLORS.length] }}
                              />
                              <span className="text-white font-medium">{badge.name}</span>
                            </div>
                            <span className="text-slate-400 text-sm">{badge.count} subscribers</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Revenue:</span>
                            <span className="text-white font-medium">{formatCurrency(badge.revenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Market Share:</span>
                            <span className="text-white font-medium">{badge.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Analytics Tab */}
            {activeView === 'revenue' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Revenue Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Subscription Revenue:</span>
                        <span className="text-green-400 font-medium">{formatCurrency(analyticsData.totalRevenue * 0.65)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">One-time Payments:</span>
                        <span className="text-blue-400 font-medium">{formatCurrency(analyticsData.totalRevenue * 0.35)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">PayPal Discounts:</span>
                        <span className="text-red-400 font-medium">-{formatCurrency(analyticsData.totalRevenue * 0.08)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Payment Methods</h4>
                    <div style={{ width: '100%', height: 200 }}>
                      <ResponsiveContainer>
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="20%" 
                          outerRadius="90%" 
                          data={[
                            { name: 'PayPal', value: 60, fill: '#F59E0B' },
                            { name: 'Stripe', value: 40, fill: '#3B82F6' }
                          ]}
                        >
                          <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }} 
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Revenue Projections</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Next Month:</span>
                        <span className="text-white font-medium">{formatCurrency(analyticsData.totalRevenue * 1.15)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Next Quarter:</span>
                        <span className="text-white font-medium">{formatCurrency(analyticsData.totalRevenue * 3.8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Annual Run Rate:</span>
                        <span className="text-green-400 font-medium">{formatCurrency(analyticsData.totalRevenue * 15.2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart with Multiple Metrics */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Detailed Revenue Analysis</h3>
                  <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          name="Revenue"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="subscriptions" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Subscriptions"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="oneTime" 
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          name="One-time"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeView !== 'overview' && activeView !== 'revenue' && (
              <div className="text-center py-12">
                <ChartBarIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">{viewTabs.find(t => t.id === activeView)?.name}</h3>
                <p className="text-slate-400 mb-6">Advanced analytics view coming soon</p>
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                  Request Feature
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportReport('pdf')}
            className="glass-card p-6 text-center hover:shadow-lg transition-all"
          >
            <DocumentArrowDownIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Generate Report</h3>
            <p className="text-slate-400 text-sm">Create comprehensive analytics report</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 text-center hover:shadow-lg transition-all"
          >
            <EyeIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Live Monitoring</h3>
            <p className="text-slate-400 text-sm">Real-time revenue and user tracking</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 text-center hover:shadow-lg transition-all"
          >
            <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Forecast Model</h3>
            <p className="text-slate-400 text-sm">AI-powered revenue predictions</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;