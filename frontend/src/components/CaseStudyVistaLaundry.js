import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { TrendingUpIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const CaseStudyVistaLaundry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link 
          to="/analyze" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Location Intelligence
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Vista Laundry Strategic Exit Analysis
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            How LaundroTech Intelligence validated David King's strategic sale decision in Van Buren, Arkansas
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <span className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Van Buren, Arkansas
            </span>
            <span className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              Strategic Exit
            </span>
          </div>
        </motion.div>

        {/* Case Study Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <img 
            src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/fj8inoji_IMG_4674.jpeg"
            alt="Vista Laundry - Van Buren, AR"
            className="w-full h-96 object-cover rounded-3xl shadow-2xl"
          />
        </motion.div>

        {/* Executive Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-cyan-400" />
            Executive Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-emerald-400 mb-2">SUCCESS</div>
              <div className="text-slate-400">Exit Strategy</div>
            </div>
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-cyan-400 mb-2">A+</div>
              <div className="text-slate-400">Location Grade</div>
            </div>
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-amber-400 mb-2">STRATEGIC</div>
              <div className="text-slate-400">Timing Analysis</div>
            </div>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">
            David King made a strategic decision to sell Vista Laundry in Van Buren, Arkansas at the optimal market timing. 
            LaundroTech Intelligence validated his exit strategy, confirming the location's strong fundamentals and market position. 
            The new owners subsequently used our analysis to guide their complete rebuild, investing in modern Speed Queen equipment 
            and optimizing the layout for Highway 59 traffic patterns.
          </p>
        </motion.div>

        {/* Analysis Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {/* Location Intelligence */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Location Intelligence Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Strategic Advantages</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Highway 59 high-traffic corridor positioning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Log Town Road intersection visibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Strong demographic fundamentals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Limited direct competition in trade area</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Market Timing</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <TrendingUpIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Peak market valuation period</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUpIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Strong buyer interest in Arkansas markets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUpIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Equipment replacement cycle opportunity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUpIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Regional expansion trends favorable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* New Owner Analysis */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">New Owner Rebuild Strategy</h3>
            
            <p className="text-slate-300 mb-6">
              The new owners utilized LaundroTech Intelligence to optimize their complete rebuild strategy:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Equipment Investment</h5>
                  <p className="text-slate-400 text-sm">Complete Speed Queen installation optimized for traffic patterns and customer flow</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Layout Optimization</h5>
                  <p className="text-slate-400 text-sm">Redesigned for Highway 59 visibility and improved customer experience</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Market Positioning</h5>
                  <p className="text-slate-400 text-sm">Premium service model targeting growing Van Buren demographics</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Operational Efficiency</h5>
                  <p className="text-slate-400 text-sm">Modern systems designed for reduced operating costs and improved margins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Key Strategic Insights</h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <h4 className="text-emerald-400 font-semibold mb-2">Exit Strategy Validation</h4>
                <p className="text-slate-300">
                  David King's timing was optimal - market conditions, buyer interest, and location fundamentals 
                  all aligned for maximum value realization.
                </p>
              </div>
              
              <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                <h4 className="text-cyan-400 font-semibold mb-2">Location Continuity</h4>
                <p className="text-slate-300">
                  The Highway 59 location continues to demonstrate strong performance under new ownership, 
                  validating the original location intelligence analysis.
                </p>
              </div>
              
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <h4 className="text-amber-400 font-semibold mb-2">Investment Optimization</h4>
                <p className="text-slate-300">
                  New owners leveraged our analysis to optimize their rebuild investment, focusing on high-impact 
                  improvements that maximize ROI potential.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready for Your Strategic Analysis?
            </h3>
            <p className="text-slate-300 mb-6">
              Get the same level of intelligence that guided David's successful exit and the new owners' strategic rebuild.
            </p>
            <Link 
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all transform hover:scale-105"
            >
              Start Your Analysis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudyVistaLaundry;