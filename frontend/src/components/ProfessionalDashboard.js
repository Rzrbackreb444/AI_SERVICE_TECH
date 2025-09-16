import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfessionalDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [marketData, setMarketData] = useState({
    totalAnalyses: 0,
    avgROI: 0,
    bestLocation: null,
    marketTrend: 'stable'
  });

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

      // Load recent analyses
      try {
        const analysesResponse = await axios.get(`${API}/user/analyses`, {
          headers: getAuthHeaders()
        });
        setRecentAnalyses(analysesResponse.data.slice(0, 5));
      } catch (error) {
        console.log('No analyses found');
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Analyze New Location',
      description: 'Get detailed market analysis for a potential site',
      icon: MapPinIcon,
      href: '/analyze',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    {
      title: 'View Market Intelligence',
      description: 'Real-time market data and competitor insights',
      icon: ChartBarIcon,
      href: '/market-intelligence',
      color: 'bg-green-50 text-green-700 hover:bg-green-100'
    },
    {
      title: 'Competitive Analysis',
      description: 'Track competitors and market opportunities',
      icon: TrendingUpIcon,
      href: '/competitive-intelligence',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
    },
    {
      title: 'AI Agent Consultation',
      description: 'Get expert advice from our AI consultant',
      icon: UsersIcon,
      href: '/ai-agent',
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100'
    }
  ];

  const businessMetrics = [
    {
      title: 'Total Analyses',
      value: recentAnalyses.length,
      change: '+12%',
      changeType: 'positive',
      icon: DocumentTextIcon
    },
    {
      title: 'Average ROI Projection',
      value: '24.8%',
      change: '+2.3%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Market Opportunities',
      value: '8',
      change: 'New',
      changeType: 'neutral',
      icon: MapPinIcon
    },
    {
      title: 'Analysis Success Rate',
      value: '94%',
      change: '+1.2%',
      changeType: 'positive',
      icon: CheckCircleIcon
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name || 'User'}
          </h1>
          <p className="text-gray-600">
            Here's your laundromat intelligence overview for today
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 
                      metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className={`${action.color} rounded-lg p-4 transition-colors`}
              >
                <div className="flex items-center">
                  <action.icon className="h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm opacity-75">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Analyses</h2>
            </div>
            <div className="p-6">
              {recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {analysis.address || `Analysis #${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No analyses yet</p>
                  <Link
                    to="/analyze"
                    className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500"
                  >
                    Start your first analysis
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Market Insights</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Market Conditions Favorable</p>
                    <p className="text-sm text-gray-600">Current market shows strong demand with low competition in target areas.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUpIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Growth Opportunities</p>
                    <p className="text-sm text-gray-600">8 new high-potential locations identified this week.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Competition Alert</p>
                    <p className="text-sm text-gray-600">New competitor opened in Northwest region - monitor pricing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;