import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SupportCenter = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const supportCategories = [
    { id: 'general', name: 'General Questions', icon: QuestionMarkCircleIcon, color: 'text-blue-400' },
    { id: 'badges', name: 'Badge Management', icon: ShieldCheckIcon, color: 'text-green-400' },
    { id: 'payments', name: 'Payments & Billing', icon: CreditCardIcon, color: 'text-purple-400' },
    { id: 'technical', name: 'Technical Issues', icon: ExclamationTriangleIcon, color: 'text-red-400' },
    { id: 'account', name: 'Account Settings', icon: UserCircleIcon, color: 'text-yellow-400' }
  ];

  const faqData = {
    general: [
      {
        question: "What is the LaundroTech Facebook Group badge system?",
        answer: "Our badge system provides exclusive recognition and features for members of the 67K+ Laundromat Exchange Facebook group. Badges verify your role (seller, vendor, or funder) and unlock premium community features like featured posts, logo placement, and sponsored AMAs."
      },
      {
        question: "How do I join the Facebook group?",
        answer: "The LaundroTech badge system is exclusively for existing members of the Laundromat Exchange Facebook group. If you're not yet a member, you can search for 'Laundromat Exchange' on Facebook and request to join."
      },
      {
        question: "What's the difference between badges and add-on services?",
        answer: "Badges are monthly subscriptions that provide ongoing verification and community status (Verified Seller, Vendor Partner, Verified Funder). Add-on services are one-time or separate monthly services like Featured Posts ($250), Logo Placement ($299/month), and Sponsored AMAs ($499/event)."
      },
      {
        question: "Can I use multiple badges at once?",
        answer: "Yes! You can have multiple active badges simultaneously. For example, you could be both a Verified Seller and a Vendor Partner if you buy and sell equipment while also providing services."
      }
    ],
    badges: [
      {
        question: "How do I activate my badge after payment?",
        answer: "Badge activation is manual and handled by our team. After successful payment, we receive an automatic notification and will activate your badge within 24 hours. You'll receive a confirmation email once active."
      },
      {
        question: "What does each badge tier include?",
        answer: "• Verified Seller ($29/month): Basic verification badge, credibility boost, priority visibility\n• Vendor Partner ($149/month): Enhanced directory listing, lead generation tools, priority support\n• Verified Funder ($299/month): Investment opportunity access, exclusive deal alerts, private investor network access"
      },
      {
        question: "How do I cancel my badge subscription?",
        answer: "You can cancel anytime through your dashboard at /dashboard. Go to the 'Subscriptions' tab and click 'Cancel' next to your active badge. Your badge will remain active until the end of your current billing period."
      },
      {
        question: "Do I get a refund if I cancel mid-month?",
        answer: "Subscriptions are billed monthly in advance. If you cancel mid-month, your badge remains active until the end of that billing period, but you won't be charged for the following month."
      },
      {
        question: "Why isn't my badge showing in the Facebook group?",
        answer: "Badge display requires manual setup by our team. If your payment is confirmed but your badge isn't showing after 24 hours, please contact support at nick@laundrotech.xyz with your payment confirmation."
      }
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept PayPal and all major credit cards through Stripe. PayPal users get a 10% discount on badge subscriptions (badges only, not add-on services)."
      },
      {
        question: "Is the PayPal discount automatic?",
        answer: "Yes! When you choose PayPal for badge subscriptions, the 10% discount is automatically applied. You'll see the discounted price before confirming payment."
      },
      {
        question: "When am I charged for subscriptions?",
        answer: "Badge subscriptions are charged monthly on the same date you first subscribed. For example, if you subscribe on the 15th, you'll be charged on the 15th of each month."
      },
      {
        question: "Can I change my payment method?",
        answer: "Currently, payment method changes require canceling your current subscription and creating a new one. We're working on easier payment management features."
      },
      {
        question: "What happens if my payment fails?",
        answer: "We'll attempt to process failed payments up to 3 times over 7 days. You'll receive email notifications about failed payments. If all attempts fail, your badge will be deactivated until payment is resolved."
      },
      {
        question: "How do I get a receipt for my purchase?",
        answer: "Receipts are automatically emailed to your registered email address after successful payment. You can also download receipts from your dashboard at /dashboard under 'Payment History'."
      }
    ],
    technical: [
      {
        question: "The website isn't loading properly. What should I do?",
        answer: "Try these troubleshooting steps:\n1. Clear your browser cache and cookies\n2. Try a different browser (Chrome, Firefox, Safari)\n3. Disable browser extensions temporarily\n4. Check your internet connection\n5. Try accessing from a different device\n\nIf problems persist, contact support with details about your browser and operating system."
      },
      {
        question: "I can't log into my account",
        answer: "First, make sure you're using the correct email address and password. If you've forgotten your password, use the 'Forgot Password' link on the login form. If you're still having trouble, contact support at nick@laundrotech.xyz."
      },
      {
        question: "My payment went through but I don't see my badge",
        answer: "Badge activation is a manual process that takes up to 24 hours. If it's been longer than 24 hours:\n1. Check your email for confirmation\n2. Log into your dashboard to verify payment status\n3. Contact support with your payment confirmation number"
      },
      {
        question: "The PayPal payment window won't open",
        answer: "This is usually caused by popup blockers. Please:\n1. Disable popup blockers for our site\n2. Try a different browser\n3. Ensure JavaScript is enabled\n4. Try the credit card option through Stripe as an alternative"
      }
    ],
    account: [
      {
        question: "How do I update my profile information?",
        answer: "Go to your dashboard at /dashboard and click on the 'Settings' tab. From there you can update your name, email, and other profile information."
      },
      {
        question: "Can I change my email address?",
        answer: "Email changes require verification for security. Contact support at nick@laundrotech.xyz with your current email, desired new email, and we'll help you update it securely."
      },
      {
        question: "How do I delete my account?",
        answer: "Account deletion is permanent and will cancel all active subscriptions. Contact support at nick@laundrotech.xyz to request account deletion. We'll process this within 48 hours and send confirmation."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes! We use industry-standard encryption and never store payment information on our servers. Payments are processed securely through Stripe and PayPal, both PCI-compliant payment processors."
      }
    ]
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      await axios.post(`${API}/support/contact`, contactForm);
      setSubmitStatus('success');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
      
      setTimeout(() => {
        setSubmitStatus(null);
        setShowContactForm(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    }
  };

  const filteredFAQs = faqData[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to LaundroTech</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Support Center</h1>
              <p className="text-xs text-slate-400">We're here to help</p>
            </div>
            
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm">
              My Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.button
            onClick={() => setShowContactForm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 text-center hover:shadow-lg transition-all"
          >
            <PaperAirplaneIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Contact Support</h3>
            <p className="text-slate-400 text-sm">Get direct help from our team</p>
          </motion.button>

          <motion.a
            href="mailto:nick@laundrotech.xyz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 text-center hover:shadow-lg transition-all block"
          >
            <UserCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Email Nick</h3>
            <p className="text-slate-400 text-sm">nick@laundrotech.xyz</p>
          </motion.a>

          <motion.button
            onClick={() => setActiveCategory('badges')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 text-center hover:shadow-lg transition-all"
          >
            <ShieldCheckIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Badge Help</h3>
            <p className="text-slate-400 text-sm">Common badge questions</p>
          </motion.button>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Contact Support</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Message sent successfully!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Category</label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="general">General Question</option>
                      <option value="badges">Badge Issue</option>
                      <option value="payments">Payment Problem</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Help</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Priority</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                    className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    rows={5}
                    className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitStatus === 'sending'}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="glass-card">
          {/* Search Bar */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeCategory === category.id
                      ? 'border-blue-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ Content */}
          <div className="p-6">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="glass-card p-4">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                      {expandedFAQ === index ? (
                        <ChevronDownIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-600"
                      >
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <QuestionMarkCircleIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p className="text-slate-400 mb-6">
                  {searchQuery ? `No FAQs match "${searchQuery}"` : 'No FAQs available for this category'}
                </p>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Contact Support Instead
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Our support team is here to help with any questions about badges, payments, or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:nick@laundrotech.xyz"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all inline-block"
              >
                Email Support
              </a>
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-slate-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-500 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;