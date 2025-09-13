import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  SparklesIcon,
  CreditCardIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FacebookGroupMonetization = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [offers, setOffers] = useState({});

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API}/facebook-group/offers`);
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  };

  const monetizationOffers = [
    {
      id: 'verified_seller',
      name: 'Verified Seller Badge',
      price: 29,
      paypalPrice: 26.10,
      billing: 'monthly',
      icon: ShieldCheckIcon,
      color: 'from-emerald-500 to-green-500',
      badge: 'CREDIBILITY',
      description: 'Stand out as a trusted seller in the community',
      features: [
        'Premium badge displayed on profile and posts',
        'Signals credibility and trustworthiness to buyers',
        'Access to exclusive AMA sessions with industry experts',
        'Early access to new platform features and tools',
        'Priority visibility in group discussions and listings'
      ],
      benefits: [
        'Increased buyer confidence in your listings',
        'Higher conversion rates on sales',
        'Access to seller-only networking events',
        'Monthly market insights reports'
      ],
      popular: true,
      paypalDiscount: true
    },
    {
      id: 'vendor_partner',
      name: 'Vendor Partner Badge',
      price: 149,
      paypalPrice: 134.10,
      billing: 'monthly',
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-500',
      badge: 'PREMIUM',
      description: 'Premium tier for service providers and vendors',
      features: [
        'Premium vendor badge and featured directory listing',
        'Priority placement in vendor directory searches',
        'Access to vendor-only tools and resources',
        'Direct messaging capabilities with prospects',
        'Monthly vendor spotlight features in newsletter'
      ],
      benefits: [
        'Featured in weekly vendor highlights',
        'Access to exclusive vendor networking events',
        'Priority customer support and account management',
        'Lead generation tools and detailed analytics'
      ],
      popular: false,
      paypalDiscount: true
    },
    {
      id: 'verified_funder',
      name: 'Verified Funder Badge',
      price: 299,
      paypalPrice: 269.10,
      billing: 'monthly',
      icon: TrophyIcon,
      color: 'from-purple-500 to-pink-500',
      badge: 'ELITE',
      description: 'Exclusive tier for active investors and funders',
      features: [
        'Elite funder badge with premium styling and recognition',
        'Early access to vetted investment opportunities',
        'Exclusive deal alerts and market intelligence reports',
        'Direct consultation scheduling with deal makers',
        'Access to private investor network and forums'
      ],
      benefits: [
        'First access to pre-screened deals',
        'Monthly exclusive investor meetups',
        'Direct connection to qualified deal flow',
        'Portfolio optimization insights and strategies'
      ],
      popular: false,
      paypalDiscount: true
    },
    {
      id: 'featured_post',
      name: 'Featured Post',
      price: 250,
      paypalPrice: 250,
      billing: 'per post',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-500',
      badge: 'VISIBILITY',
      description: 'Maximum visibility for your listings and announcements',
      features: [
        'Pinned post at top of group for 48 hours',
        'Enhanced formatting with custom CTA buttons',
        'Direct links to external content and websites',
        'Premium post styling with branded borders',
        'Cross-promotion in weekly group newsletter'
      ],
      benefits: [
        'Guaranteed visibility to all 67K members',
        'Significantly higher engagement rates',
        'Professional post formatting and design',
        'Detailed analytics and performance tracking'
      ],
      popular: false,
      paypalDiscount: false
    },
    {
      id: 'logo_placement',
      name: 'Logo Placement',
      price: 299,
      paypalPrice: 299,
      billing: 'monthly',
      icon: PresentationChartBarIcon,
      color: 'from-rose-500 to-red-500',
      badge: 'BRANDING',
      description: 'Premium logo placement for maximum brand visibility',
      features: [
        'Logo placement on group cover photo',
        'Featured logo in pinned shoutout posts',
        'Brand recognition across all group communications',
        'Monthly brand performance analytics',
        'Priority placement in group directory'
      ],
      benefits: [
        'Continuous brand exposure to 67K members',
        'Professional brand association and recognition',
        'Increased brand recall and customer acquisition',
        'Enhanced credibility through group endorsement'
      ],
      popular: false,
      paypalDiscount: false
    },
    {
      id: 'sponsored_ama',
      name: 'Sponsored AMA',
      price: 499,
      paypalPrice: 499,
      billing: 'per event',
      icon: PhoneIcon,
      color: 'from-pink-500 to-rose-500',
      badge: 'ENGAGEMENT',
      description: 'Host sponsored AMA session with maximum community engagement',
      features: [
        'Dedicated AMA session scheduled at prime time',
        'Professional event promotion across all channels',
        'Custom event graphics and promotional materials',
        'Live moderation and technical support',
        'Post-event analytics and engagement reports'
      ],
      benefits: [
        'Direct access to 67K+ engaged audience',
        'Thought leadership positioning in the community',
        'Generate leads and showcase expertise',
        'Build lasting relationships with industry professionals'
      ],
      popular: false,
      paypalDiscount: false
    },
    {
      id: 'location_report',
      name: 'Custom Location Report',
      price: 99,
      paypalPrice: 99,
      billing: 'per report',
      icon: MapPinIcon,
      color: 'from-cyan-500 to-blue-500',
      badge: 'ANALYSIS',
      description: 'Professional location analysis using SiteAtlas intelligence',
      features: [
        'Complete location intelligence analysis with AI grading',
        'Detailed grade reasoning and scoring methodology',
        'Comprehensive ROI estimates and projections',
        'Extensive competitor mapping and threat analysis',
        'Market timing recommendations and strategy insights'
      ],
      benefits: [
        'Professional-grade market analysis and reports',
        'Data-driven investment decision support',
        'Competitive advantage insights and strategies',
        'Risk assessment and mitigation recommendations'
      ],
      popular: true,
      paypalDiscount: false
    },
    {
      id: 'expansion_consult',
      name: 'Expansion Strategy Consult',
      price: 499,
      paypalPrice: 499,
      billing: 'per session',
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-purple-500',
      badge: 'STRATEGY',
      description: 'One-on-one consultation for multi-location expansion',
      features: [
        '60-minute private consultation session with experts',
        'Multi-location expansion planning and territory analysis',
        'Custom territory analysis and market optimization',
        'Hybrid business modeling and revenue strategies',
        'Personalized growth roadmap with actionable timelines'
      ],
      benefits: [
        'Personalized expansion strategy development',
        'Expert guidance from industry professionals',
        'Detailed action plan with clear timelines',
        'Follow-up support and additional resources'
      ],
      popular: false,
      paypalDiscount: false
    },
    {
      id: 'dashboard_access',
      name: 'Full Dashboard Access',
      price: 999,
      paypalPrice: 999,
      billing: 'monthly',
      icon: PresentationChartBarIcon,
      color: 'from-rose-500 to-red-500',
      badge: 'PREMIUM',
      description: 'Complete access to the LaundroTech intelligence platform',
      features: [
        'Full LaundroTech dashboard access and functionality',
        'Real-time market monitoring and automated alerts',
        'Comprehensive competitive intelligence tracking',
        'Advanced portfolio optimization tools and analytics',
        'Priority support and dedicated account management'
      ],
      benefits: [
        'Comprehensive market intelligence at your fingertips',
        'Automated monitoring and proactive alerts',
        'Data-driven decision making capabilities',
        'Maintain competitive advantage continuously'
      ],
      popular: false,
      paypalDiscount: false
    }
  ];

  const testimonials = [
    {
      name: "Robert Kim",
      role: "Verified Seller",
      badge: "verified_seller",
      content: "The Verified Seller badge increased my listing responses by 300%. Members trust the verification and I get priority visibility. Best $99/month I spend on marketing.",
      revenue: "+300% responses",
      avatar: "RK"
    },
    {
      name: "Jennifer Martinez",
      role: "Vendor Partner", 
      badge: "vendor_partner",
      content: "As a Vendor Partner, I get featured placement and direct access to serious buyers. Generated $25K in new business just last month from group referrals alone.",
      revenue: "$25K/month",
      avatar: "JM"
    },
    {
      name: "Thomas Anderson",
      role: "Verified Funder",
      badge: "verified_funder", 
      content: "The Verified Funder access gives me first look at the best deals before they go public. I've funded 8 locations this year, all from early alerts. ROI speaks for itself.",
      revenue: "8 deals funded",
      avatar: "TA"
    }
  ];

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setShowPayment(true);
  };

  const handleStripePayment = async (offer) => {
    setProcessing(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        offer_type: offer.id,
        platform: 'facebook_group',
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

  const handlePayPalPayment = async (offer) => {
    setProcessing(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        offer_type: offer.id,
        platform: 'facebook_group',
        payment_method: 'paypal'
      });

      console.log('PayPal checkout data:', response.data);
      
      // Show PayPal payment confirmation
      if (response.data.discount_applied) {
        alert(`PayPal checkout for ${offer.name} - $${offer.paypalPrice} (10% discount applied!)`);
      } else {
        alert(`PayPal checkout for ${offer.name} - $${offer.price}`);
      }
    } catch (error) {
      console.error('PayPal checkout error:', error);
      alert('PayPal payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getBadgeColor = (badgeType) => {
    const colors = {
      'verified_seller': 'from-emerald-500 to-green-500',
      'vendor_partner': 'from-blue-500 to-cyan-500', 
      'verified_funder': 'from-purple-500 to-pink-500'
    };
    return colors[badgeType] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to LaundroTech</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Laundromat Exchange</h1>
              <p className="text-xs text-slate-400">67K Member Community</p>
            </div>
            
            <a 
              href="mailto:nick@laundryguys.net" 
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Contact Support
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <UserGroupIcon className="w-24 h-24 text-blue-400 mx-auto mb-8" />
            <h1 className="text-6xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Laundromat Exchange
              </span>
            </h1>
            <p className="text-2xl text-slate-300 font-semibold mb-2">Exclusive Member Benefits</p>
            <p className="text-lg text-slate-400 mb-12">Monetize Your Community Engagement • 67,000+ Active Members</p>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Unlock <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Premium Access</span>
              <br />
              To The Industry's Largest Network
            </h2>
            
            <p className="text-xl text-slate-300 mb-16 max-w-4xl mx-auto">
              Join the elite tier of our 67,000-member community with exclusive badges, features, and opportunities designed for serious professionals
            </p>

            {/* PayPal Discount Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl px-8 py-4 mb-12"
            >
              <BoltIcon className="w-7 h-7 text-yellow-400 mr-4" />
              <div className="text-left">
                <div className="text-yellow-300 font-bold text-lg">Save 10% with PayPal on Badge Subscriptions!</div>
                <div className="text-yellow-400 text-sm">*Discount applies to badges only - Add-ons remain full price</div>
              </div>
            </motion.div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {[
                { label: "Active Members", value: "67K+", icon: UserGroupIcon, color: "text-blue-400" },
                { label: "Monthly Deals", value: "500+", icon: CurrencyDollarIcon, color: "text-green-400" },
                { label: "Success Stories", value: "1.2K+", icon: TrophyIcon, color: "text-yellow-400" },
                { label: "Years Established", value: "8+", icon: StarIcon, color: "text-purple-400" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Monetization Offers Grid */}
      <section id="offers" className="py-20">
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
                  offer.popular ? 'ring-2 ring-cyan-400 shadow-cyan-400/20 shadow-2xl scale-105' : ''
                }`}
              >
                {/* Badges */}
                {offer.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {offer.badge}
                </div>

                {offer.paypalDiscount && (
                  <div className="absolute top-12 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    10% OFF PAYPAL
                  </div>
                )}

                {/* Icon and Header */}
                <div className="text-center mb-6 mt-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${offer.color} flex items-center justify-center`}>
                    <offer.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{offer.name}</h3>
                  
                  {/* Pricing Display */}
                  <div className="space-y-2 mb-3">
                    <div className="text-3xl font-bold">
                      <span className={`bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                        ${offer.price}
                      </span>
                      <span className="text-slate-400 text-lg">/{offer.billing}</span>
                    </div>
                    
                    {offer.paypalDiscount && (
                      <div className="text-yellow-400 font-bold text-lg">
                        ${offer.paypalPrice} with PayPal
                        <span className="text-yellow-300 text-sm ml-2">(Save ${(offer.price - offer.paypalPrice).toFixed(2)}!)</span>
                      </div>
                    )}
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

                {/* Payment Buttons */}
                <div className="space-y-3">
                  {/* PayPal Button (with discount for badges) */}
                  {offer.paypalDiscount ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 text-white relative overflow-hidden"
                      onClick={() => handlePayPalPayment(offer)}
                      disabled={processing}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <BoltIcon className="w-5 h-5" />
                        <span>PayPal - ${offer.paypalPrice} (Save 10%!)</span>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      onClick={() => handlePayPalPayment(offer)}
                      disabled={processing}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <BoltIcon className="w-5 h-5" />
                        <span>PayPal - ${offer.price}</span>
                      </div>
                    </motion.button>
                  )}

                  {/* Stripe Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      offer.popular 
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' 
                        : `bg-gradient-to-r ${offer.color} text-white`
                    }`}
                    onClick={() => handleStripePayment(offer)}
                    disabled={processing}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Credit Card - ${offer.price}</span>
                    </div>
                  </motion.button>
                </div>
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
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Upgrade your membership and unlock exclusive access to deals, insights, and networking opportunities that drive real results
            </p>
            
            <p className="text-slate-400 mb-12">
              Questions? Contact us at <a href="mailto:nick@laundryguys.net" className="text-cyan-400 hover:text-cyan-300 font-medium">nick@laundryguys.net</a>
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
              
              <Link
                to="/"
                className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                Explore LaundroTech Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Footer */}
      <footer className="py-8 bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Group Rules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Member Directory</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">LaundroTech Platform</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Platform Pricing</Link></li>
                <li><a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">Partnership</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-2">
              © 2024 Laundromat Exchange Community. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> Premium memberships provide enhanced community features and networking opportunities. 
              Results and networking success may vary based on individual engagement and market conditions. All purchases are subject to our 
              Terms of Service and Refund Policy. For questions, contact <a href="mailto:nick@laundryguys.net" className="text-cyan-400">nick@laundryguys.net</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FacebookGroupMonetization;