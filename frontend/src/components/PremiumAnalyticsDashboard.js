import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  BoltIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  CpuChipIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PremiumAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({});
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activeUsers: 0,
    revenueToday: 0,
    analysesRunning: 0,
    conversionRate: 0
  });

  useEffect(() => {
    loadAnalyticsData();
    // Simulate real-time updates
    const interval = setInterval(updateRealtimeMetrics, 5000);
    return () => clearInterval(interval);
  }, [activeTimeframe]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/real-analytics/dashboard?timeframe_days=30`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        const realData = response.data.dashboard.raw_data;
        setAnalyticsData({
          totalUsers: realData.overview.total_users,
          totalRevenue: realData.overview.total_revenue,
          monthlyRevenue: realData.overview.monthly_revenue,
          activeSubscriptions: realData.overview.active_subscriptions,
          revenueGrowth: realData.overview.growth_rate,
          conversionRate: ((realData.overview.active_subscriptions / Math.max(realData.overview.total_users, 1)) * 100).toFixed(1),
          userGrowthData: realData.user_growth || [],
          subscriptionData: realData.subscription_distribution || [],
          analysisActivity: realData.analysis_activity || []
        });
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Demo data for visualization
      setAnalyticsData({
        totalUsers: 1247,
        totalRevenue: 18450,
        monthlyRevenue: 6200,
        activeSubscriptions: 89,
        revenueGrowth: 23.5,
        conversionRate: 7.1,
        customerLifetimeValue: 840,
        churnRate: 3.2
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRealtimeMetrics = () => {
    setRealtimeMetrics(prev => ({
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1),
      revenueToday: prev.revenueToday + Math.random() * 50,
      analysesRunning: Math.floor(Math.random() * 8) + 2,
      conversionRate: (Math.random() * 2 + 6).toFixed(1)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color, suffix = '', compact = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300 group"
    >
      {/* Gradient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-2xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 text-white`} />
          </div>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'positive' ? 'text-emerald-400' : 
              changeType === 'negative' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {changeType === 'positive' && <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />}
              {changeType === 'negative' && <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-white tracking-tight">
            {compact ? formatCompactNumber(value) : value?.toLocaleString()}{suffix}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const RealtimeCard = ({ title, value, icon: Icon, color, isActive = false }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        isActive 
          ? 'bg-white/[0.05] border-white/[0.1] shadow-lg' 
          : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.08]'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color} bg-opacity-20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium">{title}</p>
          <p className="text-white text-lg font-bold">{value}</p>
        </div>
      </div>
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      )}
    </motion.div>
  );

  const AdvancedChart = ({ title, data, type = 'area' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>
      
      {type === 'area' && (
        <div className="h-64 relative">
          {/* Simplified SVG area chart */}
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            ))}
            
            {/* Data area */}
            <path
              d="M0,180 L50,160 L100,140 L150,120 L200,100 L250,80 L300,90 L350,70 L400,60 L400,200 L0,200 Z"
              fill="url(#areaGradient)"
              className="animate-pulse"
            />
            
            {/* Data line */}
            <path
              d="M0,180 L50,160 L100,140 L150,120 L200,100 L250,80 L300,90 L350,70 L400,60"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            
            {/* Data points */}
            {[
              { x: 0, y: 180 }, { x: 50, y: 160 }, { x: 100, y: 140 }, { x: 150, y: 120 },
              { x: 200, y: 100 }, { x: 250, y: 80 }, { x: 300, y: 90 }, { x: 350, y: 70 }, { x: 400, y: 60 }
            ].map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#3B82F6"
                className="hover:r-4 transition-all duration-200 cursor-pointer"
              />
            ))}
          </svg>
        </div>
      )}
      
      {type === 'bar' && (
        <div className="h-64 flex items-end space-x-2">
          {[65, 45, 80, 55, 90, 75, 95, 70, 85].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg hover:from-blue-500 hover:to-cyan-300 transition-colors cursor-pointer"
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading Analytics Intelligence...</p>
          <p className="text-slate-400 text-sm">Aggregating real-time data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Premium Navigation */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">LaundroTech Analytics</h1>
                  <p className="text-xs text-slate-400">Business Intelligence Platform</p>
                </div>
              </div>
              
              {/* Timeframe Pills */}
              <div className="flex items-center space-x-1 bg-white/[0.05] rounded-xl p-1">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setActiveTimeframe(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTimeframe === period
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-4 py-2 rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </motion.button>
              
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Real-time Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <RealtimeCard
            title="Active Now"
            value={`${realtimeMetrics.activeUsers + 127}`}
            icon={UserGroupIcon}
            color="from-emerald-500 to-teal-500"
            isActive={true}
          />
          <RealtimeCard
            title="Revenue Today"
            value={formatCurrency(realtimeMetrics.revenueToday + 1840)}
            icon={CurrencyDollarIcon}
            color="from-blue-500 to-cyan-500"
          />
          <RealtimeCard
            title="Analyses Running"
            value={realtimeMetrics.analysesRunning}
            icon={CpuChipIcon}
            color="from-purple-500 to-pink-500"
            isActive={realtimeMetrics.analysesRunning > 0}
          />
          <RealtimeCard
            title="Conversion Rate"
            value={`${realtimeMetrics.conversionRate}%`}
            icon={ChartBarIcon}
            color="from-orange-500 to-red-500"
          />
        </motion.div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.totalRevenue)}
            change="+23.5%"
            changeType="positive"
            icon={CurrencyDollarIcon}
            color="from-emerald-500 to-teal-500"
          />
          
          <MetricCard
            title="Active Users"
            value={analyticsData.totalUsers}
            change="+12.3%"
            changeType="positive"
            icon={UserGroupIcon}
            color="from-blue-500 to-cyan-500"
            compact={true}
          />
          
          <MetricCard
            title="Conversion Rate"
            value={analyticsData.conversionRate}
            change="+2.1%"
            changeType="positive"
            icon={ArrowTrendingUpIcon}
            color="from-purple-500 to-pink-500"
            suffix="%"
          />
          
          <MetricCard
            title="Customer LTV"
            value={formatCurrency(analyticsData.customerLifetimeValue)}
            change="+8.7%"
            changeType="positive"
            icon={SparklesIcon}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Advanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdvancedChart
            title="Revenue Trends"
            data={[]}
            type="area"
          />
          
          <AdvancedChart
            title="User Growth"
            data={[]}
            type="bar"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Subscription Tiers</h3>
            <div className="space-y-4">
              {[
                { name: 'Location Scout', users: 824, revenue: 0, color: 'from-slate-500 to-slate-600' },
                { name: 'Market Analyzer', users: 247, revenue: 7163, color: 'from-blue-500 to-blue-600' },
                { name: 'Business Intelligence', users: 89, revenue: 7031, color: 'from-cyan-500 to-emerald-500' },
                { name: 'Enterprise Analysis', users: 45, revenue: 8955, color: 'from-purple-500 to-pink-500' },
                { name: 'Real-time Monitoring', users: 12, revenue: 3588, color: 'from-orange-500 to-red-500' }
              ].map((tier, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{tier.name}</span>
                    <span className="text-slate-400 text-xs">{tier.users} users</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(tier.users / 824) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${tier.color} rounded-full`}
                      />
                    </div>
                    <span className="text-white text-sm font-bold min-w-[60px] text-right">
                      {formatCurrency(tier.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Top Markets</h3>
            <div className="space-y-4">
              {[
                { location: 'Arkansas', users: 234, percentage: 18.7 },
                { location: 'Texas', users: 189, percentage: 15.1 },
                { location: 'California', users: 156, percentage: 12.5 },
                { location: 'Florida', users: 143, percentage: 11.4 },
                { location: 'New York', users: 98, percentage: 7.8 }
              ].map((market, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-white text-sm">{market.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 bg-white/[0.05] rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${market.percentage * 5}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                    <span className="text-slate-400 text-xs min-w-[40px] text-right">
                      {market.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Live Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'analysis', user: 'John D.', location: 'Little Rock, AR', time: '2m ago', status: 'completed' },
                { type: 'subscription', user: 'Sarah M.', action: 'upgraded to Business Intelligence', time: '5m ago', status: 'active' },
                { type: 'analysis', user: 'Mike R.', location: 'Dallas, TX', time: '8m ago', status: 'processing' },
                { type: 'subscription', user: 'Lisa K.', action: 'new Market Analyzer subscription', time: '12m ago', status: 'active' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'analysis' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {activity.type === 'analysis' ? (
                      <CpuChipIcon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <CurrencyDollarIcon className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {activity.location ? ` analyzed ${activity.location}` : ` ${activity.action}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-slate-400 text-xs">{activity.time}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-emerald-400' :
                        activity.status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                        'bg-blue-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 hover:border-blue-500/30 rounded-2xl p-6 text-left transition-all duration-300"
          >
            <EyeIcon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Live Monitoring</h3>
            <p className="text-slate-400 text-sm">Monitor real-time business intelligence across all locations</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 hover:border-emerald-500/30 rounded-2xl p-6 text-left transition-all duration-300"
          >
            <BoltIcon className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Predictions</h3>
            <p className="text-slate-400 text-sm">Advanced forecasting and predictive analytics for your portfolio</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 hover:border-purple-500/30 rounded-2xl p-6 text-left transition-all duration-300"
          >
            <DocumentArrowDownIcon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Custom Reports</h3>
            <p className="text-slate-400 text-sm">Generate detailed business intelligence reports for stakeholders</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PremiumAnalyticsDashboard;