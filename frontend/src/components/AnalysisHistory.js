import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API}/analyses`);
      setAnalyses(response.data);
    } catch (err) {
      setError('Failed to load analysis history');
      console.error('History error:', err);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnalysisTypeLabel = (type) => {
    const types = {
      'scout': 'Location Scout (Free)',
      'basic': 'Location Analyzer ($99)',
      'intelligence': 'Location Intelligence ($249)',
      'optimization': 'LaundroMax Optimization ($499)',
      'portfolio': 'LaundroEmpire Portfolio ($999)'
    };
    return types[type] || type;
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Analysis <span className="gradient-text">History</span>
          </h1>
          <p className="text-slate-400">
            Review your previous location intelligence reports
          </p>
        </motion.div>

        {error && (
          <div className="alert-error mb-8">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-12 text-center"
          >
            <ChartBarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Analyses Yet</h3>
            <p className="text-slate-400 mb-6">
              Start analyzing locations to build your intelligence history
            </p>
            <a
              href="/analyze"
              className="btn-accent inline-flex items-center"
            >
              <MapPinIcon className="w-5 h-5 mr-2" />
              Analyze Your First Location
            </a>
          </motion.div>
        ) : (
          <>
            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  label: 'Total Analyses',
                  value: analyses.length,
                  icon: ChartBarIcon,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  label: 'Average Score',
                  value: (analyses.reduce((acc, a) => acc + a.score, 0) / analyses.length).toFixed(1),
                  icon: ChartBarIcon,
                  color: 'from-emerald-500 to-green-500'
                },
                {
                  label: 'Best Grade',
                  value: analyses.reduce((best, current) => {
                    const currentGrade = current.grade.charAt(0);
                    const bestGrade = best.charAt(0);
                    return currentGrade < bestGrade ? current.grade : best;
                  }, 'F'),
                  icon: ChartBarIcon,
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  label: 'Premium Analyses',
                  value: analyses.filter(a => !['scout'].includes(a.analysis_type)).length,
                  icon: ChartBarIcon,
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Analyses List */}
            <div className="space-y-4">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Grade Badge */}
                      <div className={`grade-badge ${getGradeColor(analysis.grade)} w-12 h-12 text-lg`}>
                        {analysis.grade}
                      </div>

                      {/* Analysis Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {analysis.address}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <div className="flex items-center">
                            <ChartBarIcon className="w-4 h-4 mr-1" />
                            {getAnalysisTypeLabel(analysis.analysis_type)}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDate(analysis.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score and Actions */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {analysis.score.toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-400">Score</div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAnalysis(selectedAnalysis === analysis.id ? null : analysis.id)}
                          className="btn-secondary px-3 py-2 text-sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-secondary px-3 py-2 text-sm">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAnalysis === analysis.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-slate-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Demographics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">DEMOGRAPHICS</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Population:</span>
                              <span className="text-white">
                                {analysis.demographics.population?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Median Income:</span>
                              <span className="text-white">
                                ${analysis.demographics.median_income?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Renter Housing:</span>
                              <span className="text-white">
                                {analysis.demographics.renter_occupied_housing?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Competition */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">COMPETITION</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Competitors:</span>
                              <span className="text-white">{analysis.competitors.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Avg Rating:</span>
                              <span className="text-white">
                                {analysis.competitors.length > 0 
                                  ? (analysis.competitors.reduce((acc, comp) => acc + (comp.rating || 0), 0) / analysis.competitors.length).toFixed(1)
                                  : 'N/A'
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Market Density:</span>
                              <span className="text-white">
                                {analysis.competitors.length < 3 ? 'Low' : analysis.competitors.length < 6 ? 'Medium' : 'High'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ROI */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">ROI ESTIMATE</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Market Score:</span>
                              <span className="text-white">
                                ${analysis.roi_estimate.estimated_monthly_revenue?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            {analysis.roi_estimate.break_even_months && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Break-even:</span>
                                <span className="text-white">
                                  {analysis.roi_estimate.break_even_months} months
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-400">Confidence:</span>
                              <span className="text-white">
                                {analysis.roi_estimate.confidence_level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">KEY RECOMMENDATIONS</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.recommendations.slice(0, 4).map((recommendation, recIndex) => (
                              <div key={recIndex} className="p-3 bg-white/5 rounded-lg text-sm text-slate-300">
                                {recommendation}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;