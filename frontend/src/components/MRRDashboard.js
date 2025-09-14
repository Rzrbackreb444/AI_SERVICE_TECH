import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  BoltIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MRRDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [marketAlerts, setMarketAlerts] = useState([]);
  const [usageData, setUsageData] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [ltvData, setLtvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadMRRDashboard();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadMRRDashboard = async () => {
    try {
      setLoading(true);
      
      // Load all MRR optimization data
      const [performance, alerts, usage, billing, portfolio, ltv] = await Promise.all([
        axios.get(`${API}/dashboard/performance`, { headers: getAuthHeaders() }),
        axios.get(`${API}/alerts/market`, { headers: getAuthHeaders() }),
        axios.get(`${API}/usage/current`, { headers: getAuthHeaders() }),
        axios.get(`${API}/billing/report`, { headers: getAuthHeaders() }),
        axios.get(`${API}/portfolio/dashboard`, { headers: getAuthHeaders() }),
        axios.get(`${API}/analytics/ltv`, { headers: getAuthHeaders() })
      ]);

      setPerformanceData(performance.data);
      setMarketAlerts(alerts.data.alerts || []);
      setUsageData(usage.data);
      setBillingData(billing.data);
      setPortfolioData(portfolio.data);
      setLtvData(ltv.data);

    } catch (error) {
      console.error('Failed to load MRR dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MRR Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💰 MRR Optimization Dashboard
          </h1>
          <p className="text-gray-600">
            Maximize your Monthly Recurring Revenue with advanced analytics and optimization tools
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current MRR</p>
                <p className="text-2xl font-bold text-green-600">
                  ${billingData?.total_billing || 0}/mo
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lifetime Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${ltvData?.estimated_ltv || 0}
                </p>
              </div>
              <TrophyIcon className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usage Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {usageData?.utilization_percent || 0}%
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {marketAlerts.length}
                </p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton
            id="overview"
            label="Overview"
            icon={ChartBarIcon}
            active={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="usage"
            label="Usage & Billing"
            icon={BanknotesIcon}
            active={activeTab === 'usage'}
            onClick={setActiveTab}
          />
          <TabButton
            id="portfolio"
            label="Portfolio"
            icon={BuildingOffice2Icon}
            active={activeTab === 'portfolio'}
            onClick={setActiveTab}
          />
          <TabButton
            id="alerts"
            label="Market Alerts"
            icon={ExclamationTriangleIcon}
            active={activeTab === 'alerts'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 text-blue-600 mr-2" />
                Performance Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Analyses</span>
                  <span className="font-semibold">{performanceData?.total_analyses || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">{performanceData?.average_score || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Engagement Score</span>
                  <span className="font-semibold">{performanceData?.engagement_score || 0}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Status</span>
                  <span className="font-semibold text-green-600">
                    {performanceData?.market_status || 'Active'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="w-5 h-5 text-green-600 mr-2" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Market monitoring active</p>
                    <p className="text-xs text-gray-500">Next update in 3 days</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BoltIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Usage optimization available</p>
                    <p className="text-xs text-gray-500">Upgrade suggested</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Portfolio expansion opportunities</p>
                    <p className="text-xs text-gray-500">2 new markets identified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Current Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Usage</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Calls</span>
                    <span>{usageData?.api_calls_used || 0} / {usageData?.api_calls_limit || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((usageData?.api_calls_used || 0) / (usageData?.api_calls_limit || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analyses</span>
                    <span>{usageData?.analyses_used || 0} / {usageData?.analyses_limit || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((usageData?.analyses_used || 0) / (usageData?.analyses_limit || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {usageData?.upsell_trigger && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    🚀 You're using {usageData.utilization_percent}% of your limit. 
                    Consider upgrading for unlimited access!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Billing Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Subscription</span>
                  <span className="font-semibold">${billingData?.base_subscription || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overage Charges</span>
                  <span className="font-semibold text-orange-600">
                    ${billingData?.overage_charges || 0}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total This Month</span>
                  <span className="text-green-600">${billingData?.total_billing || 0}</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Billing Period: {billingData?.billing_period || 'Current month'}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'portfolio' && portfolioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Management</h3>
            
            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{portfolioData.total_locations}</p>
                <p className="text-sm text-gray-600">Total Locations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {portfolioData.portfolio_stats?.average_score || 0}
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ${(portfolioData.portfolio_stats?.total_investment_estimated || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Investment</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {portfolioData.portfolio_stats?.expansion_opportunities || 0}
                </p>
                <p className="text-sm text-gray-600">Opportunities</p>
              </div>
            </div>

            {/* Location List */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Your Locations</h4>
              {portfolioData.locations?.slice(0, 5).map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{location.address}</p>
                    <p className="text-sm text-gray-600">
                      Grade: {location.grade} | Score: {location.score}
                    </p>
                  </div>
                  <div className="text-right">
                    {location.alerts_count > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {location.alerts_count} alerts
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Alerts</h3>
            
            {marketAlerts.length === 0 ? (
              <div className="text-center py-8">
                <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active market alerts</p>
                <p className="text-sm text-gray-500">We'll notify you of market changes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {marketAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    {alert.action_required && (
                      <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                        Take Action →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default MRRDashboard;