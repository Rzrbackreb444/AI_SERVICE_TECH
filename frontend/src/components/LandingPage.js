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
      description: "Advanced neural networks analyze 47+ data points including demographics, competition, traffic patterns, and market potential in real-time with SiteAtlas precision",
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
      name: "SiteAtlas Optimization",
      price: "$499",
      paypalPrice: "$474",
      subtitle: "Business Optimization",
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
      content: "SiteAtlas predicted market shifts 6 months before they happened. My portfolio went from 3 to 12 locations, generating $180K monthly. The hybrid analysis identified coffee shop opportunities that doubled my revenue per location.",
      rating: 5,
      revenue: "$180K/month",
      avatar: "MC"
    },
    {
      name: "Sarah Rodriguez", 
      role: "First-Time Investor → Portfolio Owner",
      company: "Southwest Wash Solutions",
      content: "Started as a complete beginner. SiteAtlas intelligence tier guided me through my first acquisition, then second, then third. Now I'm managing 8 locations across Arizona. The ROI predictions were 98% accurate.",
      rating: 5,
      revenue: "$95K/month",
      avatar: "SR"
    },
    {
      name: "David Park",
      role: "Franchise Territory Manager",
      company: "LaundroMax Franchising",
      content: "Managing 47 locations across 4 states. The SiteAtlas Portfolio tier keeps me ahead of every market shift. The demographic trending predicted the Austin expansion opportunity 8 months early. Complete game changer.",
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
            {/* Premium SiteAtlas Logo */}
            <div className="mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative inline-block"
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" 
                  alt="SiteAtlas Logo"
                  className="h-48 md:h-56 lg:h-64 mx-auto mb-8 drop-shadow-2xl filter brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 blur-3xl -z-10"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="space-y-3"
              >
                <p className="text-2xl md:text-3xl text-slate-300 font-medium">LaundroTech Powered By SiteAtlas</p>
                <p className="text-lg text-slate-400">The World's Most Advanced Location Intelligence Platform</p>
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
                whileTap={{ scale: 0.95 }}
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
              Why <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">SiteAtlas</span> Dominates
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

      {/* Premium Pricing Section with PayPal Discounts */}
      <section className="relative py-32">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Intelligence Level</span>
            </h2>
            <p className="text-2xl text-slate-300 mb-4">From AI reconnaissance to empire building - scale with intelligence that evolves</p>
            
            {/* PayPal Discount Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl px-6 py-3 mb-8"
            >
              <BoltIcon className="w-6 h-6 text-yellow-400 mr-3" />
              <span className="text-yellow-300 font-semibold">Save 5% with PayPal payments on all premium tiers!</span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative group ${tier.popular ? 'scale-105' : ''}`}
              >
                <div className={`glass-card p-8 h-full relative overflow-hidden ${tier.popular ? 'ring-2 ring-cyan-400 shadow-cyan-400/20 shadow-2xl' : ''}`}>
                  {tier.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  
                  {tier.paypalDiscount && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      5% OFF WITH PAYPAL
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-cyan-400 font-semibold mb-4">{tier.subtitle}</p>
                    
                    <div className="space-y-2">
                      <div className={`text-4xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                        {tier.price}
                      </div>
                      {tier.paypalDiscount && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-slate-500 line-through text-sm">{tier.price}</span>
                          <span className="text-yellow-400 font-bold text-lg">{tier.paypalPrice} with PayPal</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-400 mt-4">{tier.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-slate-300">
                        <CheckCircleIcon className="w-6 h-6 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xl hover:shadow-2xl' 
                        : `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg`
                    }`}
                    onClick={() => onOpenAuth('register')}
                  >
                    {tier.price === "Free" ? "Start Free Intelligence" : "Unlock Intelligence"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 mt-12"
          >
            {/* SiteAtlas Portfolio */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                5% OFF WITH PAYPAL
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">SiteAtlas Portfolio</h3>
                <p className="text-orange-400 font-semibold mb-4">Empire Management</p>
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    $999
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-slate-500 line-through text-sm">$999</span>
                    <span className="text-yellow-400 font-bold text-xl">$949 with PayPal</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Multi-location portfolio analysis
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Franchise territory analysis
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Advanced demographic forecasting
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Market expansion strategies
                </li>
              </ul>

              <button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                onClick={() => onOpenAuth('register')}
              >
                Build Your Empire
              </button>
            </div>

            {/* SiteAtlas Watch Pro */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                RECURRING
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">SiteAtlas Watch Pro</h3>
                <p className="text-green-400 font-semibold mb-4">Real-Time Monitoring</p>
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                    $199
                  </div>
                  <p className="text-slate-400 text-sm">per location/month</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-slate-500 line-through text-sm">$199/mo</span>
                    <span className="text-yellow-400 font-bold text-lg">$189/mo with PayPal</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Real-time market monitoring
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Competitor detection alerts
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Ongoing optimization reports
                </li>
                <li className="flex items-start text-slate-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Priority support access
                </li>
              </ul>

              <button 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                onClick={() => onOpenAuth('register')}
              >
                Start Monitoring
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="relative py-32 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Success Stories From Our <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Elite Network</span>
            </h2>
            <p className="text-2xl text-slate-300">Real intelligence. Real results. Real millionaires.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass-card p-8 hover:scale-105 transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-cyan-400 text-sm font-semibold">{testimonial.role}</div>
                    <div className="text-slate-400 text-xs">{testimonial.company}</div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t border-slate-600 pt-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {testimonial.revenue}
                  </div>
                  <div className="text-slate-400 text-sm">Monthly Revenue</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20"></div>
            
            <RocketLaunchIcon className="w-24 h-24 text-cyan-400 mx-auto mb-8" />
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Build Your <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Laundromat Empire?
              </span>
            </h2>
            <p className="text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
              Join 67,000+ professionals using SiteAtlas AI to make million-dollar location decisions with precision intelligence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-2xl px-16 py-6 rounded-2xl shadow-2xl transition-all duration-300"
                onClick={() => onOpenAuth('register')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <SparklesIcon className="w-7 h-7 mr-4" />
                  Start Your AI Analysis
                  <ArrowRightIcon className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
              
              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-2xl px-16 py-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
                  onClick={() => onOpenAuth('login')}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;