import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  BoltIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnhancedConsultantWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({
    stage: 'prospect', // prospect, new_owner, experienced_owner
    interests: [],
    goals: [],
    experience_level: 'beginner'
  });
  const [consultantPersona, setConsultantPersona] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize consultant based on user authentication status
  useEffect(() => {
    if (isAuthenticated && user && !consultantPersona) {
      initializePersonalizedConsultant();
    } else if (!isAuthenticated && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        message: "Hi! I'm your LaundroTech consultant. Are you currently a laundromat owner or exploring investment opportunities?",
        timestamp: new Date(),
        quickActions: [
          { text: 'Current Owner', action: 'current_owner' },
          { text: 'Exploring Investment', action: 'prospective_owner' }
        ]
      }]);
    }
  }, [isAuthenticated, user, consultantPersona, messages.length]);

  const initializePersonalizedConsultant = async () => {
    try {
      // Use the new enhanced consultant system
      const response = await axios.get(`${API}/consultant/initialize`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data?.success) {
        setConsultantPersona(response.data);
        setMessages([{
          id: 1,
          type: 'bot',
          message: response.data.welcome_message,
          timestamp: new Date(),
          quickActions: [
            { text: 'Location Analysis', action: 'location_analysis' },
            { text: 'Investment Advice', action: 'investment_advice' },
            { text: 'ROI Calculator', action: 'roi' },
            { text: 'Market Research', action: 'market_research' }
          ]
        }]);
      }
    } catch (error) {
      console.log('Enhanced consultant not available, using fallback');
      setMessages([{
        id: 1,
        type: 'bot',
        message: `Welcome! Are you currently a laundromat owner or exploring investment opportunities?`,
        timestamp: new Date(),
        quickActions: [
          { text: 'Current Owner', action: 'current_owner' },
          { text: 'Exploring Investment', action: 'prospective_owner' }
        ]
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let response;
      if (isAuthenticated && consultantPersona) {
        // Use personalized consultant API
        response = await axios.post(`${API}/consultant/ask`, {
          question: inputMessage,
          consultation_tier: user?.subscription_tier || 'basic_questions'
        });
      } else {
        // Use guide mode with intelligent responses
        response = { data: { response: await generateIntelligentResponse(inputMessage) } };
      }

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: response.data.response || response.data.message,
        timestamp: new Date(),
        quickActions: generateContextualActions(inputMessage)
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: await generateIntelligentResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateIntelligentResponse = async (userInput) => {
    const input = userInput.toLowerCase();
    
    // Real Listings Feature
    if (input.includes('listings') || input.includes('properties') || input.includes('for sale')) {
      try {
        const response = await axios.get(`${API}/listings/personalized`);
        if (response.data.success) {
          const listings = response.data.listings;
          const userLocation = response.data.user_location;
          
          let locationMessage = '';
          if (userLocation) {
            locationMessage = `**📍 Opportunities near ${userLocation.city}, ${userLocation.state}:**\n\n`;
          } else {
            locationMessage = `**🏢 Current Laundromat Opportunities:**\n\n`;
          }
          
          let listingsText = '';
          listings.slice(0, 4).forEach((listing, index) => {
            listingsText += `**${index + 1}. ${listing.title}**\n`;
            listingsText += `📍 ${listing.location}\n`;
            listingsText += `💰 ${listing.price} | Revenue: ${listing.revenue}\n`;
            listingsText += `📊 Cash Flow: ${listing.cash_flow}\n`;
            if (listing.square_footage) {
              listingsText += `📐 ${listing.square_footage}${listing.equipment_count ? ` | ${listing.equipment_count}` : ''}\n`;
            }
            listingsText += `🔗 Source: ${listing.source}\n`;
            listingsText += `_${listing.description.substring(0, 80)}..._\n\n`;
          });
          
          return locationMessage + listingsText + "**Want me to analyze any of these locations?**\nJust say 'Analyze [city name]' and I'll run our full intelligence report!";
        }
      } catch (error) {
        console.log('Using demo listings');
      }
      
      return `**🏢 Current Laundromat Opportunities:**

**1. Profitable Laundromat - High Traffic Location**
📍 Little Rock, Arkansas
💰 $425,000 | Revenue: $180,000/year
📊 Cash Flow: $85,000/year
🔗 Source: BizBuySell
📐 2,400 sq ft | 60 machines
_Established 15 years, 32 washers, 28 dryers, strip mall location..._

**2. Modern Coin Laundry - Turn Key Operation**
📍 Dallas, Texas  
💰 $650,000 | Revenue: $285,000/year
📊 Cash Flow: $125,000/year
🔗 Source: BizQuest
📐 3,200 sq ft | 75 machines
_Recently renovated with latest equipment, card payment systems..._

**3. Established Laundromat Chain - 3 Locations**
📍 Phoenix, Arizona
💰 $950,000 | Revenue: $420,000/year
📊 Cash Flow: $185,000/year
🔗 Source: BusinessBroker.net
📐 8,500 sq ft total | 180+ machines
_Portfolio of 3 profitable locations, excellent management..._

**Want me to analyze any of these locations?**
Just say 'Analyze [location name]' and I'll run our full intelligence report!`;
    }

    // Location Analysis Integration
    if (input.includes('analyze') && (input.includes('little rock') || input.includes('dallas') || input.includes('phoenix'))) {
      const location = input.includes('little rock') ? 'Little Rock, Arkansas' :
                     input.includes('dallas') ? 'Dallas, Texas' : 'Phoenix, Arizona';
      
      return `**🎯 Analysis Request for ${location}**

I'll run our comprehensive 156-point analysis for this location:

**What You'll Get:**
• Demographics & population analysis
• Competition mapping & market gaps  
• Traffic patterns & accessibility scoring
• Financial projections & ROI estimates
• Success probability rating

**Analysis Tiers:**
• **Free Location Scout:** Basic market overview
• **Market Analyzer ($29/month):** Detailed 20-page report
• **Business Intelligence ($79/month):** Competition intelligence + ongoing monitoring

**Ready to proceed?** 
Upgrade to Market Analyzer for the full investment analysis of this ${location.split(',')[0]} opportunity!`;
    }
    if (input.includes('help') || input.includes('support') || input.includes('problem') || input.includes('issue')) {
      return `**Customer Support - How can I help?**

**Common Issues:**
• Account & billing questions
• Technical support & troubleshooting  
• Feature explanations & tutorials
• Subscription management

**Quick Solutions:**
• Reset password → Account Settings
• Update payment → Billing tab
• Download reports → Analysis History
• Cancel subscription → Contact support

What specific issue are you experiencing?`;
    }

    if (input.includes('how') && (input.includes('work') || input.includes('platform') || input.includes('site'))) {
      return `**How LaundroTech Works:**

**Step 1:** Enter any address you're interested in
**Step 2:** Our AI analyzes 156+ data points instantly
**Step 3:** Get detailed reports with success probability scores
**Step 4:** Access ongoing market intelligence & updates

**What We Analyze:**
• Demographics & population density
• Competition mapping & market gaps
• Traffic patterns & accessibility
• Financial projections & ROI estimates

**Free vs Paid:**
• **Free Location Scout:** Basic analysis for any address
• **Paid Tiers:** Detailed reports, ongoing monitoring, advanced features

Want to try analyzing a location right now?`;
    }

    if (input.includes('pricing') || input.includes('cost') || input.includes('price') || input.includes('how much')) {
      return `**LaundroTech Pricing:**

**🆓 Location Scout (FREE)**
• Basic location analysis
• Market score overview
• Limited monthly analyses

**💼 Market Analyzer ($29/month)**
• Detailed demographics & competition reports
• Financial modeling & ROI projections
• Unlimited analyses

**🚀 Business Intelligence ($79/month)**
• Everything in Market Analyzer
• Real-time monitoring & alerts
• Advanced competitive intelligence
• Business valuation tools

**🏢 Enterprise Analysis ($199/month)**
• Multi-location portfolio management
• Custom reports & white-label options
• Priority support & consultation

Ready to upgrade for more detailed analysis?`;
    }

    if (input.includes('features') || input.includes('what can') || input.includes('capabilities') || input.includes('demo')) {
      return `**LaundroTech Platform Features:**

**🎯 Location Intelligence**
• 156+ data point analysis
• Demographics & foot traffic
• Competition mapping
• Success probability scoring

**📊 Market Research**
• Real-time market monitoring
• Competitive intelligence reports  
• Trend analysis & alerts
• Investment opportunity identification

**💰 Financial Tools**
• ROI calculators & projections
• Business valuation models
• Equipment upgrade analysis
• Revenue optimization strategies

**📱 Advanced Features**
• Mobile-responsive dashboard
• PDF report generation
• API access for developers
• White-label solutions

Want me to show you any specific feature in action?`;
    }

    if (input.includes('billing') || input.includes('payment') || input.includes('subscription') || input.includes('cancel')) {
      return `**Billing & Subscription Help:**

**Payment Issues:**
• Update payment method → Account Settings → Billing
• Failed payment → Check card details & retry
• Billing questions → Contact support directly

**Subscription Management:**
• Upgrade/downgrade → Account Settings
• Cancel anytime → No long-term contracts
• Pause subscription → Available for certain tiers

**Payment Methods:**
• Credit/debit cards (Stripe)
• PayPal (additional discounts available)
• Enterprise invoicing available

**Need immediate help?** 
Contact support@laundrotech.com or use the chat for urgent billing issues.`;
    }

    if (input.includes('account') || input.includes('login') || input.includes('password') || input.includes('forgot')) {
      return `**Account Support:**

**Login Issues:**
• Forgot password → Use "Reset Password" link
• Account locked → Try again in 15 minutes
• Email not recognized → Check spelling or create new account

**Account Management:**
• Update profile → Account Settings
• Change email → Contact support
• Delete account → Account Settings → Delete Account

**Security:**
• Use strong, unique passwords
• Enable 2FA if available
• Contact us immediately for suspicious activity

**Still having trouble?** 
I can escalate to our technical support team right away.`;
    }

    // Current Owner Path
    if (input.includes('current owner') || input.includes('i own') || input.includes('my laundromat')) {
      updateUserProfile({ stage: 'current_owner' });
      return `Perfect! As a current owner, I can help you with:

**Competition Intelligence** - Analyze competitors in your area
**Business Valuation** - What's your laundromat worth today?
**ROI Analysis** - Equipment upgrades and expansion potential

What would you like to explore first?`;
    }

    // Prospective Owner Path
    if (input.includes('prospective') || input.includes('exploring') || input.includes('investment')) {
      updateUserProfile({ stage: 'prospective_owner' });
      
      // Try to get user's location for personalized messaging
      try {
        const response = await axios.get(`${API}/listings/personalized`);
        if (response.data.success && response.data.user_location) {
          const location = response.data.user_location;
          return `Great! I help investors find profitable laundromat opportunities.

**I detected you're in ${location.city}, ${location.state}** - let me show you what's available:

**Personalized Listings** - Current laundromats for sale in your area
**Location Analysis** - Analyze any address for investment potential
**Market Research** - Local demographics, competition, and success probability  
**Financial Modeling** - ROI projections and investment requirements

Would you like to see listings near you or analyze a specific location?`;
        }
      } catch (error) {
        // Fallback to generic message
      }
      
      return `Great! I help investors find profitable laundromat opportunities.

**Location Analysis** - Analyze any address for investment potential
**Market Research** - Demographics, competition, and success probability  
**Real Listings** - Current laundromats for sale with instant analysis
**Financial Modeling** - ROI projections and investment requirements

Would you like to see current listings or analyze a specific location?`;
    }

    // Competition Intelligence (Current Owners)
    if (input.includes('competition') && userProfile.stage === 'current_owner') {
      return `**Competition Intelligence for Your Laundromat:**

I'll analyze competitors within 1-3 miles of your location:
• Equipment comparison (age, capacity, pricing)
• Service gaps and opportunities
• Market positioning strategies
• Pricing optimization recommendations

**Upgrade to Business Intelligence ($79/month) for:**
• Full competitive analysis reports
• Real-time market monitoring
• Equipment ROI calculators

What's your laundromat address?`;
    }

    // Location Analysis (Prospective Owners)
    if (input.includes('location') && userProfile.stage === 'prospective_owner') {
      return `**Location Analysis for Investment:**

I analyze 156+ data points for any address:
• Demographics and population density
• Competition mapping and saturation
• Traffic patterns and accessibility
• Success probability scoring

**Free Location Scout** gives you basic analysis
**Market Analyzer ($29/month)** provides detailed reports

What address would you like me to analyze?`;
    }

    // Valuation requests
    if (input.includes('valuation') || input.includes('worth')) {
      if (userProfile.stage === 'current_owner') {
        return `**Business Valuation for Current Owners:**

I use 3 methods to value your laundromat:
• Asset-based valuation (equipment + real estate)
• Income-based analysis (cash flow multiples)
• Market comparison (recent sales data)

**Business Intelligence tier ($79/month) includes:**
• Quarterly valuation updates
• Market value tracking
• Equipment depreciation analysis

What's your current monthly revenue?`;
      } else {
        return `**Investment Valuation Analysis:**

Before you buy, I'll help you determine fair market value:
• Due diligence checklist
• Cash flow verification
• Market value assessment
• ROI projections

**Market Analyzer ($29/month) provides:**
• Detailed valuation reports
• Investment analysis tools
• Risk assessment

What property are you considering?`;
      }
    }

    // Default response with upgrade path
    return `I can help you with:

**${userProfile.stage === 'current_owner' ? 'Current Owners' : 'Prospective Investors'}:**
• ${userProfile.stage === 'current_owner' ? 'Competition intelligence' : 'Location analysis'}
• ${userProfile.stage === 'current_owner' ? 'Business valuation' : 'Market research'}
• ${userProfile.stage === 'current_owner' ? 'ROI optimization' : 'Investment modeling'}

**Platform Support:**
• Features & capabilities
• Pricing & billing questions
• Technical support
• Account management

What specific question do you have?`;
  };

  const generateContextualActions = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('support') || input.includes('help') || input.includes('problem')) {
      return [
        { text: 'Billing Questions', action: 'billing' },
        { text: 'Technical Support', action: 'support' },
        { text: 'Account Issues', action: 'account' },
        { text: 'Feature Demo', action: 'demo' }
      ];
    }
    
    if (input.includes('pricing') || input.includes('cost')) {
      return [
        { text: 'View All Plans', action: 'pricing' },
        { text: 'Free Trial', action: 'demo' },
        { text: 'Feature Comparison', action: 'features' },
        { text: 'Upgrade Benefits', action: 'upgrade' }
      ];
    }
    
    if (input.includes('current owner')) {
      return [
        { text: 'Competition Analysis', action: 'competition_analysis' },
        { text: 'Business Valuation', action: 'valuation' },
        { text: 'ROI Calculator', action: 'roi' },
        { text: 'Market Intelligence', action: 'market_intel' }
      ];
    }
    
    if (input.includes('prospective') || input.includes('exploring')) {
      return [
        { text: 'View Current Listings', action: 'listings' },
        { text: 'Analyze Location', action: 'location_analysis' },
        { text: 'Market Research', action: 'research' },
        { text: 'Investment Calculator', action: 'roi' }
      ];
    }
    
    // Default actions for general inquiries
    return [
      { text: 'Platform Demo', action: 'demo' },
      { text: 'Pricing Plans', action: 'pricing' },
      { text: 'Location Analysis', action: 'location_analysis' },
      { text: 'Get Support', action: 'support' }
    ];
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch(action) {
      case 'current_owner':
        message = 'I\'m a current laundromat owner';
        updateUserProfile({ stage: 'current_owner' });
        break;
      case 'prospective_owner':
        message = 'I\'m exploring laundromat investment opportunities';
        updateUserProfile({ stage: 'prospective_owner' });
        break;
      case 'listings':
        message = 'Show me current laundromat listings for sale';
        break;
      case 'analyze_listing':
        message = 'I want to analyze one of these listings';
        break;
      case 'competition_analysis':
        message = 'I want competition intelligence for my laundromat';
        break;
      case 'location_analysis':
        message = 'I want to analyze a new location for investment';
        break;
      case 'valuation':
        message = 'How much is my laundromat worth?';
        break;
      case 'roi':
        message = 'I want to analyze equipment ROI and upgrade potential';
        break;
      case 'pricing':
        message = 'What are your pricing plans?';
        break;
      case 'features':
        message = 'What features does the platform have?';
        break;
      case 'support':
        message = 'I need help with my account';
        break;
      case 'demo':
        message = 'Can you show me how the platform works?';
        break;
      default:
        message = 'I need help with my laundromat business';
    }
    setInputMessage(message);
    handleSendMessage();
  };

  const getConsultantBadge = () => {
    if (!isAuthenticated) {
      return { icon: UserIcon, label: 'Intelligence Guide', color: 'from-blue-500 to-cyan-500' };
    }
    
    const tier = user?.subscription_tier || 'free';
    const badges = {
      'free': { icon: MapPinIcon, label: 'Location Scout Guide', color: 'from-slate-500 to-slate-600' },
      'analyzer': { icon: ChartBarIcon, label: 'Market Analyst', color: 'from-blue-500 to-blue-600' },
      'intelligence': { icon: BoltIcon, label: 'Business Intelligence', color: 'from-cyan-500 to-emerald-500' },
      'optimization': { icon: SparklesIcon, label: 'Optimization Expert', color: 'from-purple-500 to-pink-500' },
      'portfolio': { icon: CurrencyDollarIcon, label: 'Portfolio Advisor', color: 'from-orange-500 to-red-500' }
    };
    return badges[tier] || badges.free;
  };

  const badge = getConsultantBadge();
  const BadgeIcon = badge.icon;

  return (
    <>
      {/* Enhanced positioning with maximum z-index */}
      <div className="fixed bottom-6 right-6" style={{ zIndex: 999999 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mb-4 w-96 h-[500px] bg-slate-900/98 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
              style={{ zIndex: 999999 }}
            >
              {/* Enhanced Header */}
              <div className={`bg-gradient-to-r ${badge.color} p-4 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <BadgeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">LaundroTech AI</h3>
                    <p className="text-white/90 text-xs font-medium">{badge.label}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-3">
                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-slate-800/80 text-slate-100 shadow-md border border-slate-700/30'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.message}</div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {msg.quickActions && msg.type === 'bot' && (
                      <div className="flex flex-wrap gap-2 px-2">
                        {msg.quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(action.action)}
                            className="bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-lg transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/30">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isAuthenticated ? "Ask about valuations, ROI, competition..." : "Ask about locations, pricing, analysis..."}
                    className="flex-1 bg-slate-800/60 text-white placeholder-slate-400 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border border-slate-700/50 focus:border-cyan-400/50 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r ${badge.color} text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]`}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 bg-gradient-to-r ${badge.color} text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-all relative overflow-hidden`}
          style={{ zIndex: 10000 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="w-7 h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatBubbleLeftRightIcon className="w-7 h-7" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Smart notification indicator */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </div>
    </>
  );
};

export default EnhancedConsultantWidget;