import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon, StarIcon, BoltIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);

  const pricingTiers = [
    {
      id: "scout",
      name: "Location Scout",
      price: 0,
      paypalPrice: 0,
      originalPrice: null,
      description: "Basic tools to get started",
      badge: "FREE",
      features: [
        "Basic location scoring algorithm",
        "Simple demographic estimates",
        "Basic competition search",
        "3 location analyses per month",
        "Community access to facebook.com/groups/thelaundromat",
        "Email support"
      ],
      limitations: [
        "Limited to basic scoring only",
        "No real-time data connections",
        "No advanced research capabilities"
      ],
      cta: "Start Free",
      popular: false,
      color: "from-slate-600 to-slate-700",
      paypalDiscount: false
    },
    {
      id: "analyzer",
      name: "Real Data Analyzer",
      price: 49,
      paypalPrice: 44,
      originalPrice: null,
      description: "Enhanced with real demographic data",
      badge: "REAL DATA",
      features: [
        "Real Census demographic integration",
        "Actual competition mapping within 2 miles",
        "Traffic pattern estimation algorithms",
        "Equipment ROI calculations with real pricing",
        "Unlimited location analyses",
        "Basic financial projections",
        "AI consultant (15 messages/day)"
      ],
      limitations: [
        "No real-time research capabilities",
        "No live equipment pricing feeds",
        "Limited AI research access"
      ],
      cta: "Get Real Data",
      popular: true,
      color: "from-blue-600 to-blue-700",
      paypalDiscount: true
    },
    {
      id: "intelligence",
      name: "Research Intelligence",
      price: 99,
      paypalPrice: 89,
      originalPrice: 149,
      description: "Real-time research + professional AI",
      badge: "RESEARCH POWERED",
      features: [
        "Everything in Real Data Analyzer PLUS:",
        "Live industry research & web scraping",
        "Real-time equipment pricing from manufacturers",
        "Advanced competition intelligence",
        "Professional AI consultant (50 messages/day)",
        "Custom financial modeling",
        "Priority support"
      ],
      limitations: [
        "No Google Street View integration yet",
        "Limited to standard PDF reports",
        "No multi-location portfolio tools"
      ],
      cta: "Unlock Research",
      popular: false,
      color: "from-cyan-500 to-emerald-500",
      paypalDiscount: true
    },
    {
      id: "optimization",
      name: "Portfolio Intelligence",
      price: 199,
      paypalPrice: 179,
      originalPrice: 299,
      description: "Full business intelligence suite",
      badge: "ENTERPRISE",
      features: [
        "Everything in Research Intelligence PLUS:",
        "Multi-location portfolio management",
        "Advanced analytics dashboard with real charts",
        "Immersive reports with live data visualizations",
        "Master AI consultant (150 messages/day)",
        "Live market intelligence feeds",
        "Direct phone support",
        "Facebook group VIP access"
      ],
      limitations: [
        "Google Street View integration coming Q2 2025",
        "Some advanced features in development"
      ],
      cta: "Go Enterprise",
      popular: false,
      color: "from-purple-600 to-pink-600",
      paypalDiscount: true
    },
    {
      id: "portfolio",
      name: "SiteAtlas Portfolio",
      price: 999,
      paypalPrice: 949,
      originalPrice: 1299,
      description: "Multi-location owners, franchisees",
      badge: "ENTERPRISE",
      features: [
        "Everything in SiteAtlas Optimization PLUS:",
        "Multi-location portfolio analysis",
        "Franchise territory analysis and expansion planning",
        "Market expansion strategies with timing",
        "Advanced hybrid business development",
        "Demographic trend analysis with predictive modeling",
        "Cross-location customer flow optimization",
        "Exit strategy planning with maximum sale value"
      ],
      limitations: [],
      cta: "Build Empire",
      popular: false,
      color: "from-orange-500 to-red-500",
      paypalDiscount: true
    },
    {
      id: "watch_pro",
      name: "SiteAtlas Watch Pro",
      price: 199,
      paypalPrice: 189,
      billing: "per location/month",
      originalPrice: 299,
      description: "Ongoing intelligence monitoring",
      badge: "RECURRING",
      features: [
        "Real-time market condition monitoring",
        "New competitor detection and analysis",
        "Demographic shift tracking with impact analysis",
        "Equipment performance optimization alerts",
        "Revenue opportunity notifications",
        "Monthly optimization reports",
        "Priority customer support",
        "Industry trend forecasting"
      ],
      limitations: [],
      cta: "Start Monitoring",
      popular: false,
      color: "from-green-600 to-teal-600",
      paypalDiscount: true
    }
  ];

  const facebookGroupBenefits = [
    "30% discount on first analysis",
    "Early access to new features",
    "Community case studies",
    "Monthly expert AMA sessions",
    "Referral program: $50 credit per qualified referral"
  ];

  const handleStripeCheckout = async (tier) => {
    if (!isAuthenticated) {
      onOpenAuth('register');
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        tier: tier.id,
        payment_method: 'stripe'
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalCheckout = async (tier) => {
    if (!isAuthenticated) {
      onOpenAuth('register');
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        tier: tier.id,
        payment_method: 'paypal'
      });

      // PayPal checkout would be handled here
      console.log('PayPal checkout data:', response.data);
      alert(`PayPal checkout for ${tier.name} - $${tier.paypalPrice} (5% discount applied!)`);
    } catch (error) {
      console.error('PayPal checkout error:', error);
      alert('PayPal payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const PaymentButtons = ({ tier }) => {
    if (tier.price === 0) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-slate-600 to-slate-700 text-white"
          onClick={() => isAuthenticated ? alert('Free tier activated!') : onOpenAuth('register')}
        >
          {tier.cta}
        </motion.button>
      );
    }

    return (
      <div className="space-y-3">
        {/* PayPal Button with Discount */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 text-white relative overflow-hidden"
          onClick={() => handlePayPalCheckout(tier)}
          disabled={processing}
        >
          <div className="flex items-center justify-center space-x-2">
            <BoltIcon className="w-5 h-5" />
            <span>PayPal - ${tier.paypalPrice} (Save 5%!)</span>
          </div>
          {tier.paypalDiscount && (
            <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              SAVE $5
            </div>
          )}
        </motion.button>

        {/* Stripe Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            tier.popular 
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' 
              : `bg-gradient-to-r ${tier.color} text-white`
          }`}
          onClick={() => handleStripeCheckout(tier)}
          disabled={processing}
        >
          <div className="flex items-center justify-center space-x-2">
            <CreditCardIcon className="w-5 h-5" />
            <span>Credit Card - ${tier.price}</span>
          </div>
        </motion.button>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* SiteAtlas Logo */}
          <div className="mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" 
              alt="SiteAtlas Logo"
              className="h-32 mx-auto mb-4 drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Intelligence Level</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            From free scouting to empire building - scale as you grow with AI-powered insights
          </p>
          
          {/* PayPal Discount Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl px-6 py-3 mb-8"
          >
            <BoltIcon className="w-6 h-6 text-yellow-400 mr-3" />
            <span className="text-yellow-300 font-semibold">Save 5% with PayPal payments on all premium tiers!</span>
          </motion.div>
          
          {/* Facebook Group Benefits */}
          <div className="glass-card p-6 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              <StarIcon className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                67K Facebook Group Member Benefits
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
              {facebookGroupBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`pricing-card ${tier.popular ? 'featured' : ''} relative overflow-hidden`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  tier.popular ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-gradient-to-r from-slate-600 to-slate-700'
                }`}>
                  {tier.badge}
                </div>
              )}

              {/* PayPal Discount Badge */}
              {tier.paypalDiscount && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  5% OFF WITH PAYPAL
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="mb-2">
                  {tier.originalPrice && (
                    <span className="text-slate-500 line-through text-lg mr-2">
                      ${tier.originalPrice}
                    </span>
                  )}
                  <span className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    ${tier.price}
                  </span>
                  {tier.billing && (
                    <span className="text-slate-400 text-sm ml-1">/{tier.billing}</span>
                  )}
                </div>
                
                {/* PayPal Price Display */}
                {tier.paypalDiscount && (
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-400 font-bold text-lg">
                      ${tier.paypalPrice} with PayPal
                    </span>
                  </div>
                )}
                
                <p className="text-slate-400">{tier.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">INCLUDED FEATURES</h4>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-slate-300 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hybrid Features */}
                {tier.hybridFeatures && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">HYBRID BUSINESS ANALYSIS</h4>
                    <ul className="space-y-1">
                      {tier.hybridFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-slate-300 text-sm">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">UPGRADE FOR</h4>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-slate-400 text-sm">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Payment Buttons */}
              <PaymentButtons tier={tier} />
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Detailed Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-4 px-4 text-slate-300 font-semibold">Feature</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Scout</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Analyzer</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Intelligence</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Optimization</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Portfolio</th>
                  <th className="text-center py-4 px-2 text-slate-300 font-semibold">Watch Pro</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  { feature: "Location Grade", values: ["Basic", "✓", "✓", "✓", "✓", "✓"] },
                  { feature: "Demographics Analysis", values: ["Surface", "Detailed", "✓", "✓", "✓", "✓"] },
                  { feature: "Competitor Mapping", values: ["Count Only", "✓", "✓", "✓", "✓", "✓"] },
                  { feature: "ROI Estimates", values: ["–", "✓", "✓", "✓", "✓", "✓"] },
                  { feature: "Competitive Intelligence", values: ["–", "–", "✓", "✓", "✓", "✓"] },
                  { feature: "Marketing Strategies", values: ["–", "–", "✓", "✓", "✓", "✓"] },
                  { feature: "Business Valuation", values: ["–", "–", "–", "✓", "✓", "–"] },
                  { feature: "Hybrid Business Analysis", values: ["–", "–", "–", "✓", "✓", "–"] },
                  { feature: "Portfolio Management", values: ["–", "–", "–", "–", "✓", "–"] },
                  { feature: "Real-time Monitoring", values: ["–", "–", "–", "–", "–", "✓"] }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="py-3 px-2 text-center">
                        {value === "✓" ? (
                          <CheckCircleIcon className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : value === "–" ? (
                          <span className="text-slate-500">–</span>
                        ) : (
                          <span className="text-slate-400">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Revenue Projections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 glass-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the <span className="gradient-text-gold">$8.4M Success Story</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Our 67,000 Facebook Group members are generating massive returns with SiteAtlas
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Members", value: "67,000+", icon: "👥" },
              { label: "Monthly Revenue Potential", value: "$700K+", icon: "💰" },
              { label: "Annual Projection", value: "$8.4M+", icon: "📈" },
              { label: "Success Rate", value: "98%", icon: "🎯" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-accent text-xl px-12 py-4"
            onClick={() => onOpenAuth('register')}
          >
            Start Your Success Story
            <ArrowRightIcon className="w-6 h-6 ml-3 inline" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;