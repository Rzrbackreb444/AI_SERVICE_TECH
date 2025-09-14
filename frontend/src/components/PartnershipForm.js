import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    partnership_type: 'integration',
    description: '',
    revenue_potential: '',
    timeline: '',
    current_customers: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await axios.post(`${API}/business/partnership/submit`, formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        partnership_type: 'integration',
        description: '',
        revenue_potential: '',
        timeline: '',
        current_customers: '',
        website: ''
      });
    } catch (err) {
      setError(true);
      console.error('Partnership form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-white mb-4">Partnership Inquiry Sent!</h2>
          <p className="text-gray-300 mb-6">
            Thanks for your interest in partnering with LaundroTech! Nick will review your proposal and get back to you soon.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
          >
            Submit Another Inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Partner with LaundroTech
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join forces to revolutionize the laundromat industry
          </p>
          <div className="bg-blue-500/20 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-gray-200 text-lg">
              We're always looking for strategic partnerships that can help laundromat operators succeed. 
              Whether you're a technology provider, equipment manufacturer, real estate professional, or 
              service provider, let's explore how we can work together.
            </p>
          </div>
        </motion.div>

        {/* Partnership Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="your.email@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Your company name"
                />
              </div>
            </div>

            {/* Partnership Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Partnership Type *
                </label>
                <select
                  name="partnership_type"
                  value={formData.partnership_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                >
                  <option value="integration">Technology Integration</option>
                  <option value="referral">Referral Partnership</option>
                  <option value="white_label">White Label Solution</option>
                  <option value="data">Data Partnership</option>
                  <option value="equipment">Equipment/Service Provider</option>
                  <option value="real_estate">Real Estate Partnership</option>
                  <option value="affiliate">Affiliate Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>

            {/* Partnership Description */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Partnership Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                placeholder="Describe your partnership proposal in detail. What value would you bring to LaundroTech users? How would this partnership work? What are the mutual benefits?"
              />
            </div>

            {/* Business Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Revenue Potential
                </label>
                <select
                  name="revenue_potential"
                  value={formData.revenue_potential}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                >
                  <option value="">Select range...</option>
                  <option value="under_10k">Under $10k/month</option>
                  <option value="10k_50k">$10k - $50k/month</option>
                  <option value="50k_100k">$50k - $100k/month</option>
                  <option value="100k_500k">$100k - $500k/month</option>
                  <option value="over_500k">Over $500k/month</option>
                  <option value="equity">Equity/Revenue Share</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Preferred Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                >
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediate (1-4 weeks)</option>
                  <option value="short_term">Short-term (1-3 months)</option>
                  <option value="medium_term">Medium-term (3-6 months)</option>
                  <option value="long_term">Long-term (6+ months)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Current Customer Base */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Current Customer Base (Optional)
              </label>
              <textarea
                name="current_customers"
                value={formData.current_customers}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                placeholder="Describe your current customer base, especially any overlap with laundromat operators or commercial real estate..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300">
                  There was an error sending your partnership inquiry. Please try again or contact us directly at nick@laundrotech.xyz
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Submit Partnership Inquiry'
                )}
              </button>
            </div>

            {/* Contact Info */}
            <div className="text-center pt-6 border-t border-gray-600">
              <p className="text-gray-400 mb-2">
                Have questions? Contact us directly:
              </p>
              <p className="text-blue-400 font-medium">
                nick@laundrotech.xyz
              </p>
            </div>

          </form>
        </motion.div>

        {/* Partnership Types */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Partnership Opportunities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-bold text-white mb-2">Technology Integration</h3>
              <p className="text-gray-300 text-sm">
                API integrations, white-label solutions, and technology partnerships
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-bold text-white mb-2">Equipment & Services</h3>
              <p className="text-gray-300 text-sm">
                Laundromat equipment manufacturers, service providers, and suppliers
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-lg font-bold text-white mb-2">Real Estate</h3>
              <p className="text-gray-300 text-sm">
                Commercial real estate brokers, property managers, and developers
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-bold text-white mb-2">Financial Services</h3>
              <p className="text-gray-300 text-sm">
                Lenders, equipment financing, insurance providers, and accounting services
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Data & Analytics</h3>
              <p className="text-gray-300 text-sm">
                Market data providers, demographic services, and business intelligence platforms
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-white mb-2">Affiliate & Referral</h3>
              <p className="text-gray-300 text-sm">
                Industry consultants, business brokers, and affiliate marketing opportunities
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PartnershipForm;