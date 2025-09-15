import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';
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
      // This would connect to your consultant API
      const response = await axios.get(`${API}/consultant/profile`);
      if (response.data?.consultant_profile) {
        setConsultantPersona(response.data.consultant_profile);
        setMessages([{
          id: 1,
          type: 'bot',
          message: `Welcome back! I'm your personalized LaundroTech consultant. Are you looking to analyze competition for your current laundromat or explore new investment opportunities?`,
          timestamp: new Date(),
          quickActions: [
            { text: 'Competition Intelligence', action: 'competition_analysis' },
            { text: 'New Location Analysis', action: 'location_analysis' },
            { text: 'Business Valuation', action: 'valuation' },
            { text: 'ROI Calculator', action: 'roi' }
          ]
        }]);
      }
    } catch (error) {
      console.log('Consultant not yet initialized, using guide mode');
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
      return `Great! I help investors find profitable laundromat opportunities.

**Location Analysis** - Analyze any address for investment potential
**Market Research** - Demographics, competition, and success probability
**Financial Modeling** - ROI projections and investment requirements

Ready to analyze a specific location?`;
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

What specific question do you have?`;
  };

  const generateContextualActions = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('valuation') || input.includes('worth')) {
      return [
        { text: 'Analyze My Property', action: 'analyze' },
        { text: 'Equipment ROI Calculator', action: 'equipment_roi' },
        { text: 'Market Comparison', action: 'market_comp' },
        { text: 'Growth Strategies', action: 'growth' }
      ];
    }
    
    if (input.includes('competition') || input.includes('market')) {
      return [
        { text: 'Competition Analysis', action: 'competition' },
        { text: 'Market Intelligence', action: 'market_intel' },
        { text: 'Positioning Strategy', action: 'positioning' },
        { text: 'Opportunity Mapping', action: 'opportunities' }
      ];
    }
    
    return [
      { text: 'Location Analysis', action: 'location' },
      { text: 'ROI Calculator', action: 'roi' },
      { text: 'Market Research', action: 'research' },
      { text: 'Get Pricing', action: 'pricing' }
    ];
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch(action) {
      case 'exploring':
        message = 'I\'m exploring laundromat investment opportunities';
        updateUserProfile({ stage: 'prospect', interests: ['investment'] });
        break;
      case 'owner':
        message = 'I own laundromats and want to optimize my operations';
        updateUserProfile({ stage: 'owner', interests: ['optimization'] });
        break;
      case 'valuation':
        message = 'How much is my laundromat worth?';
        break;
      case 'roi':
        message = 'I want to analyze equipment ROI and upgrade potential';
        break;
      case 'competition':
        message = 'Tell me about my competition and market positioning';
        break;
      case 'analytics':
        message = 'Show me performance analytics for my business';
        break;
      case 'location':
        message = 'I want to analyze a specific location';
        break;
      case 'equipment':
        message = 'Help me with equipment planning and ROI analysis';
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