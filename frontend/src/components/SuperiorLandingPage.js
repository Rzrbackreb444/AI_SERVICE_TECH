import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SuperiorLandingPage = () => {
  const [metrics, setMetrics] = useState({
    totalAnalyses: 247,
    totalRevenue: 1850000,
    avgROI: 28.4,
    activeLocations: 12
  });

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">LaundroTech Business Intelligence Platform</h1>
            <p className="text-sm text-gray-500">Enterprise Dashboard</p>
          </div>
          <div className="text-sm text-gray-500">
            Status: LIVE ENTERPRISE SYSTEM | Last updated: {new Date().toLocaleDateString('en-US', { 
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
      </div>
    </div>
  );
};

export default SuperiorLandingPage;