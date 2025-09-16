import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const PremiumLocationReport = ({ analysisData, address }) => {
  const [loading, setLoading] = useState(false);

  // Enhanced grade display with colors
  const getGradeColor = (grade) => {
    const gradeMap = {
      'A+': 'from-emerald-400 to-green-500',
      'A': 'from-emerald-400 to-green-400',
      'A-': 'from-green-400 to-emerald-400',
      'B+': 'from-blue-400 to-cyan-400',
      'B': 'from-blue-400 to-blue-500',
      'B-': 'from-cyan-400 to-blue-400',
      'C+': 'from-yellow-400 to-orange-400',
      'C': 'from-orange-400 to-yellow-400',
      'C-': 'from-red-400 to-orange-400',
      'D': 'from-red-500 to-red-400',
      'F': 'from-red-600 to-red-500'
    };
    return gradeMap[grade] || 'from-gray-400 to-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Premium Location Intelligence Report
              </motion.h1>
              <div className="flex items-center space-x-2 text-slate-400">
                <MapPinIcon className="w-5 h-5" />
                <span className="text-lg">{address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide">Generated</div>
              <div className="text-sm text-slate-400">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overall Grade Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8"
        >
          <div className="text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getGradeColor(analysisData.overall_grade)} shadow-2xl`}>
                <span className="text-4xl font-black text-white">{analysisData.overall_grade}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Investment Grade Analysis</h2>
            <p className="text-xl text-slate-300">Overall Location Score: {analysisData.grade_score}/100</p>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">ANNUAL</div>
                <div className="text-emerald-400 text-sm font-semibold">REVENUE</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(analysisData.revenue_potential?.annual_revenue || 0)}
            </div>
            <div className="text-sm text-slate-400">Projected Revenue</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">MONTHLY</div>
                <div className="text-blue-400 text-sm font-semibold">PROFIT</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(analysisData.revenue_potential?.monthly_profit || 0)}
            </div>
            <div className="text-sm text-slate-400">Net Operating Income</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">MARKET</div>
                <div className="text-purple-400 text-sm font-semibold">POPULATION</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {(analysisData.demographics?.population || 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Within 3 Miles</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">MEDIAN</div>
                <div className="text-yellow-400 text-sm font-semibold">INCOME</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(analysisData.demographics?.median_income || 0)}
            </div>
            <div className="text-sm text-slate-400">Household Income</div>
          </motion.div>
        </div>

        {/* Competition Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Competition Analysis</h3>
              <p className="text-slate-400">Competitive landscape within 5-mile radius</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysisData.competitors?.map((competitor, index) => (
              <div key={index} className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{competitor.name}</h4>
                  <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                    {competitor.distance.toFixed(1)} mi
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  Distance: {competitor.distance.toFixed(1)} miles
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk & Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Factors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Risk Factors</h3>
                <p className="text-slate-400">Areas requiring attention</p>
              </div>
            </div>

            <div className="space-y-4">
              {analysisData.risk_factors?.map((risk, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-slate-300">{risk}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                <LightBulbIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Opportunities</h3>
                <p className="text-slate-400">Growth potential areas</p>
              </div>
            </div>

            <div className="space-y-4">
              {analysisData.opportunities?.map((opportunity, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-slate-300">{opportunity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Move Forward?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            This comprehensive analysis provides the foundation for your investment decision. 
            Need equipment quotes, financing options, or additional due diligence?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/25">
              Get Equipment Quote
            </button>
            <button className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-slate-600 hover:to-slate-500 transition-all duration-200 shadow-lg shadow-slate-700/25">
              Schedule Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumLocationReport;