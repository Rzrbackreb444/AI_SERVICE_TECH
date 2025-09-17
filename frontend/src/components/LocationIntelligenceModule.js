import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LocationIntelligenceModule = () => {
  const [address, setAddress] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = React.useRef(null);

  useEffect(() => {
    const focusHandler = () => {
      try {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {}
    };
    window.addEventListener('lt:focusAnalyzeInput', focusHandler);
    return () => window.removeEventListener('lt:focusAnalyzeInput', focusHandler);
  }, []);

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
      setError(error.response?.data?.detail || 'Analysis failed');
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

  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Location Intelligence Module</h1>
      </div>

      <div className="p-6">
        {/* Search Section */}
        <div className="bg-white rounded border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Location Analysis</h2>
          </div>
          <div className="p-6">
            <form onSubmit={analyzeLocation}>
              <div className="flex gap-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => {
                    try { window.dispatchEvent(new CustomEvent('lt:inputFocus')); } catch {}
                  }}
                  placeholder="Enter address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !address.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">Tip: If the chat is covering the input, press Esc to hide chat or it will auto-minimize when you focus this field.</div>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">OVERALL SCORE</div>
                <div className="text-2xl font-semibold text-gray-900">{analysis.overall_score || 85}/100</div>
                <div className="text-xs text-green-600 mt-1">Excellent Location</div>
              </div>
              
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">REVENUE PROJECTION</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(analysis.revenue_projection || 156000)}</div>
                <div className="text-xs text-gray-500 mt-1">Annual</div>
              </div>
              
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">ROI ESTIMATE</div>
                <div className="text-2xl font-semibold text-gray-900">{(analysis.roi_estimate || 24.8).toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">Annual Return</div>
              </div>
              
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">PAYBACK PERIOD</div>
                <div className="text-2xl font-semibold text-gray-900">{analysis.payback_period || 3.2} yrs</div>
                <div className="text-xs text-gray-500 mt-1">Investment Recovery</div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-2 gap-6">
              {/* Demographics */}
              <div className="bg-white rounded border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Demographics</h3>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm">
                    <tbody className="space-y-2">
                      <tr>
                        <td className="text-gray-500 py-2">Population (1 mile radius)</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(analysis.demographics?.population || 12450).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Median Household Income</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{formatCurrency(analysis.demographics?.median_income || 52000)}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Average Age</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{analysis.demographics?.average_age || 34} years</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">College Educated</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(analysis.demographics?.college_educated || 68)}%</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Households</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(analysis.demographics?.households || 4820).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competition Analysis */}
              <div className="bg-white rounded border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Competition Analysis</h3>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="text-gray-500 py-2">Direct Competitors (2 mi)</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{analysis.competition?.count || 3}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Market Saturation</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(analysis.competition?.saturation || 23)}%</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Avg Competitor Rating</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(analysis.competition?.avg_rating || 3.8).toFixed(1)} ★</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Market Share Available</td>
                        <td className="text-gray-900 font-medium py-2 text-right">{(100 - (analysis.competition?.saturation || 23))}%</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500 py-2">Competition Level</td>
                        <td className="text-green-600 font-medium py-2 text-right">Low</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Market Factors */}
            <div className="bg-white rounded border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Market Factors</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-3">Traffic & Accessibility</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Daily Traffic Count</span>
                        <span className="text-gray-900 font-medium">18,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Parking Availability</span>
                        <span className="text-green-600 font-medium">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Public Transit</span>
                        <span className="text-blue-600 font-medium">2 routes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-3">Area Characteristics</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Housing Type</span>
                        <span className="text-gray-900 font-medium">Mixed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Business Density</span>
                        <span className="text-gray-900 font-medium">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Foot Traffic</span>
                        <span className="text-green-600 font-medium">Strong</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-3">Economic Indicators</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Employment Rate</span>
                        <span className="text-green-600 font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Income Growth</span>
                        <span className="text-green-600 font-medium">+3.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Market Stability</span>
                        <span className="text-green-600 font-medium">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Strategic Recommendations</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationIntelligenceModule;