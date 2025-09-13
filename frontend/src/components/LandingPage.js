import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const LandingPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: MapPinIcon,
      title: "AI-Powered Location Analysis",
      description: "Advanced machine learning algorithms analyze demographics, competition, and market potential",
      stat: "98% Accuracy"
    },
    {
      icon: ChartBarIcon,
      title: "6-Tier Intelligence System",
      description: "From free scouting to enterprise portfolio management - scale as you grow",
      stat: "$8.4M Potential"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Hybrid Business Opportunities",
      description: "Coffee shops, car washes, barber shops, tattoo studios - maximize revenue streams",
      stat: "300% ROI Boost"
    },
    {
      icon: TrophyIcon,
      title: "67K Facebook Group Access",
      description: "Exclusive insights from the largest laundromat community",
      stat: "67,000 Members"
    }
  ];

  const pricingTiers = [
    {
      name: "Location Scout",
      price: "Free",
      description: "Perfect for getting started",
      features: ["Basic location grades", "Population demographics", "Competitor count", "Traffic estimates"],
      popular: false
    },
    {
      name: "Location Analyzer", 
      price: "$99",
      description: "For serious location shoppers",
      features: ["Complete grade breakdown", "Detailed demographics", "Competitor mapping", "ROI estimates", "Equipment recommendations"],
      popular: false  
    },
    {
      name: "Location Intelligence",
      price: "$249", 
      description: "Ready-to-invest decision makers",
      features: ["Competitive intelligence", "Marketing strategies", "Revenue optimization", "Risk mitigation", "Financing recommendations"],
      popular: true
    },
    {
      name: "LaundroMax",
      price: "$499",
      description: "Existing owners + investors", 
      features: ["Business valuation", "Machine-by-machine ROI", "Hybrid business analysis", "90-day implementation plan"],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Multi-Location Owner",
      content: "SiteTitan helped me identify 3 perfect locations that are now generating $45K monthly. The hybrid analysis was game-changing.",
      rating: 5,
      revenue: "$45K/month"
    },
    {
      name: "Sarah Rodriguez", 
      role: "First-Time Investor",
      content: "From complete beginner to profitable owner in 8 months. The intelligence tier paid for itself 10x over.",
      rating: 5,
      revenue: "$28K/month"
    },
    {
      name: "David Park",
      role: "Portfolio Investor",
      content: "Managing 12 locations across 4 states. LaundroEmpire tier keeps me ahead of market changes and opportunities.",
      rating: 5,
      revenue: "$180K/month"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animated-bg"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="mb-8">
              <img 
                src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/kw0rymvw_logo1.png" 
                alt="SiteTitan Logo"
                className="h-20 mx-auto mb-4"
              />
              <h1 className="text-6xl font-bold mb-4">
                <span className="gradient-text">SiteTitan</span>
              </h1>
              <p className="text-xl text-slate-300 mb-2">LaundroTech Powered By Service Titan</p>
              <p className="text-lg text-slate-400">The Complete Laundromat Business Intelligence Platform</p>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Turn Location Data Into
              <span className="gradient-text-gold"> Million-Dollar Decisions</span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered location intelligence, hybrid business opportunities, and portfolio management 
              trusted by 67,000+ laundromat professionals
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent text-lg px-8 py-4"
                onClick={() => onOpenAuth('register')}
              >
                Start Free Analysis
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </motion.button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Revenue Generated", value: "$8.4M+", icon: CurrencyDollarIcon },
                { label: "Locations Analyzed", value: "35K+", icon: MapPinIcon },
                { label: "Success Rate", value: "98%", icon: TrophyIcon },
                { label: "Active Members", value: "67K", icon: ShieldCheckIcon }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why <span className="gradient-text">SiteTitan</span> Dominates
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Revolutionary intelligence platform that turns complex market data into actionable business decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="feature-card group"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 mb-4">{feature.description}</p>
                <div className="text-2xl font-bold gradient-text">{feature.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your <span className="gradient-text">Intelligence Level</span>
            </h2>
            <p className="text-xl text-slate-300">From free scouting to empire building - scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`pricing-card ${tier.popular ? 'featured' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold gradient-text mb-2">{tier.price}</div>
                  <p className="text-slate-400">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={tier.popular ? "btn-accent w-full" : "btn-primary w-full"}
                  onClick={() => onOpenAuth('register')}
                >
                  {tier.price === "Free" ? "Start Free" : "Choose Plan"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories From Our <span className="gradient-text">Community</span>
            </h2>
            <p className="text-xl text-slate-300">Real results from real laundromat professionals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-slate-300 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t border-slate-600 pt-4">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  <div className="text-emerald-400 font-bold mt-2">{testimonial.revenue}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12"
          >
            <RocketLaunchIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Build Your <span className="gradient-text-gold">Laundromat Empire</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join 67,000+ professionals using SiteTitan to make million-dollar location decisions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent text-lg px-8 py-4"
                onClick={() => onOpenAuth('register')}
              >
                Start Your Free Analysis
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </motion.button>
              
              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
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