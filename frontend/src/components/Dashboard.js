import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  MapPinIcon, 
  TrophyIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
// Using CSS-based charts instead of recharts to avoid dependency conflicts
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000, locations: 2 },
    { month: 'Feb', revenue: 15500, locations: 3 },
    { month: 'Mar', revenue: 18200, locations: 3 },
    { month: 'Apr', revenue: 22800, locations: 4 },
    { month: 'May', revenue: 28500, locations: 5 },
    { month: 'Jun', revenue: 32100, locations: 6 }
  ];

  const gradeDistribution = [
    { grade: 'A+', count: 3, color: '#10b981' },
    { grade: 'A', count: 5, color: '#059669' },
    { grade: 'B+', count: 4, color: '#3b82f6' },
    { grade: 'B', count: 2, color: '#2563eb' },
    { grade: 'C', count: 1, color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-400">
              Here's what's happening with your laundromat intelligence
            </p>
          </motion.div>
        </div>

        {error && (
          <div className="alert-error mb-8">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Analyses',
              value: stats?.total_analyses || 0,
              icon: ChartBarIcon,
              color: 'from-blue-500 to-cyan-500',
              change: '+12%'
            },
            {
              title: 'Average Grade',
              value: stats?.average_score ? `${stats.average_score}/100` : 'N/A',
              icon: TrophyIcon,
              color: 'from-emerald-500 to-green-500',
              change: '+8%'
            },
            {
              title: 'Active Locations',
              value: '6',
              icon: MapPinIcon,
              color: 'from-purple-500 to-pink-500',
              change: '+2'
            },
            {
              title: 'Analysis Reports',
              value: '$32.1K',
              icon: ArrowTrendingUpIcon,
              color: 'from-orange-500 to-red-500',
              change: '+15%'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-emerald-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="chart-container"
          >
            <h3 className="text-xl font-bold text-white mb-4">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Grade Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="chart-container"
          >
            <h3 className="text-xl font-bold text-white mb-4">Location Grades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="grade" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/analyze" className="block glass-card p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                    Analyze New Location
                  </h3>
                  <p className="text-slate-400 mt-1">Get instant intelligence on any address</p>
                </div>
                <PlusIcon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/history" className="block glass-card p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                    View Analysis History
                  </h3>
                  <p className="text-slate-400 mt-1">Review past location reports</p>
                </div>
                <EyeIcon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/pricing" className="block glass-card p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                    Upgrade Plan
                  </h3>
                  <p className="text-slate-400 mt-1">Unlock advanced intelligence features</p>
                </div>
                <ArrowTrendingUpIcon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        {stats?.recent_analyses && stats.recent_analyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Recent Location Analyses</h3>
            <div className="space-y-4">
              {stats.recent_analyses.map((analysis, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`grade-badge grade-${analysis.grade.charAt(0)} w-10 h-10 text-sm`}>
                      {analysis.grade}
                    </div>
                    <div>
                      <p className="text-white font-medium">{analysis.address}</p>
                      <p className="text-slate-400 text-sm">
                        {analysis.analysis_type} • {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{analysis.score.toFixed(1)}/100</p>
                    <p className="text-slate-400 text-sm">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Current Plan</h3>
              <p className="text-slate-400 capitalize">
                {stats?.subscription_tier || 'free'} tier
              </p>
            </div>
            <Link 
              to="/pricing"
              className="btn-primary"
            >
              View Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;