import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  StarIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BoltIcon,
  TrophyIcon,
  MapPinIcon,
  PhoneIcon,
  PresentationChartBarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const FacebookGroupMonetization = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const monetizationOffers = [
    {
      id: 'verified-seller',
      name: 'Verified Seller Badge',
      price: 99,
      billing: 'monthly',
      icon: ShieldCheckIcon,
      color: 'from-emerald-500 to-green-500',
      badge: 'CREDIBILITY',
      description: 'Stand out as a trusted seller in the community',
      features: [
        'Premium badge displayed on profile and posts',
        'Signals credibility and trustworthiness',
        'Access to exclusive AMA sessions',
        'Early access to new platform features',
        'Priority visibility in group discussions'
      ],
      benefits: [
        'Increased buyer confidence',
        'Higher conversion rates on listings',
        'Access to seller-only networking events',
        'Monthly market insights reports'
      ],
      popular: true
    },
    {
      id: 'vendor-partner',
      name: 'Vendor Partner Badge',
      price: 499,
      billing: 'monthly',
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-500',
      badge: 'PREMIUM',
      description: 'Premium tier for service providers and vendors',
      features: [
        'Premium vendor badge and featured listing',
        'Priority placement in vendor directory',
        'Access to vendor-only tools and resources',
        'Direct messaging capabilities',
        'Monthly vendor spotlight features'
      ],
      benefits: [
        'Featured in weekly vendor highlights',
        'Access to exclusive vendor networking',
        'Priority customer support',
        'Lead generation tools and analytics'
      ],
      popular: false
    },
    {
      id: 'verified-funder',
      name: 'Verified Funder Badge',
      price: 999,
      billing: 'monthly',
      icon: TrophyIcon,
      color: 'from-purple-500 to-pink-500',
      badge: 'ELITE',
      description: 'Exclusive tier for active investors and funders',
      features: [
        'Elite funder badge with premium styling',
        'Early access to investment opportunities',
        'Exclusive deal alerts and market intelligence',
        'Direct consultation scheduling system',
        'Access to private investor network'
      ],
      benefits: [
        'First access to vetted deals',
        'Monthly investor meetups',
        'Direct connection to deal flow',
        'Portfolio optimization insights'
      ],
      popular: false
    },
    {
      id: 'featured-post',
      name: 'Featured Post',
      price: 500,
      billing: 'per post',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-500',
      badge: 'VISIBILITY',
      description: 'Maximum visibility for your listings and announcements',
      features: [
        'Pinned post at top of group for 48 hours',
        'Enhanced formatting with CTA buttons',
        'Direct links to external content allowed',
        'Premium post styling and borders',
        'Cross-promotion in group newsletter'
      ],
      benefits: [
        'Guaranteed visibility to all 67K members',
        'Higher engagement rates',
        'Professional post formatting',
        'Analytics and performance tracking'
      ],
      popular: false
    },
    {
      id: 'location-report',
      name: 'Custom Location Report',
      price: 99,
      billing: 'per report',
      icon: MapPinIcon,
      color: 'from-cyan-500 to-blue-500',
      badge: 'ANALYSIS',
      description: 'Professional location analysis using SiteAtlas data',
      features: [
        'Complete location intelligence analysis',
        'Grade reasoning and scoring methodology',
        'Detailed ROI estimates and projections',
        'Comprehensive competitor mapping',
        'Market timing recommendations'
      ],
      benefits: [
        'Professional-grade market analysis',
        'Data-driven investment decisions',
        'Competitive advantage insights',
        'Risk assessment and mitigation'
      ],
      popular: true
    },
    {
      id: 'expansion-consult',
      name: 'Expansion Strategy Consult',
      price: 499,
      billing: 'per session',
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-purple-500',
      badge: 'STRATEGY',
      description: 'One-on-one consultation for multi-location strategy',
      features: [
        '60-minute private consultation session',
        'Multi-location expansion planning',
        'Territory analysis and optimization',
        'Hybrid business modeling strategies',
        'Custom growth roadmap development'
      ],
      benefits: [
        'Personalized expansion strategy',
        'Expert guidance from industry professionals',
        'Action plan with timelines',
        'Follow-up support and resources'
      ],
      popular: false
    },
    {
      id: 'dashboard-access',
      name: 'Full Dashboard Access',
      price: 999,
      billing: 'monthly',
      icon: PresentationChartBarIcon,
      color: 'from-rose-500 to-red-500',
      badge: 'PREMIUM',
      description: 'Complete access to the LaundroTech intelligence platform',
      features: [
        'Full LaundroTech dashboard access',
        'Real-time market monitoring and alerts',
        'Competitive intelligence tracking',
        'Ongoing portfolio optimization tools',
        'Advanced analytics and reporting'
      ],
      benefits: [
        'Comprehensive market intelligence',
        'Automated monitoring and alerts',
        'Data-driven decision making',
        'Competitive advantage maintenance'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Robert Kim",
      role: "Verified Seller",
      badge: "verified-seller",
      content: "The Verified Seller badge increased my listing responses by 300%. Members trust the verification and I get priority visibility. Best $99/month I spend.",
      revenue: "+300% responses",
      avatar: "RK"
    },
    {
      name: "Jennifer Martinez",
      role: "Vendor Partner", 
      badge: "vendor-partner",
      content: "As a Vendor Partner, I get featured placement and direct access to serious buyers. Generated $25K in new business just last month from group referrals.",
      revenue: "$25K/month",
      avatar: "JM"
    },
    {
      name: "Thomas Anderson",
      role: "Verified Funder",
      badge: "verified-funder", 
      content: "The Verified Funder access gives me first look at the best deals. I've funded 8 locations this year, all from early alerts. ROI speaks for itself.",
      revenue: "8 deals funded",
      avatar: "TA"
    }
  ];

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setShowPayment(true);
  };

  const getBadgeColor = (badgeType) => {
    const colors = {
      'verified-seller': 'from-emerald-500 to-green-500',
      'vendor-partner': 'from-blue-500 to-cyan-500', 
      'verified-funder': 'from-purple-500 to-pink-500'
    };
    return colors[badgeType] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Facebook Group Branding */}
            <div className="mb-12">
              <UserGroupIcon className="w-20 h-20 text-blue-400 mx-auto mb-6" />
              <h1 className="text-6xl md:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Laundromat Exchange
                </span>
              </h1>
              <p className="text-2xl text-slate-300 font-semibold mb-2">Exclusive Member Benefits</p>
              <p className="text-lg text-slate-400">Monetize Your Community Engagement • 67,000+ Active Members</p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Unlock <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Premium Access</span>
              <br />
              To The Industry's Largest Network
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-4xl mx-auto">
              Join the elite tier of our 67,000-member community with exclusive badges, features, and opportunities designed for serious professionals
            </p>

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {[
                { label: "Active Members", value: "67K+", icon: UserGroupIcon },
                { label: "Monthly Deals", value: "500+", icon: CurrencyDollarIcon },
                { label: "Success Stories", value: "1.2K+", icon: TrophyIcon },
                { label: "Years Established", value: "8+", icon: StarIcon }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Monetization Offers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Premium <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Membership Tiers</span>
            </h2>
            <p className="text-xl text-slate-300">Choose your level of community engagement and exclusive access</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {monetizationOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-card p-8 hover:scale-105 transition-all duration-300 relative overflow-hidden ${
                  offer.popular ? 'ring-2 ring-cyan-400 shadow-cyan-400/20 shadow-2xl' : ''
                }`}
              >
                {offer.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {offer.badge}
                </div>

                {/* Icon and Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${offer.color} flex items-center justify-center`}>
                    <offer.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{offer.name}</h3>
                  <div className="text-3xl font-bold mb-2">
                    <span className={`bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                      ${offer.price}
                    </span>
                    <span className="text-slate-400 text-lg">/{offer.billing}</span>
                  </div>
                  <p className="text-slate-400">{offer.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">FEATURES INCLUDED</h4>
                  <ul className="space-y-2">
                    {offer.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-slate-300 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3">KEY BENEFITS</h4>
                  <ul className="space-y-1">
                    {offer.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-slate-300 text-sm">
                        <StarIcon className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xl hover:shadow-2xl' 
                      : `bg-gradient-to-r ${offer.color} text-white hover:shadow-lg`
                  }`}
                  onClick={() => handleSelectOffer(offer)}
                >
                  Get {offer.name}
                  <ArrowRightIcon className="w-4 h-4 ml-2 inline" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Member <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Success Stories</span>
            </h2>
            <p className="text-xl text-slate-300">Real results from verified community members</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass-card p-8 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(testimonial.badge)} text-white font-bold inline-block mt-1`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t border-slate-600 pt-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {testimonial.revenue}
                  </div>
                  <div className="text-slate-400 text-sm">Impact Achieved</div>
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
            className="glass-card p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
            
            <UserGroupIcon className="w-20 h-20 text-blue-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join the <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Elite Community?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Upgrade your membership and unlock exclusive access to deals, insights, and networking opportunities that drive real results
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300"
                onClick={() => document.getElementById('offers').scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  Choose Your Membership
                  <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedOffer.name}</h3>
              <div className="text-3xl font-bold text-cyan-400 mt-2">
                ${selectedOffer.price}/{selectedOffer.billing}
              </div>
            </div>

            {/* Payment options would go here */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl">
                Pay with PayPal
              </button>
              <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold py-3 px-6 rounded-xl">
                Pay with Credit Card
              </button>
            </div>

            <button 
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Legal Footer */}
      <footer className="py-8 bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm mb-4">
            © 2024 Laundromat Exchange. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> Premium memberships provide enhanced community features and networking opportunities. Results and networking success may vary based on individual engagement and market conditions. All purchases are subject to our Terms of Service and Refund Policy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FacebookGroupMonetization;