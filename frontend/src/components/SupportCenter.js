import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SupportCenter = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium',
    category: 'technical'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    setTicketForm({
      ...ticketForm,
      [e.target.name]: e.target.value
    });
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(`${API}/business/support/ticket`, ticketForm);
      setSubmitted(true);
      setTicketForm({
        name: '',
        email: '',
        subject: '',
        description: '',
        priority: 'medium',
        category: 'technical'
      });
    } catch (err) {
      setError(true);
      console.error('Support ticket submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How accurate is LaundroTech\'s location analysis?',
          a: 'Our analysis combines real-time data from multiple sources including Google Maps, Census Bureau, ATTOM Data, and our proprietary AI algorithms. We achieve 85-92% accuracy in predicting location success, backed by three generations of Arkansas laundromat expertise.'
        },
        {
          q: 'What data sources do you use?',
          a: 'We integrate data from Google Maps API, Census Bureau demographics, ATTOM property data, Mapbox location intelligence, plus our own database of 67,000+ member insights from Laundromat Exchange community.'
        },
        {
          q: 'How quickly can I get analysis results?',
          a: 'Most basic analyses complete within 2-5 minutes. Enterprise-level comprehensive reports with AI insights take 5-10 minutes depending on location complexity and data availability.'
        }
      ]
    },
    {
      category: 'Pricing & Plans',
      questions: [
        {
          q: 'What subscription tiers are available?',
          a: 'We offer Location Scout (FREE), Real Data Analyzer ($49), Research Intelligence ($99), Portfolio Intelligence ($199), LaundroEmpire Portfolio ($999), and LaundroWatch Pro ($199/month per location).'
        },
        {
          q: 'Can I upgrade or downgrade my plan?',
          a: 'Yes, you can upgrade anytime to access more features. Downgrades take effect at your next billing cycle. All your previous analysis data remains accessible.'
        },
        {
          q: 'Do you offer enterprise pricing?',
          a: 'Yes, we offer custom enterprise solutions starting at $2,999/month including white-label API access, bulk analysis capabilities, and dedicated support.'
        }
      ]
    },
    {
      category: 'AI Consultant',
      questions: [
        {
          q: 'How does the personal AI consultant work?',
          a: 'After completing your location analysis, you get access to a personalized AI consultant trained on your specific location data. It provides ongoing advice, ROI optimization, competition intelligence, and equipment recommendations tailored to your situation.'
        },
        {
          q: 'What consultation tiers are available?',
          a: 'Basic Questions ($29/month), Strategic Advisory ($79/month), and Full Advisory ($199/month). Higher tiers include unlimited questions, all consultant specialties, and real-time research capabilities.'
        },
        {
          q: 'Can the consultant help with existing laundromats?',
          a: 'Absolutely! The consultant provides ongoing optimization advice, equipment upgrade recommendations, competition monitoring, and growth strategies for existing operations.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'What browsers are supported?',
          a: 'LaundroTech works best on Chrome, Firefox, Safari, and Edge. We recommend using the latest browser versions for optimal performance.'
        },
        {
          q: 'Can I access LaundroTech on mobile?',
          a: 'Yes, our platform is fully responsive and works on all mobile devices. We also have native mobile apps in development.'
        },
        {
          q: 'How do I download my analysis reports?',
          a: 'Premium PDF reports are available for download from your dashboard. Click the "Generate PDF Report" button next to any completed analysis.'
        }
      ]
    }
  ];

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Support Ticket Created!</h2>
          <p className="text-gray-300 mb-6">
            Your support ticket has been submitted successfully. Our team will get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
          >
            Back to Support
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-300">
            Get help, find answers, and connect with our team
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton
            id="faq"
            label="FAQ"
            active={activeTab === 'faq'}
            onClick={setActiveTab}
          />
          <TabButton
            id="ticket"
            label="Create Ticket"
            active={activeTab === 'ticket'}
            onClick={setActiveTab}
          />
          <TabButton
            id="contact"
            label="Contact Info"
            active={activeTab === 'contact'}
            onClick={setActiveTab}
          />
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: faqIndex * 0.1 }}
                      className="border-b border-gray-600 pb-4 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">{faq.q}</h3>
                      <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Create Ticket Section */}
        {activeTab === 'ticket' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create Support Ticket</h2>
            
            <form onSubmit={handleTicketSubmit} className="space-y-6">
              
              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={ticketForm.name}
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
                    value={ticketForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Ticket Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={ticketForm.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="account">Account Management</option>
                    <option value="feature">Feature Request</option>
                    <option value="data">Data Questions</option>
                    <option value="consultant">AI Consultant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={ticketForm.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Normal support</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - Service down</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={ticketForm.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Brief description of your issue"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={ticketForm.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce, error messages, and any other relevant details..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-300">
                    There was an error creating your support ticket. Please try again or contact us directly at nick@laundrotech.xyz
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
                      Creating Ticket...
                    </>
                  ) : (
                    'Create Support Ticket'
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* Contact Info Section */}
        {activeTab === 'contact' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📧</div>
                  <div>
                    <p className="text-gray-300 font-medium">Email Support</p>
                    <p className="text-blue-400">nick@laundrotech.xyz</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <p className="text-gray-300 font-medium">Response Time</p>
                    <p className="text-white">Within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏢</div>
                  <div>
                    <p className="text-gray-300 font-medium">Location</p>
                    <p className="text-white">Arkansas, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Community Support</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">👥</div>
                  <div>
                    <p className="text-gray-300 font-medium">Laundromat Exchange</p>
                    <p className="text-white">67,000+ Member Community</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <p className="text-gray-300 font-medium">Discussion Forums</p>
                    <p className="text-white">Get help from peers</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📚</div>
                  <div>
                    <p className="text-gray-300 font-medium">Knowledge Base</p>
                    <p className="text-white">Comprehensive guides</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default SupportCenter;