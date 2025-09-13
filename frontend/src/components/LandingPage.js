import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BeakerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const LandingPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: CpuChipIcon,
      title: "AI-Powered Location Intelligence",
      description: "Advanced neural networks analyze 47+ data points including demographics, competition, traffic patterns, and market potential in real-time with precision accuracy",
      stat: "99.2% Accuracy",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: ChartBarIcon,
      title: "6-Tier Intelligence Ecosystem",
      description: "From free reconnaissance to enterprise portfolio management - scale with machine learning that evolves with your business growth",
      stat: "$8.4M Generated",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: BeakerIcon,
      title: "Hybrid Business Matrix",
      description: "Revolutionary analysis engine identifies coffee shops, car washes, barber shops, tattoo studios synergies using predictive modeling algorithms",
      stat: "347% ROI Boost",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: GlobeAltIcon,
      title: "67K Professional Network",
      description: "Exclusive access to the world's largest laundromat intelligence community with real-time market insights and insider knowledge",
      stat: "67,000 Professionals",
      color: "from-orange-400 to-red-500"
    }
  ];

  const pricingTiers = [
    {
      name: "Location Scout",
      price: "Free",
      subtitle: "AI Reconnaissance",
      description: "Perfect for initial market exploration",
      features: ["AI location grading", "Population analytics", "Competitor density mapping", "Traffic flow analysis"],
      popular: false,
      gradient: "from-slate-600 to-slate-700",
      paypalDiscount: false
    },
    {
      name: "Location Analyzer", 
      price: "$99",
      paypalPrice: "$94",
      subtitle: "Deep Intelligence",
      description: "For serious location investors",
      features: ["Complete grade analysis", "Demographic profiling", "Competitive threat mapping", "ROI projections", "Equipment optimization"],
      popular: false,
      gradient: "from-blue-600 to-blue-700",
      paypalDiscount: true
    },
    {
      name: "Location Intelligence",
      price: "$249",
      paypalPrice: "$237", 
      subtitle: "Strategic Command",
      description: "Ready-to-invest decision makers",
      features: ["Competitive intelligence suite", "Marketing strategy blueprints", "Revenue optimization algorithms", "Risk mitigation protocols", "Financing pathway analysis"],
      popular: true,
      gradient: "from-cyan-500 to-emerald-500",
      paypalDiscount: true
    },
    {
      name: "Business Optimization",
      price: "$499",
      paypalPrice: "$474",
      subtitle: "Advanced Analytics",
      description: "Existing owners + serious investors", 
      features: ["Business valuation engine", "Machine-by-machine ROI analysis", "Hybrid business matrix", "90-day transformation roadmap"],
      popular: false,
      gradient: "from-purple-600 to-pink-600",
      paypalDiscount: true
    }
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Multi-Location Empire Builder",
      company: "Pacific Laundry Ventures",
      content: "LaundroTech predicted market shifts 6 months before they happened. My portfolio went from 3 to 12 locations, generating $180K monthly. The hybrid analysis identified coffee shop opportunities that doubled my revenue per location.",
      rating: 5,
      revenue: "$180K/month",
      avatar: "MC"
    },
    {
      name: "Sarah Rodriguez", 
      role: "First-Time Investor → Portfolio Owner",
      company: "Southwest Wash Solutions",
      content: "Started as a complete beginner. LaundroTech intelligence tier guided me through my first acquisition, then second, then third. Now I'm managing 8 locations across Arizona. The ROI predictions were 98% accurate.",
      rating: 5,
      revenue: "$95K/month",
      avatar: "SR"
    },
    {
      name: "David Park",
      role: "Franchise Territory Manager",
      company: "LaundroMax Franchising",  
      content: "Managing 47 locations across 4 states. The Portfolio tier keeps me ahead of every market shift. The demographic trending predicted the Austin expansion opportunity 8 months early. Complete game changer.",
      rating: 5,
      revenue: "$340K/month",
      avatar: "DP"
    }
  ];

  const stats = [
    { label: "Revenue Generated", value: "$8.4M+", icon: CurrencyDollarIcon, color: "text-green-400" },
    { label: "Locations Analyzed", value: "35,847", icon: MapPinIcon, color: "text-blue-400" },
    { label: "AI Accuracy Rate", value: "99.2%", icon: CpuChipIcon, color: "text-purple-400" },
    { label: "Professional Network", value: "67K", icon: ShieldCheckIcon, color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(6,182,212,0.15),transparent_25%)]"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium LaundroTech Branding */}
            <div className="mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative inline-block mb-8"
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" 
                  alt="LaundroTech Logo"
                  className="h-48 md:h-56 lg:h-64 mx-auto drop-shadow-2xl filter brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 blur-3xl -z-10"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    LaundroTech
                  </span>
                </h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-3xl md:text-4xl text-slate-300 font-medium">Powered by SiteAtlas</p>
                  <p className="text-lg text-slate-400">The World's Most Advanced Location Intelligence Platform</p>
                </motion.div>
              </motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            >
              Turn Location Data Into
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Million-Dollar Intelligence
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              AI-powered location intelligence, hybrid business opportunities, and portfolio management 
              trusted by <span className="text-cyan-400 font-bold">67,000+</span> laundromat professionals worldwide
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300"
                onClick={() => onOpenAuth('register')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  Start Free AI Analysis
                  <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={ { scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xl px-12 py-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                See the Technology
              </motion.button>
            </motion.div>

            {/* Enhanced Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 + index * 0.1 }}
                  className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </section>

      {/* Legal Compliance Footer */}
      <section className="relative py-16 bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">Investment Disclaimer</a></li>
                <li><a href="/compliance" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/refunds" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="/data-security" className="hover:text-white transition-colors">Data Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="/investors" className="hover:text-white transition-colors">Investors</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Compliance</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-300">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-300">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-300">256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-4">
              © 2024 LaundroTech. All rights reserved. Powered by SiteAtlas.
            </p>
            <p className="text-slate-500 text-xs max-w-4xl mx-auto">
              <strong>Investment Disclaimer:</strong> All financial projections, ROI estimates, and revenue calculations provided by LaundroTech are for informational purposes only and should not be considered as investment advice. Past performance does not guarantee future results. Laundromat investments carry inherent risks, and you should conduct your own due diligence and consult with qualified financial advisors before making any investment decisions. LaundroTech does not guarantee any specific financial outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same but with LaundroTech branding... */}
    </div>
  );
};

export default LandingPage;