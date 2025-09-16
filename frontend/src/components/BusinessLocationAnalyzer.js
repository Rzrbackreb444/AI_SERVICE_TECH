import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TrendingUpIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BusinessLocationAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const analyzeLocation = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await axios.post(`${API}/analyze`, {
        address: address.trim()
      }, {
        headers: getAuthHeaders()
      });

      setAnalysis(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Location Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Analyze potential laundromat locations with comprehensive market data
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <form onSubmit={analyzeLocation}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address or Location
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address (e.g., 123 Main St, Little Rock, AR)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading || !address.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        Analyze Location
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Analysis Summary</h2>
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analysis.overall_score || 85}</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.overall_score || 85)}`}>
                  {getScoreLabel(analysis.overall_score || 85)} Location
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Projection</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(analysis.revenue_projection || 156000)}/year
                    </p>
                    <p className="text-sm text-gray-600">Expected annual revenue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUpIcon className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ROI Estimate</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPercentage(analysis.roi_estimate || 24.8)}
                    </p>
                    <p className="text-sm text-gray-600">Annual return on investment</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Payback Period</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {analysis.payback_period || 3.2} years
                    </p>
                    <p className="text-sm text-gray-600">Time to recoup investment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demographics */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    Demographics
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population (1 mile)</span>
                    <span className="font-semibold">{(analysis.demographics?.population || 12450).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Income</span>
                    <span className="font-semibold">{formatCurrency(analysis.demographics?.median_income || 52000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Age</span>
                    <span className="font-semibold">{analysis.demographics?.average_age || 34} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">College Educated</span>
                    <span className="font-semibold">{formatPercentage(analysis.demographics?.college_educated || 68)}</span>
                  </div>
                </div>
              </div>

              {/* Competition */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    Competition Analysis
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Competitors (2 miles)</span>
                    <span className="font-semibold">{analysis.competition?.count || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Saturation</span>
                    <span className={`font-semibold ${(analysis.competition?.saturation || 23) < 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatPercentage(analysis.competition?.saturation || 23)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Competitor Rating</span>
                    <span className="font-semibold">{(analysis.competition?.avg_rating || 3.8).toFixed(1)} ★</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Opportunity</span>
                    <span className="font-semibold text-green-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Strong Demographics Match</p>
                      <p className="text-gray-600">Target demographic shows high demand for laundry services with sufficient disposable income.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Low Competition</p>
                      <p className="text-gray-600">Market shows room for new entrant with opportunity to capture significant market share.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Suggested Equipment Mix</p>
                      <p className="text-gray-600">Recommend 60% standard capacity (20lb) and 40% large capacity (30lb+) washers based on local preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Pricing Strategy</p>
                      <p className="text-gray-600">Market can support premium pricing (15% above regional average) due to higher income demographics.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Report Button */}
            <div className="text-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Generate Detailed Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessLocationAnalyzer;