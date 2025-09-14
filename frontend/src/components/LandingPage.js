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
      title: "67K Professional Network",
      description: "Exclusive access to the world's largest laundromat intelligence community with real-time market insights and insider knowledge",
      stat: "67,000 Professionals",
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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Branding */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-4 group">
                <div className="hidden sm:block">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
                    LaundroTech
                  </h1>
                  <div className="text-sm text-slate-400 font-medium -mt-1">Powered by SiteAtlas</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
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
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="btn-accent"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium LaundroTech Branding */}
            <div className="mb-12">
              {/* Professional Laundromat Image */}
              {/* AI Analysis Demo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
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
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black mb-4 tracking-tight leading-none">
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
                  <p className="text-2xl md:text-3xl text-slate-300 font-medium">Powered by SiteAtlas</p>
                  <p className="text-lg text-slate-400">Advanced Intelligence Platform</p>
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
              trusted by laundromat professionals in our exclusive Facebook community
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
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4V6H18C19.1 6 20 6.9 20 8V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H10V4C10 2.9 10.9 2 12 2ZM12 4V6H12V4ZM6 8V19H18V8H6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z"/>
                  </svg>
                  Join the Movement
                  <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xl px-12 py-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                See the Technology
              </motion.button>
            </motion.div>

            {/* AI Capabilities Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
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
              Why <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">LaundroTech</span> Dominates
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
              className="glass-card p-8 text-center hover:scale-105 transition-all duration-300"
            >
              <UserGroupIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Professional Network</h3>
              <p className="text-slate-300 mb-6">Access to exclusive laundromat industry insights and professional community of 67K members</p>
              
              {/* Professional Network Button */}
              <motion.a
                href="https://facebook.com/groups/thelaundromat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-lg hover:shadow-slate-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Professional Community Access</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </motion.a>
              <Link to="/pricing" className="btn-secondary w-full mt-4">
                Join Community
              </Link>
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
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Professional Network</Link></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Partnership</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Investors</a></li>
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