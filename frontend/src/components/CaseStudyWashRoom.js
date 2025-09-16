import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
// TrendingUpIcon doesn't exist - using ArrowTrendingUpIcon instead
import { ArrowTrendingUpIcon as TrendingUpIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const CaseStudyWashRoom = () => {
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
            The Wash Room Multi-Location Analysis
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Location intelligence analysis of successful expansion across Phoenix Ave and Kelly Highway in Fort Smith, Arkansas
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <span className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Fort Smith, Arkansas
            </span>
            <span className="flex items-center gap-2">
              <BuildingOffice2Icon className="w-5 h-5" />
              Multi-Location Strategy
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
            src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png"
            alt="The Wash Room - Fort Smith, AR"
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
            Multi-Location Expansion Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-emerald-400 mb-2">THRIVING</div>
              <div className="text-slate-400">Phoenix Ave Location</div>
            </div>
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-cyan-400 mb-2">HIGH DEMAND</div>
              <div className="text-slate-400">Kelly Highway Location</div>
            </div>
            <div className="text-center p-6 bg-slate-800/40 rounded-2xl">
              <div className="text-3xl font-black text-amber-400 mb-2">A+</div>
              <div className="text-slate-400">Market Dominance</div>
            </div>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">
            The Wash Room's aggressive expansion strategy across Fort Smith demonstrates masterful market positioning. 
            LaundroTech Intelligence validated both the Phoenix Ave flagship location and the strategic Kelly Highway expansion, 
            identifying market gaps and competitive advantages that enabled rapid multi-location growth in the Arkansas market.
          </p>
        </motion.div>

        {/* Phoenix Ave Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Phoenix Ave Flagship Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Market Advantages</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">High-traffic commercial corridor positioning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Premium equipment and facility standards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Strong demographic alignment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Limited direct competition</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/40 rounded-xl">
                    <div className="text-emerald-400 font-semibold">Revenue Growth</div>
                    <div className="text-slate-300 text-sm">Rapid expansion proven</div>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl">
                    <div className="text-cyan-400 font-semibold">Market Share</div>
                    <div className="text-slate-300 text-sm">Dominant position achieved</div>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl">
                    <div className="text-amber-400 font-semibold">Customer Base</div>
                    <div className="text-slate-300 text-sm">Strong loyalty and retention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kelly Highway Expansion */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Kelly Highway Strategic Expansion</h3>
            
            <p className="text-slate-300 mb-6">
              The Kelly Highway location represents strategic market expansion, targeting underserved demographics 
              while maintaining The Wash Room brand standards:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Market Gap Analysis</h5>
                  <p className="text-slate-400 text-sm">Identified underserved population segment with strong demographics</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Competitive Positioning</h5>
                  <p className="text-slate-400 text-sm">Strategic advantage over existing competitors through superior service model</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Brand Extension</h5>
                  <p className="text-slate-400 text-sm">Successful expansion of proven business model to new trade area</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <h5 className="text-white font-semibold mb-2">Operational Synergies</h5>
                  <p className="text-slate-400 text-sm">Multi-location efficiencies in management and procurement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Intelligence */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Fort Smith Market Intelligence</h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <h4 className="text-emerald-400 font-semibold mb-2">Market Dominance Strategy</h4>
                <p className="text-slate-300">
                  The Wash Room's dual-location approach creates market barriers to entry while maximizing 
                  coverage across Fort Smith's primary demographic segments.
                </p>
              </div>
              
              <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                <h4 className="text-cyan-400 font-semibold mb-2">Competitive Advantage</h4>
                <p className="text-slate-300">
                  Premium service positioning combined with strategic location selection creates sustainable 
                  competitive moats in both trade areas.
                </p>
              </div>
              
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <h4 className="text-amber-400 font-semibold mb-2">Growth Trajectory</h4>
                <p className="text-slate-300">
                  Multi-location success validates expansion model for potential replication in similar 
                  Arkansas markets and regional growth opportunities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Success Factors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mt-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Multi-Location Success Factors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Strategic Execution</h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Demographic-driven location selection</li>
                <li>• Consistent brand and service standards</li>
                <li>• Market timing optimization</li>
                <li>• Operational efficiency focus</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Market Intelligence</h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Comprehensive competitor analysis</li>
                <li>• Traffic pattern optimization</li>
                <li>• Demographic trend alignment</li>
                <li>• Growth trajectory validation</li>
              </ul>
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
              Plan Your Multi-Location Strategy
            </h3>
            <p className="text-slate-300 mb-6">
              Get the same market intelligence that guided The Wash Room's successful expansion across Fort Smith.
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

export default CaseStudyWashRoom;