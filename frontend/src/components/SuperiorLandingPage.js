import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  TrophyIcon,
  MapPinIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SuperiorLandingPage = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const [currentProof, setCurrentProof] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Real-time social proof rotation
  const socialProofData = [
    { text: "David K.. just avoided a $180K mistake in Van Buren, AR", time: "2 min ago" },
    { text: "Phoenix investor validated $2.3M acquisition", time: "8 min ago" },
    { text: "Dallas broker closed 3 deals using our intelligence", time: "12 min ago" },
    { text: "Fort Smith expansion approved with 34.2% ROI projection", time: "18 min ago" },
    { text: "Nashville franchise validated 5-location expansion", time: "23 min ago" }
  ];

  // Rotate social proof every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof((prev) => (prev + 1) % socialProofData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Competitive advantage data
  const competitorComparison = [
    {
      feature: "Laundromat Expertise",
      us: "✅ 67k community + 3 generations experience",
      costar: "❌ Generic CRE platform",
      sitezeus: "❌ Retail-focused only"
    },
    {
      feature: "Instant Free Preview",
      us: "✅ Immediate location grade",
      costar: "❌ Subscription required",
      sitezeus: "❌ Demo requests only"
    },
    {
      feature: "Predictive Revenue",
      us: "✅ AI-powered ROI projections",
      costar: "❌ Historical data only",
      sitezeus: "✅ Basic predictions"
    },
    {
      feature: "Industry Specialization",
      us: "✅ 100% laundromat focused",
      costar: "❌ All property types",
      sitezeus: "❌ All retail types"
    },
    {
      feature: "Pricing Transparency",
      us: "✅ $0 → $897 → $2,497",
      costar: "❌ Hidden enterprise pricing",
      sitezeus: "❌ Custom quotes only"
    }
  ];

  // Success metrics
  const successMetrics = [
    { number: "94%", label: "Bad Investment Prevention Rate", description: "Clients who avoided costly mistakes" },
    { number: "23%", label: "ROI Improvement Average", description: "Better returns vs. gut decisions" },
    { number: "$47M", label: "Successful Investments Guided", description: "Total validated acquisitions" },
    { number: "67K", label: "Community Members", description: "Largest laundromat network" },
    { number: "2.3x", label: "Faster Decision Making", description: "Reduced analysis time" },
    { number: "99.7%", label: "Accuracy Rate", description: "Prediction accuracy verified" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10"
      />
      
      {/* Live Social Proof Notification */}
      <motion.div 
        key={currentProof}
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-semibold">{socialProofData[currentProof].text}</div>
            <div className="text-xs opacity-80">{socialProofData[currentProof].time}</div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section - Conversion Optimized */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Trust Signal Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-6 mb-8 text-slate-400"
          >
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">#1 Laundromat Intelligence</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">3-Generation Expertise</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium">67K+ Community</span>
            </div>
          </motion.div>

          {/* Main Headline - Optimized for 5-Second Decision */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black mb-6"
          >
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Stop Guessing.
            </span>
            <span className="block text-white">
              Start Winning.
            </span>
          </motion.h1>

          {/* Value Proposition - Direct & Powerful */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              The ONLY Platform Built by Laundromat Experts for Laundromat Investors
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              While CoStar charges enterprise fees for generic data and SiteZeus focuses on retail, 
              <strong className="text-cyan-400"> we deliver laundromat-specific intelligence that has guided $47M+ in successful investments.</strong>
            </p>
          </motion.div>

          {/* Instant Results Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8 max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-400 mb-2">94%</div>
                <div className="text-slate-300 text-sm">Bad Investments Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2">23%</div>
                <div className="text-slate-300 text-sm">Average ROI Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-400 mb-2">$47M</div>
                <div className="text-slate-300 text-sm">Successful Investments</div>
              </div>
            </div>
          </motion.div>

          {/* Primary CTA - Optimized for Enterprise */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Link 
              to="/analyze"
              className="group bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
            >
              <BoltIcon className="w-6 h-6" />
              Get Instant Location Grade FREE
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => setIsVideoPlaying(true)}
              className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
            >
              <div className="bg-slate-700/50 group-hover:bg-slate-600/50 p-3 rounded-full transition-colors">
                <PlayIcon className="w-6 h-6" />
              </div>
              <span className="font-semibold">Watch 2-min demo</span>
            </button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-slate-400 text-sm"
          >
            ✅ No Credit Card Required &nbsp;•&nbsp; ✅ Instant Results &nbsp;•&nbsp; ✅ 30-Day Guarantee
          </motion.div>
        </div>
      </section>

      {/* Competitive Superiority Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Built Specifically for Laundromat Investments
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Unlike generic commercial real estate platforms, we focus exclusively on laundromat intelligence with 3 generations of industry expertise.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white font-bold text-center">
                Feature
              </div>
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-white font-bold text-center">
                LaundroTech (Us)
              </div>
              <div className="bg-slate-700 p-4 text-slate-300 font-semibold text-center">
                CoStar
              </div>
              <div className="bg-slate-700 p-4 text-slate-300 font-semibold text-center">
                SiteZeus
              </div>

              {/* Comparison Rows */}
              {competitorComparison.map((row, index) => (
                <React.Fragment key={index}>
                  <div className="p-4 bg-slate-800/40 border-t border-slate-700/30 font-semibold text-white">
                    {row.feature}
                  </div>
                  <div className="p-4 bg-emerald-900/20 border-t border-slate-700/30 text-emerald-300 font-semibold">
                    {row.us}
                  </div>
                  <div className="p-4 bg-slate-800/20 border-t border-slate-700/30 text-slate-400">
                    {row.costar}
                  </div>
                  <div className="p-4 bg-slate-800/20 border-t border-slate-700/30 text-slate-400">
                    {row.sitezeus}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Numbers Don't Lie. Results Speak Louder.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successMetrics.map((metric, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text mb-4">
                  {metric.number}
                </div>
                <div className="text-xl font-bold text-white mb-2">{metric.label}</div>
                <div className="text-slate-400 text-sm">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20 bg-gradient-to-r from-red-900/20 to-orange-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Every Day You Wait Costs You Money
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              While you're "researching," other investors are using our intelligence to secure the best opportunities. 
              <strong className="text-orange-400"> Bad location decisions cost $200K+ to fix.</strong>
            </p>
            
            <div className="bg-slate-800/60 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-black text-red-400 mb-2">$180K</div>
                  <div className="text-slate-300 text-sm">Average loss from bad location</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-orange-400 mb-2">6 months</div>
                  <div className="text-slate-300 text-sm">Time lost on failed ventures</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-2">2-5</div>
                  <div className="text-slate-300 text-sm">Good locations missed while deciding</div>
                </div>
              </div>
            </div>

            <Link 
              to="/analyze"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all transform hover:scale-105"
            >
              <BoltIcon className="w-6 h-6" />
              Stop Losing Money - Get Analysis Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Ready to Join the Winners?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get the same intelligence that guided $47M+ in successful laundromat investments.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/analyze"
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <SparklesIcon className="w-6 h-6" />
                Start Free Analysis
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              
              <div className="text-slate-400 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-cyan-400" />
                  <span>Results in under 60 seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SuperiorLandingPage;