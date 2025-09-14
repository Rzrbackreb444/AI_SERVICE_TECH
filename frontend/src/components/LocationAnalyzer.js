import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LocationAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [analysisType, setAnalysisType] = useState('scout');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analysisTypes = [
    { 
      value: 'scout', 
      label: 'Location Scout (Free)', 
      price: 'Free',
      description: 'Basic location grade and demographics',
      features: ['Basic grade (A-F)', 'Population data', 'Competitor count']
    },
    { 
      value: 'basic', 
      label: 'Location Analyzer', 
      price: '$99',
      description: 'Complete analysis with competitor mapping',
      features: ['Grade breakdown', 'ROI estimates', 'Market timing', 'Equipment recommendations']
    },
    { 
      value: 'intelligence', 
      label: 'Location Intelligence', 
      price: '$249',
      description: 'Full competitive intelligence',
      features: ['SWOT analysis', 'Marketing strategies', 'Risk mitigation', 'Financing options']
    },
    { 
      value: 'optimization', 
      label: 'LaundroMax Optimization', 
      price: '$499',
      description: 'Advanced optimization and hybrid analysis',
      features: ['Business valuation', 'Hybrid opportunities', 'Revenue optimization', 'Implementation plan']
    },
    { 
      value: 'portfolio', 
      label: 'LaundroEmpire Portfolio', 
      price: '$999',
      description: 'Enterprise portfolio management',
      features: ['Multi-location analysis', 'Franchise planning', 'Market expansion', 'Exit strategies']
    }
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API}/analyze`, {
        address: address.trim(),
        analysis_type: analysisType,
        additional_data: {}
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const letter = grade.charAt(0);
    switch (letter) {
      case 'A': return 'grade-A';
      case 'B': return 'grade-B';
      case 'C': return 'grade-C';
      case 'D': return 'grade-D';
      case 'F': return 'grade-F';
      default: return 'grade-C';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Location <span className="gradient-text">Intelligence</span> Analyzer
          </h1>
          <p className="text-xl text-slate-300">
            Get instant AI-powered insights on any laundromat location
          </p>
        </motion.div>

        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <form onSubmit={handleAnalyze}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Address Input */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPinIcon className="w-4 h-4 inline mr-2" />
                  Location Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Enter street address, city, state"
                    required
                  />
                  <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Analysis Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <ChartBarIcon className="w-4 h-4 inline mr-2" />
                  Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="select-field"
                >
                  {analysisTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analysis Type Details */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              {(() => {
                const selectedType = analysisTypes.find(t => t.value === analysisType);
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedType?.label} - <span className="gradient-text">{selectedType?.price}</span>
                    </h3>
                    <p className="text-slate-300 mb-3">{selectedType?.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedType?.features.map((feature, index) => (
                        <div key={index} className="text-sm text-slate-400">
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-accent w-full md:w-auto px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-3"></div>
                    Analyzing Location...
                  </div>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
                    Analyze Location
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert-error mt-6"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Analysis Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Overall Grade */}
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Location Analysis Results</h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className={`grade-badge ${getGradeColor(result.grade)} w-24 h-24 text-4xl`}>
                  {result.grade}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white">{result.address}</h3>
                  <p className="text-xl text-slate-300 mt-1">Score: {result.score.toFixed(1)}/100</p>
                  <p className="text-slate-400 capitalize mt-1">{result.analysis_type} Analysis</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Demographics */}
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <BuildingOfficeIcon className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Demographics</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population:</span>
                    <span className="text-white font-medium">
                      {result.demographics.population?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Median Income:</span>
                    <span className="text-white font-medium">
                      ${result.demographics.median_income?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Renter Housing:</span>
                    <span className="text-white font-medium">
                      {result.demographics.renter_occupied_housing?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition */}
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Competition</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Competitors:</span>
                    <span className="text-white font-medium">{result.competitors.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Rating:</span>
                    <span className="text-white font-medium">
                      {result.competitors.length > 0 
                        ? (result.competitors.reduce((acc, comp) => acc + (comp.rating || 0), 0) / result.competitors.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Density:</span>
                    <span className="text-white font-medium">
                      {result.competitors.length < 3 ? 'Low' : result.competitors.length < 6 ? 'Medium' : 'High'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ROI Estimates */}
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">ROI Estimate</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Analysis:</span>
                    <span className="text-white font-medium">
                      ${result.roi_estimate.estimated_monthly_revenue?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  {result.roi_estimate.break_even_months && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Break-even:</span>
                      <span className="text-white font-medium">
                        {result.roi_estimate.break_even_months} months
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-white font-medium">
                      {result.roi_estimate.confidence_level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <LightBulbIcon className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hybrid Opportunities */}
            {result.hybrid_opportunities && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <span className="gradient-text">Hybrid Business Opportunities</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(result.hybrid_opportunities).map(([type, data]) => (
                    <div key={type} className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-semibold text-white capitalize mb-2">
                        {type.replace('_', ' ')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Viability:</span>
                          <span className={`font-medium ${
                            data.viability === 'High' ? 'text-emerald-400' : 
                            data.viability === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {data.viability}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Add'l Revenue:</span>
                          <span className="text-white font-medium">
                            ${data.estimated_additional_revenue?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Synergy Score:</span>
                          <span className="text-cyan-400 font-medium">
                            {data.synergy_score}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Details */}
            {result.competitors && result.competitors.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Nearby Competitors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.competitors.slice(0, 6).map((competitor, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-semibold text-white truncate mb-2">
                        {competitor.name || 'Unknown Laundromat'}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rating:</span>
                          <span className="text-white">
                            {competitor.rating ? `${competitor.rating}/5` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Reviews:</span>
                          <span className="text-white">
                            {competitor.user_ratings_total || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className={`${
                            competitor.business_status === 'OPERATIONAL' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {competitor.business_status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationAnalyzer;