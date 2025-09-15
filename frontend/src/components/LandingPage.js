import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  BoltIcon,
  UserGroupIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const LandingPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showNavMenu, setShowNavMenu] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigationLinks = [
    { name: 'Platform', href: '/', current: true },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Analytics', href: '/dashboard' },
    { name: 'Enterprise', href: '/analyze' },
    { name: 'Contact', href: 'mailto:nick@laundryguys.net' }
  ];

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
      stat: "Intelligence Network",
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
      title: "Market Intelligence",
      description: "Advanced pattern recognition and competitive analysis powered by proprietary algorithms and real-time data integration",
      stat: "24+ Hidden Patterns",
      color: "from-orange-400 to-red-500"
    }
  ];

  const aiCapabilities = [
    { label: "Success Prediction", value: "87.3%", icon: CpuChipIcon, color: "text-emerald-400" },
    { label: "Hidden Patterns", value: "24+", icon: MapPinIcon, color: "text-blue-400" },
    { label: "Data Points", value: "156", icon: ShieldCheckIcon, color: "text-purple-400" },
    { label: "AI Confidence", value: "94.2%", icon: CurrencyDollarIcon, color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Branding */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group">
                <div className="block">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
                    LaundroTech
                  </h1>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium -mt-1">Powered by SiteAtlas</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-slate-300 hover:text-white transition-colors duration-200 font-medium ${
                    link.current ? 'text-cyan-400' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="btn-accent text-sm"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {showNavMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-white/10 bg-slate-900/50 backdrop-blur-xl"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                      onClick={() => setShowNavMenu(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        onOpenAuth('register');
                        setShowNavMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-cyan-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 -z-10">
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium LaundroTech Branding */}
            <div className="mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black mb-4 tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent block">
                    LaundroTech
                  </span>
                </h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 font-medium">Powered by SiteAtlas</p>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-400">Advanced Intelligence Platform</p>
                </motion.div>
              </motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight"
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
              className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Next-generation algorithms analyze market patterns humans can't detect. Real-time intelligence 
              across 156+ data points delivers unprecedented location insights.
            </motion.p>

            {/* AI Analysis Demo - Moved here for better positioning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.1 }}
              className="mb-12 max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Success Probability Chart */}
                <div className="glass-card p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Success Prediction</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Little Rock, AR</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-20 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-green-400 font-bold">87.3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Fayetteville, AR</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-16 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="text-blue-400 font-bold">72.1%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Conway, AR</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-14 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                        <span className="text-yellow-400 font-bold">64.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">AI analyzes 156+ data points for predictions</div>
                </div>

                {/* Competitive Intelligence Preview */}
                <div className="glass-card p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Competitive Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">Market Leader Opportunity</div>
                        <div className="text-slate-400 text-xs">Low density area detected</div>
                      </div>
                      <div className="text-green-400 text-sm font-bold">+34%</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">Premium Service Gap</div>
                        <div className="text-slate-400 text-xs">AI detected underserved market</div>
                      </div>
                      <div className="text-blue-400 text-sm font-bold">+28%</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">Traffic Pattern Advantage</div>
                        <div className="text-slate-400 text-xs">Rush hour proximity bonus</div>
                      </div>
                      <div className="text-purple-400 text-sm font-bold">+19%</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">Advanced pattern recognition beyond human analysis</div>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl transition-all duration-300"
                onClick={() => onOpenAuth('register')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4V6H18C19.1 6 20 6.9 20 8V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H10V4C10 2.9 10.9 2 12 2ZM12 4V6H12V4ZM6 8V19H18V8H6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z"/>
                  </svg>
                  <span className="whitespace-nowrap">Join the Movement</span>
                  <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="whitespace-nowrap">See the Technology</span>
              </motion.button>
            </motion.div>

            {/* AI Capabilities Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
            >
              {aiCapabilities.map((capability, index) => (
                <motion.div
                  key={capability.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 + index * 0.1 }}
                  className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300 border border-slate-700/50"
                >
                  <capability.icon className={`w-10 h-10 mx-auto mb-3 ${capability.color}`} />
                  <div className="text-3xl font-bold text-white">{capability.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{capability.label}</div>
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

      {/* Real-World Case Studies Preview Section */}
      <section className="relative py-20 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real-World <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Intelligence Showcase</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto">
              See how LaundroTech powers million-dollar decisions with The Wash Room expansion and Vista Laundry rebuild analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* The Wash Room Phoenix Ave */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 border border-cyan-400/30 relative"
            >
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                FEATURED
              </div>
              <div className="h-32 sm:h-40 lg:h-48 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png" 
                  alt="The Wash Room - Phoenix Ave, Fort Smith, AR"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">The Wash Room - Phoenix Ave</h4>
              <p className="text-slate-300 text-sm mb-4">Fort Smith, AR - Multi-million dollar expansion success story</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                  <span>Rapid expansion validated</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                  <span>High traffic location analysis</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                  <span>Premium equipment ROI</span>
                </div>
              </div>
              <Link
                to="/analyze"
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold text-center block hover:shadow-lg transition-all"
              >
                See Intelligence Preview
              </Link>
            </motion.div>

            {/* Vista Laundry Rebuild */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 border border-orange-400/30 relative"
            >
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                CRITICAL
              </div>
              <div className="h-32 sm:h-40 lg:h-48 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/fj8inoji_IMG_4674.jpeg" 
                  alt="Vista Laundry - Van Buren, AR"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Vista Laundry Rebuild</h4>
              <p className="text-slate-300 text-sm mb-4">Van Buren, AR - Million-dollar tear down vs renovate decision</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-orange-400 flex-shrink-0" />
                  <span>Highway 59 traffic advantage</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-orange-400 flex-shrink-0" />
                  <span>Speed Queen investment analysis</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-orange-400 flex-shrink-0" />
                  <span>Multi-million dollar decision</span>
                </div>
              </div>
              <Link
                to="/analyze"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold text-center block hover:shadow-lg transition-all"
              >
                Critical Analysis Preview
              </Link>
            </motion.div>

            {/* The Wash Room Kelly Highway */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 border border-blue-400/30"
            >
              <div className="h-32 sm:h-40 lg:h-48 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png" 
                  alt="The Wash Room - Kelly Highway Location"
                  className="w-full h-full object-cover rounded-lg opacity-80"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">The Wash Room - Kelly Highway</h4>
              <p className="text-slate-300 text-sm mb-4">Strategic positioning and market gap analysis</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-blue-400 flex-shrink-0" />
                  <span>Market gap identified</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-blue-400 flex-shrink-0" />
                  <span>Competitive advantage</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <CheckCircleIcon className="w-3 h-3 mr-2 text-blue-400 flex-shrink-0" />
                  <span>Proven business model</span>
                </div>
              </div>
              <Link
                to="/analyze"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold text-center block hover:shadow-lg transition-all"
              >
                Strategic Analysis Preview
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              <SparklesIcon className="w-6 h-6" />
              <span>Experience Full Intelligence Platform</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              Join The Wash Room and thousands of professionals using LaundroTech Intelligence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="features" className="relative py-32 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">LaundroTech</span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Revolutionary intelligence platform powered by advanced AI that transforms complex market data into actionable business intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative group"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="glass-card p-8 h-full hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <feature.icon className="w-16 h-16 text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore Our <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-xl text-slate-300">Multiple platforms, one comprehensive solution</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 text-center hover:scale-105 transition-all duration-300"
            >
              <CpuChipIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Intelligence Platform</h3>
              <p className="text-slate-300 mb-6">Advanced AI-powered location analysis and market intelligence</p>
              <Link to="/pricing" className="btn-primary w-full">
                View Pricing
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 border border-slate-700/50"
            >
              <CpuChipIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Advanced AI Insights</h3>
              <p className="text-slate-300 mb-6">Next-generation algorithms detect patterns humans miss. Real-time intelligence across 156+ data points.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">87.3%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">24+</div>
                  <div className="text-xs text-slate-400">Hidden Patterns</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">94%</div>
                  <div className="text-xs text-slate-400">AI Confidence</div>
                </div>
              </div>
              
              <motion.button
                onClick={() => window.location.href = '/analyze'}
                className="inline-flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-lg transition-all duration-300 w-full justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CpuChipIcon className="w-5 h-5" />
                <span>See Real Case Studies</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 text-center hover:scale-105 transition-all duration-300"
            >
              <ShieldCheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Trust & Security</h3>
              <p className="text-slate-300 mb-6">Complete legal compliance and data protection for your business</p>
              <Link to="/privacy" className="btn-secondary w-full">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legal Compliance Footer */}
      <section className="relative py-16 bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Investment Disclaimer</Link></li>
                <li><a href="mailto:nick@laundrotech.xyz" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Partnership</a></li>
              </ul>
              <div className="mt-4">
                <a 
                  href="https://facebook.com/groups/thelaundromat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
                >
                  Professional Network
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Founder</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcsvvw_IMG_1750.jpeg" 
                  alt="Nick - Founder" 
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/30"
                />
                <div>
                  <div className="text-white font-semibold">Nick</div>
                  <div className="text-slate-400 text-sm">3rd Generation Arkansas Expert</div>
                </div>
              </div>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><a href="mailto:nick@laundrotech.xyz" className="hover:text-white transition-colors">Direct Contact</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Industry Experience</Link></li>
                <li><a href="mailto:nick@laundrotech.xyz" className="hover:text-white transition-colors">Consultation</a></li>
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
              <strong>Investment Disclaimer:</strong> All financial projections, ROI estimates, and revenue calculations provided by LaundroTech are for 
              informational purposes only and should not be considered as investment advice. Past performance does not guarantee future results. 
              Laundromat investments carry inherent risks, and you should conduct your own due diligence and consult with qualified financial advisors 
              before making any investment decisions. LaundroTech does not guarantee any specific financial outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;