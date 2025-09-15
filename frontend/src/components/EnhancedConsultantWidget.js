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
        message: `Welcome! I'm your personal LaundroTech consultant. Let me learn about your business goals so I can provide the most relevant guidance. Are you currently exploring laundromat investments or do you already own facilities?`,
        timestamp: new Date(),
        quickActions: [
          { text: 'Exploring Investment', action: 'exploring' },
          { text: 'Current Owner', action: 'owner' },
          { text: 'Industry Research', action: 'research' },
          { text: 'Equipment Planning', action: 'equipment' }
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
    
    // Analyze user intent and adapt response
    if (input.includes('own') || input.includes('have') || input.includes('my laundromat')) {
      updateUserProfile({ stage: 'owner' });
      return `Perfect! As a laundromat owner, I can help you with advanced analytics and optimization strategies. Here's what I can assist with:

**Business Intelligence:**
• Real-time valuation tracking
• Equipment ROI analysis and forecasting
• Competition monitoring and market positioning
• Performance analytics and optimization recommendations

**Immediate Value:**
• Current market value assessment
• Equipment upgrade impact analysis
• Revenue optimization strategies
• Operational efficiency insights

What specific aspect of your business would you like to explore first?`;
    }

    if (input.includes('exploring') || input.includes('looking') || input.includes('thinking about')) {
      updateUserProfile({ stage: 'prospect' });
      return `Excellent! Exploring laundromat investments is exciting. I'll guide you through the key factors that determine success:

**Critical Success Factors:**
• Location intelligence (demographics, competition, traffic)
• Market timing and saturation analysis
• Financial modeling and ROI projections
• Due diligence and valuation methods

**Our Process:**
1. **Location Analysis** - We analyze 156+ data points for any address
2. **Market Intelligence** - Demographics, competition, and opportunity assessment  
3. **Financial Modeling** - ROI projections and investment analysis
4. **Success Probability** - AI-powered success predictions

Would you like to start with a specific location analysis, or learn more about our market intelligence capabilities?`;
    }

    if (input.includes('valuation') || input.includes('worth') || input.includes('value')) {
      return `**Laundromat Valuation Methods I Use:**

**1. Asset-Based Valuation**
• Equipment depreciation analysis
• Real estate value assessment
• Net tangible asset calculations

**2. Income-Based Valuation (DCF)**
• Cash flow projections and analysis
• Risk-adjusted return calculations
• Present value of future earnings

**3. Market Multiples Method**
• Industry EBITDA multiples (typically 3-5x for laundromats)
• Comparable sales analysis
• Market position adjustments

**Typical Valuation Ranges:**
• Small laundromats (20-30 machines): $150K-$400K
• Medium operations (40-60 machines): $400K-$800K
• Large facilities (60+ machines): $800K-$2M+

**Key Value Drivers:**
• Location demographics and foot traffic
• Equipment age and efficiency
• Lease terms and rent stability
• Revenue per machine and profit margins

Would you like me to help you assess a specific property or understand the valuation process for your current operation?`;
    }

    if (input.includes('equipment') || input.includes('washer') || input.includes('dryer') || input.includes('roi')) {
      return `**Equipment ROI Analysis & Recommendations:**

**Top Commercial Brands (2024):**
• **Speed Queen**: Premium durability, $1,500-$7,000+ per unit
• **Maytag**: Balanced features/price, advanced controls
• **Huebsch**: High-volume capacity, $6,500-$13,000 for premium units

**ROI Calculation Formula:**
ROI = (Annual Net Benefit ÷ Equipment Cost) × 100%

**Typical ROI Scenarios:**
• **High-efficiency washers**: 200-400% ROI in year 1
• **Large capacity machines**: 300-500% ROI potential
• **Card payment systems**: 415% ROI average (reduces coin handling)

**Value-Add Equipment Analysis:**
Adding 2x 40lb washers + 2x 50lb dryers in optimal locations typically:
• Increases monthly revenue: $2,400-$4,200
• Equipment investment: $20,000-$35,000
• Payback period: 8-15 months
• Annual ROI: 80-150%

**Location-Specific Factors:**
• Demographics (income levels, family size)
• Competition density and equipment age
• Foot traffic patterns and accessibility
• Utility costs and operational efficiency

Would you like me to run a specific equipment ROI analysis for your location or help you evaluate upgrade opportunities?`;
    }

    if (input.includes('competition') || input.includes('market') || input.includes('competitors')) {
      return `**Competitive Intelligence & Market Analysis:**

**What I Analyze:**
• Competitor locations within 1-3 mile radius
• Equipment capacity, age, and pricing
• Service gaps and differentiation opportunities
• Market saturation and timing analysis

**Competitive Advantages I Identify:**
• **Service Gaps**: Extended hours, premium equipment, amenities
• **Pricing Strategy**: Optimal pricing vs. competition
• **Location Benefits**: Accessibility, parking, visibility
• **Technology Edge**: Card systems, app integration, loyalty programs

**Market Positioning Strategies:**
• **Premium Positioning**: High-end equipment, superior experience
• **Convenience Focus**: Extended hours, multiple locations
• **Value Strategy**: Competitive pricing with solid service
• **Niche Targeting**: Families, students, professionals

**Real Market Intelligence:**
Using Google Maps, Mapbox, and demographic data, I can identify:
• Underserved areas with population growth
• Competitor weaknesses and service gaps
• Optimal pricing strategies for your market
• Equipment upgrade opportunities vs. competition

**Sample Competitive Analysis:**
*"In your 2-mile radius, I found 4 competitors with average machine age of 8+ years, limited payment options, and no extended hours. This presents a premium positioning opportunity with 40-60% revenue premium potential."*

Want me to run a competitive analysis for a specific area you're considering?`;
    }

    // Default intelligent response
    return `I understand you're interested in laundromat intelligence. Based on our conversation, I can help you with:

**For Prospects:**
• Location analysis and market assessment
• Investment ROI modeling and financial projections
• Competition intelligence and positioning strategy
• Success probability analysis

**For Owners:**
• Business valuation and performance tracking
• Equipment ROI analysis and upgrade planning
• Competitive positioning and market intelligence
• Revenue optimization and growth strategies

**Advanced Analytics:**
• Real-time performance dashboards
• Predictive analytics and trend forecasting
• Custom KPI tracking and reporting
• Market opportunity identification

What specific area would you like to explore? I can provide detailed analysis and actionable recommendations tailored to your situation.`;
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