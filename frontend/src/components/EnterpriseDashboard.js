import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnterpriseDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAnalyses: 0,
    totalRevenue: 0,
    avgROI: 0,
    activeLocations: 0
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
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Simulate loading metrics
      setMetrics({
        totalAnalyses: 247,
        totalRevenue: 1850000,
        avgROI: 28.4,
        activeLocations: 12
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">LaundroTech Intelligence</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.full_name || 'User'}</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Total Analyses</div>
            <div className="text-2xl font-semibold text-gray-900">{metrics.totalAnalyses}</div>
            <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Projected Revenue</div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="text-xs text-green-600 mt-1">+8.2% vs last month</div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Average ROI</div>
            <div className="text-2xl font-semibold text-gray-900">{metrics.avgROI}%</div>
            <div className="text-xs text-blue-600 mt-1">Above industry avg</div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Active Locations</div>
            <div className="text-2xl font-semibold text-gray-900">{metrics.activeLocations}</div>
            <div className="text-xs text-gray-500 mt-1">Monitoring</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="col-span-2 bg-white rounded border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Analysis Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">1247 Main Street, Little Rock, AR</div>
                    <div className="text-sm text-gray-500">Location Score: 87/100 • ROI: 24.8%</div>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">3415 University Ave, Conway, AR</div>
                    <div className="text-sm text-gray-500">Location Score: 92/100 • ROI: 31.2%</div>
                  </div>
                  <div className="text-sm text-gray-500">5 hours ago</div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">789 Broadway, North Little Rock, AR</div>
                    <div className="text-sm text-gray-500">Location Score: 71/100 • ROI: 18.4%</div>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">2156 Cantrell Rd, Little Rock, AR</div>
                    <div className="text-sm text-gray-500">Location Score: 95/100 • ROI: 33.7%</div>
                  </div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium text-gray-900">5623 McCain Blvd, North Little Rock, AR</div>
                    <div className="text-sm text-gray-500">Location Score: 83/100 • ROI: 26.1%</div>
                  </div>
                  <div className="text-sm text-gray-500">3 days ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/analyze"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 text-sm font-medium"
              >
                New Location Analysis
              </Link>
              
              <Link
                to="/market-intelligence"
                className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-200 text-sm font-medium"
              >
                Market Intelligence
              </Link>
              
              <Link
                to="/competitive-intelligence"
                className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-200 text-sm font-medium"
              >
                Competitive Analysis
              </Link>
              
              <Link
                to="/predictive-analytics"
                className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-200 text-sm font-medium"
              >
                Predictive Models
              </Link>
            </div>
            
            {/* Market Status */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Market Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Market Conditions</span>
                  <span className="text-green-600 font-medium">Favorable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg. Competition</span>
                  <span className="text-yellow-600 font-medium">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Demand Trend</span>
                  <span className="text-green-600 font-medium">Rising</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts Section */}
        <div className="mt-6 bg-white rounded border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-8">
              {/* Analysis Volume */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Monthly Analysis Volume</div>
                <div className="h-32 bg-gray-50 rounded flex items-end justify-around p-2">
                  {[45, 52, 38, 61, 58, 67, 73, 69, 75, 82, 78, 89].map((height, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 w-4 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">Jan - Dec 2024</div>
              </div>
              
              {/* ROI Distribution */}
              <div>
                <div className="text-sm text-gray-500 mb-2">ROI Distribution</div>
                <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-green-500 border-t-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-900">28.4%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">Average ROI</div>
              </div>
              
              {/* Success Rate */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Analysis Success Rate</div>
                <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-500">Successful Analyses</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">Last 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;