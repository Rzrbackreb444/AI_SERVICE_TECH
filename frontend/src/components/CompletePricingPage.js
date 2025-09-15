import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon,
  XMarkIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import Navbar from './Navbar';
import { useAuth } from '../App';

const CompletePricingPage = () => {
  const { isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const pricingTiers = [
    {
      id: 'scout',
      name: 'Location Scout',
      price: { monthly: 0, annual: 0 },
      description: 'Basic reconnaissance and market overview',
      features: [
        'Location grade assessment',
        'Basic demographic overview',
        'Competition count',
        'Public data analysis',
        'Basic market viability'
      ],
      limitations: [
        'Limited to 3 analyses/month',
        'No detailed financials',
        'Basic reporting only'
      ],
      color: 'from-slate-500 to-slate-600',
      popular: false,
      cta: 'Start Free'
    },
    {
      id: 'analyzer',
      name: 'Market Analyzer',
      price: { monthly: 29, annual: 290 },
      description: 'Comprehensive market analysis and demographic intelligence',
      features: [
        'Everything in Location Scout',
        'Detailed demographic analysis',
        'Traffic pattern insights',
        'Income distribution data',
        'Market positioning analysis',
        'Competitor proximity mapping',
        'Basic financial projections',
        'PDF report generation'
      ],
      limitations: [
        'Limited to 10 analyses/month',
        'Basic equipment recommendations'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false,
      cta: 'Start Trial'
    },
    {
      id: 'intelligence',
      name: 'Business Intelligence',
      price: { monthly: 79, annual: 790 },
      description: 'Complete business intelligence with ROI projections',
      features: [
        'Everything in Market Analyzer',
        'ROI projections and modeling',
        'Equipment recommendations',
        'Competition analysis',
        'Financial modeling',
        'Market trend analysis',
        'Success probability scoring',
        'Custom reporting',
        'Email support'
      ],
      limitations: [
        'Limited to 25 analyses/month'
      ],
      color: 'from-cyan-500 to-emerald-500',
      popular: true,
      cta: 'Most Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Analysis',
      price: { monthly: 199, annual: 1990 },
      description: 'Full enterprise analysis with AI recommendations',
      features: [
        'Everything in Business Intelligence',
        'Advanced AI insights',
        'Custom recommendations',
        'Success probability analysis',
        'Multi-location portfolio tracking',
        'Priority support',
        'Custom integrations',
        'White-label reporting'
      ],
      limitations: [
        'Limited to 50 analyses/month'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false,
      cta: 'Enterprise Power'
    },
    {
      id: 'monitoring',
      name: 'Real-time Monitoring',
      price: { monthly: 299, annual: 2990 },
      description: 'Live market monitoring with automated alerts',
      features: [
        'Everything in Enterprise Analysis',
        'Real-time market monitoring',
        'Automated competitor alerts',
        'Live demographic updates',
        'Trend analysis',
        'Custom dashboards',
        'API access',
        'Unlimited analyses',
        'Phone support',
        'Account manager'
      ],
      limitations: [],
      color: 'from-orange-500 to-red-500',
      popular: false,
      cta: 'Ultimate Intelligence'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: MapPinIcon,
      title: 'Multi-Location Portfolio',
      description: 'Manage and analyze multiple locations with centralized dashboard'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Deep-dive analytics with custom KPIs and performance metrics'
    },
    {
      icon: ShieldCheckIcon,
      title: 'White-Label Solutions',
      description: 'Branded reports and custom integrations for your business'
    },
    {
      icon: BoltIcon,
      title: 'API Access',
      description: 'Integrate our intelligence directly into your systems'
    }
  ];

  const faqs = [
    {
      question: 'What makes LaundroTech different from other analysis tools?',
      answer: 'We combine 3 generations of Arkansas laundromat expertise with advanced AI algorithms. Our platform analyzes 156+ data points and provides industry-specific insights you won\'t find elsewhere.'
    },
    {
      question: 'How accurate are your financial projections?',
      answer: 'Our AI maintains 94.2% accuracy in market assessments with 87.3% success rate predictions. However, all projections are for informational purposes and should be part of your broader due diligence.'
    },
    {
      question: 'Can I analyze locations outside of Arkansas?',
      answer: 'Yes! While our expertise comes from Arkansas markets, our platform works nationwide using comprehensive data sources including Census Bureau, Google Maps, and ATTOM Data.'
    },
    {
      question: 'Is my business information kept confidential?',
      answer: 'Absolutely. We maintain complete confidentiality for all business analysis. Your data is encrypted and never shared with third parties.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'Support varies by tier: Email support for Business Intelligence, Priority support for Enterprise, and dedicated phone support with account manager for Real-time Monitoring.'
    }
  ];

  const getDiscountAmount = () => {
    return billingPeriod === 'annual' ? 17 : 0; // Roughly 17% discount on annual
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Intelligence Level</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            From basic reconnaissance to enterprise-grade intelligence, find the perfect analysis depth for your investment decisions.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-slate-700 rounded-full transition-colors duration-300"
            >
              <div className={`absolute w-6 h-6 bg-cyan-400 rounded-full top-1 transition-transform duration-300 ${
                billingPeriod === 'annual' ? 'translate-x-9' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-lg ${billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              Annual <span className="text-emerald-400 text-sm">(-{getDiscountAmount()}%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative glass-card p-6 hover:scale-105 transition-all duration-300 ${
                tier.popular ? 'border-2 border-cyan-400' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    ${tier.price[billingPeriod]}
                  </span>
                  <span className="text-slate-400 text-sm">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <p className="text-slate-300 text-sm">{tier.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
                
                {tier.limitations.map((limitation, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <XMarkIcon className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-500 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>

              <Link
                to={tier.price.monthly === 0 ? "/analyze" : "/dashboard"}
                className={`w-full text-center block py-3 rounded-lg font-semibold transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:shadow-lg' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Enterprise Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-slate-600 hover:to-slate-500 transition-all duration-300"
            >
              {showComparison ? 'Hide' : 'Show'} Detailed Comparison
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-4 text-white font-semibold">Feature</th>
                        {pricingTiers.map(tier => (
                          <th key={tier.id} className="pb-4 text-center text-white font-semibold">{tier.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-800">
                        <td className="py-3">Monthly Analyses</td>
                        <td className="py-3 text-center">3</td>
                        <td className="py-3 text-center">10</td>
                        <td className="py-3 text-center">25</td>
                        <td className="py-3 text-center">50</td>
                        <td className="py-3 text-center">Unlimited</td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td className="py-3">Advanced AI Insights</td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><CheckCircleIcon className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                        <td className="py-3 text-center"><CheckCircleIcon className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                        <td className="py-3 text-center"><CheckCircleIcon className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td className="py-3">Real-time Monitoring</td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><CheckCircleIcon className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="py-3">API Access</td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><XMarkIcon className="w-4 h-4 text-red-400 mx-auto" /></td>
                        <td className="py-3 text-center"><CheckCircleIcon className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center glass-card p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make Smarter Location Decisions?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals using LaundroTech Intelligence for critical business decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Analysis
            </Link>
            <a
              href="mailto:nick@laundrotech.xyz"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletePricingPage;