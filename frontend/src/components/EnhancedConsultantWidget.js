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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnhancedConsultantWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState('welcome');
  const [userInfo, setUserInfo] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Smart welcome messages based on current page
  const getContextualWelcome = () => {
    const path = location.pathname;
    
    if (path === '/analyze') {
      return {
        message: "👋 Ready to analyze a location? I can help you choose the right analysis tier and get started!",
        buttons: [
          { text: "🆓 Start Free Preview", action: "free_preview", primary: true },
          { text: "💡 Which tier is right for me?", action: "tier_help" },
          { text: "❓ How does this work?", action: "how_it_works" }
        ]
      };
    }
    
    if (path === '/marketplace') {
      return {
        message: "🏢 Browsing the marketplace? Let me help you find the perfect laundromat investment opportunity!",
        buttons: [
          { text: "🔍 Help me find listings", action: "find_listings" },
          { text: "📊 Get location analysis first", action: "suggest_analysis" },
          { text: "💰 What should I look for?", action: "investment_tips" }
        ]
      };
    }
    
    if (path.includes('case-study')) {
      return {
        message: "📈 Impressed by our analysis examples? Let me show you how to get this level of intelligence for your investment!",
        buttons: [
          { text: "🚀 Get My Analysis", action: "start_analysis", primary: true },
          { text: "💵 See pricing options", action: "show_pricing" },
          { text: "❓ How accurate are these?", action: "accuracy_question" }
        ]
      };
    }
    
    // Default homepage welcome
    return {
      message: "👋 Welcome to LaundroTech! I'm here to help you make smarter laundromat investment decisions. What brings you here today?",
      buttons: [
        { text: "🎯 I want to analyze a location", action: "start_analysis", primary: true },
        { text: "🏢 I'm browsing investments", action: "browse_marketplace" },
        { text: "❓ What exactly do you do?", action: "explain_service" },
        { text: "💰 What does this cost?", action: "show_pricing" }
      ]
    };
  };

  // Initialize chat with contextual welcome
  useEffect(() => {
    if (!messages.length) {
      setTimeout(() => {
        const welcome = getContextualWelcome();
        addMessage('bot', welcome.message, welcome.buttons);
      }, 1000);
    }
  }, [location.pathname]);

  // Show notification for new visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem('laundrotech_visited');
    if (!hasVisited && !isOpen) {
      setTimeout(() => {
        setShowNotification(true);
        localStorage.setItem('laundrotech_visited', 'true');
      }, 3000);
    }
  }, []);

  const addMessage = (sender, content, buttons = null, typing = false) => {
    const message = {
      id: Date.now(),
      sender,
      content,
      buttons,
      timestamp: new Date(),
      typing
    };
    
    setMessages(prev => [...prev, message]);
    
    if (typing) {
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id ? { ...msg, typing: false } : msg
          )
        );
      }, 1500);
    }
  };

  const handleQuickAction = async (action) => {
    setIsTyping(true);
    
    // Add user selection to chat
    const actionText = getActionText(action);
    addMessage('user', actionText);
    
    setTimeout(async () => {
      setIsTyping(false);
      await processAction(action);
    }, 800);
  };

  const getActionText = (action) => {
    const actionMap = {
      'free_preview': 'I want to try the free preview',
      'tier_help': 'Which analysis tier should I choose?',
      'how_it_works': 'How does your analysis work?',
      'start_analysis': 'I want to get a location analysis',
      'show_pricing': 'Show me your pricing',
      'explain_service': 'What exactly do you do?',
      'find_listings': 'Help me find good listings',
      'investment_tips': 'What should I look for in an investment?',
      'browse_marketplace': 'I want to browse investments',
      'accuracy_question': 'How accurate are your analyses?',
      'suggest_analysis': 'I should get analysis first',
      'get_contact': 'I want to speak with someone',
      'schedule_call': 'Schedule a consultation call'
    };
    return actionMap[action] || action;
  };

  const processAction = async (action) => {
    switch (action) {
      case 'free_preview':
        addMessage('bot', "🎉 Perfect! The free preview gives you a location grade and basic competition overview. Just enter any address and I'll show you what we can do!", [
          { text: "🚀 Start Free Analysis", action: "navigate_analyze", primary: true },
          { text: "💡 Tell me more first", action: "explain_free" }
        ]);
        break;

      case 'tier_help':
        addMessage('bot', "Great question! Here's how to choose:\n\n🆓 **Free Preview** - Just curious? Get a basic grade\n💡 **Market Intelligence ($897)** - Ready to invest? Get full analysis\n💎 **Investment Grade ($2,497)** - Serious investor? Get executive package\n\nWhat's your investment budget range?", [
          { text: "Under $500K", action: "suggest_market_intel" },
          { text: "$500K - $1M", action: "suggest_investment_grade" },
          { text: "Over $1M", action: "suggest_portfolio" },
          { text: "Just browsing", action: "suggest_free" }
        ]);
        break;

      case 'how_it_works':
        addMessage('bot', "🔬 Here's our process:\n\n1️⃣ **You give us an address**\n2️⃣ **We analyze 50+ data points**\n3️⃣ **AI processes demographics, competition, traffic**\n4️⃣ **You get actionable intelligence**\n\n⚡ Free preview: 5 minutes\n📊 Full analysis: 24-48 hours\n\nSeen enough successful investments to know this works!", [
          { text: "🎯 Analyze my location", action: "navigate_analyze", primary: true },
          { text: "📈 Show me examples", action: "show_examples" }
        ]);
        break;

      case 'start_analysis':
        addMessage('bot', "🎯 Smart choice! Let's get you the intelligence you need.\n\nWhat's your situation?", [
          { text: "🔍 I have a specific location in mind", action: "specific_location" },
          { text: "🏢 I'm browsing opportunities", action: "browsing_mode" },
          { text: "💰 I'm evaluating an existing offer", action: "evaluating_offer" },
          { text: "🤝 I'm working with a broker", action: "broker_referral" }
        ]);
        break;

      case 'specific_location':
        addMessage('bot', "Perfect! For a specific location, I recommend starting with our **Market Intelligence** package ($897).\n\n✅ Complete ROI projections\n✅ Competition analysis\n✅ Revenue forecasting\n✅ Risk assessment\n✅ 15-page professional report\n\nThis gives you everything needed for a confident decision!", [
          { text: "🚀 Get Market Intelligence", action: "navigate_market_intel", primary: true },
          { text: "🆓 Try free preview first", action: "navigate_analyze" },
          { text: "💎 Need executive package?", action: "suggest_investment_grade" }
        ]);
        break;

      case 'evaluating_offer':
        addMessage('bot', "⚡ URGENT! If you're evaluating an active offer, time is critical.\n\nOur **Investment Grade** package ($2,497) includes:\n\n✅ 5-year financial projections\n✅ Risk factor analysis\n✅ Negotiation insights\n✅ 1-hour strategy call\n✅ 30-page executive report\n\n🔥 Most clients wish they had this BEFORE making offers!", [
          { text: "💎 Get Investment Grade NOW", action: "urgent_investment_grade", primary: true },
          { text: "📞 Talk to someone immediately", action: "urgent_call" },
          { text: "⏰ How fast can you deliver?", action: "timeline_question" }
        ]);
        break;

      case 'show_pricing':
        addMessage('bot', "💰 **LaundroTech Pricing** (Professional Analysis)\n\n🆓 **Preview** - Location grade + basics\n💡 **Market Intelligence** - $897 (Most Popular)\n💎 **Investment Grade** - $2,497 (Executive)\n\n**Success Rate:** 94% of clients avoid bad investments\n**Avg ROI Improvement:** 23% better returns\n**Payback:** Usually saves 10x the cost\n\nWhich fits your investment size?", [
          { text: "🆓 Start with free preview", action: "navigate_analyze" },
          { text: "💡 Get Market Intelligence", action: "navigate_market_intel", primary: true },
          { text: "💎 Need Investment Grade", action: "navigate_investment_grade" },
          { text: "❓ Why these prices?", action: "justify_pricing" }
        ]);
        break;

      case 'justify_pricing':
        addMessage('bot', "Great question! Here's the value:\n\n💡 **$897 Market Intelligence:**\n- Prevents $50K+ mistakes\n- Saves 40+ hours of research\n- Professional broker-grade analysis\n\n💎 **$2,497 Investment Grade:**\n- Clients typically improve ROI by 5-8%\n- On $500K investment = $25K-40K extra profit\n- One bad decision costs $100K+\n\n🎯 **Bottom line:** We pay for ourselves 10x over", [
          { text: "💡 That makes sense - Get Market Intel", action: "navigate_market_intel", primary: true },
          { text: "💎 I need the executive package", action: "navigate_investment_grade" },
          { text: "🆓 Let me try free first", action: "navigate_analyze" }
        ]);
        break;

      case 'explain_service':
        addMessage('bot', "🎯 **We're THE laundromat location intelligence experts.**\n\nWhat we do:\n✅ Analyze 50+ data points per location\n✅ Predict revenue & profit potential\n✅ Identify risks & opportunities\n✅ Compare to successful investments\n\n🏆 **Used by:** Investors, brokers, franchisees\n📊 **Track record:** 94% success rate\n💰 **Results:** $50M+ in successful investments guided\n\nThink of us as your investment co-pilot!", [
          { text: "🎯 Analyze my location", action: "navigate_analyze", primary: true },
          { text: "📈 Show me success examples", action: "show_examples" },
          { text: "💰 What does it cost?", action: "show_pricing" }
        ]);
        break;

      case 'show_examples':
        addMessage('bot', "📈 **Real Analysis Examples:**\n\n🏆 **Vista Laundry, Van Buren AR** - Validated strategic exit timing\n🏆 **The Wash Room, Fort Smith AR** - Confirmed multi-location expansion\n\nOur analysis covers:\n- Revenue projections\n- Competition mapping\n- Demographics analysis\n- Risk assessment\n- Investment recommendations", [
          { text: "🔍 See detailed examples", action: "navigate_case_studies" },
          { text: "🚀 Get my analysis", action: "navigate_analyze", primary: true },
          { text: "💰 What's the investment?", action: "show_pricing" }
        ]);
        break;

      case 'urgent_call':
        addMessage('bot', "📞 **URGENT CONSULTATION AVAILABLE**\n\nFor active deals, I can connect you immediately:\n\n📧 **Email:** nick@laundryguys.net\n📱 **Priority Line:** (mention 'urgent evaluation')\n\n⚡ **Or get instant analysis:** Investment Grade package delivers in 24 hours\n\n🔥 **Don't let a good deal slip away!**", [
          { text: "📧 Email now", action: "email_urgent" },
          { text: "💎 Get 24-hour analysis", action: "navigate_investment_grade", primary: true }
        ]);
        break;

      case 'timeline_question':
        addMessage('bot', "⏰ **DELIVERY TIMELINE:**\n\n🆓 **Free Preview:** Instant\n💡 **Market Intelligence:** 24-48 hours\n💎 **Investment Grade:** 24 hours (priority)\n\n🚨 **URGENT DEALS:** We can deliver Investment Grade in 12 hours for active negotiations!\n\n⚡ **The faster you need it, the more critical it is to get it right.**", [
          { text: "🔥 I need it in 12 hours", action: "urgent_investment_grade", primary: true },
          { text: "📞 Call me about timing", action: "urgent_call" },
          { text: "✅ 24-48 hours is fine", action: "navigate_market_intel" }
        ]);
        break;

      // Navigation actions
      case 'navigate_analyze':
        navigate('/analyze');
        addMessage('bot', "🚀 Perfect! I'm taking you to our analysis page. Start with any address to see what we can do!", null, true);
        break;

      case 'navigate_market_intel':
        navigate('/analyze');
        addMessage('bot', "💡 Great choice! Market Intelligence is our most popular package. Click the $897 option when you're ready!", null, true);
        break;

      case 'navigate_investment_grade':
        navigate('/analyze'); 
        addMessage('bot', "💎 Excellent! Investment Grade is perfect for serious investors. Look for the $2,497 executive package!", null, true);
        break;

      case 'navigate_case_studies':
        navigate('/case-study/vista-laundry');
        addMessage('bot', "📈 Check out these detailed analysis examples! You'll see exactly what we deliver.", null, true);
        break;

      case 'email_urgent':
        window.open('mailto:nick@laundryguys.net?subject=URGENT: Active Deal Evaluation&body=I have an active laundromat deal and need immediate consultation.', '_blank');
        addMessage('bot', "📧 Email opened! Make sure to mention 'urgent evaluation' for priority response.", null, true);
        break;

      default:
        addMessage('bot', "I'd be happy to help! What specific question do you have about laundromat location analysis?", [
          { text: "🎯 Start location analysis", action: "navigate_analyze", primary: true },
          { text: "💰 See pricing", action: "show_pricing" },
          { text: "📞 Talk to someone", action: "get_contact" }
        ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    
    setIsTyping(true);
    
    // Simple keyword-based responses for now
    setTimeout(() => {
      setIsTyping(false);
      processTextInput(userMessage);
    }, 1000);
  };

  const processTextInput = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('pricing')) {
      processAction('show_pricing');
    } else if (lowerInput.includes('how') && lowerInput.includes('work')) {
      processAction('how_it_works');
    } else if (lowerInput.includes('example') || lowerInput.includes('case study')) {
      processAction('show_examples');
    } else if (lowerInput.includes('free') || lowerInput.includes('preview')) {
      processAction('free_preview');
    } else if (lowerInput.includes('urgent') || lowerInput.includes('fast') || lowerInput.includes('asap')) {
      processAction('urgent_call');
    } else if (lowerInput.includes('accurate') || lowerInput.includes('reliable')) {
      processAction('accuracy_question');
    } else {
      addMessage('bot', "Great question! Let me help you with that.", [
        { text: "🎯 Start analysis", action: "navigate_analyze", primary: true },
        { text: "💰 See pricing", action: "show_pricing" },
        { text: "❓ How it works", action: "how_it_works" },
        { text: "📞 Talk to someone", action: "get_contact" }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Notification Bubble */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-2xl shadow-2xl max-w-xs cursor-pointer border border-cyan-400/30"
            onClick={() => {
              setIsOpen(true);
              setShowNotification(false);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Ready to analyze a location?</div>
                <div className="text-xs opacity-90">Get professional intelligence in minutes!</div>
              </div>
            </div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-gradient-to-r from-cyan-600 to-blue-600 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl w-96 h-[500px] mb-4 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">LaundroTech Intelligence</div>
                    <div className="text-xs text-cyan-100">Investment Assistant</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'bg-slate-800/60 text-slate-100 border border-slate-700/50'
                      }`}
                    >
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                      
                      {/* Action Buttons */}
                      {message.buttons && (
                        <div className="mt-3 space-y-2">
                          {message.buttons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(button.action)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                                button.primary
                                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500'
                                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/50'
                              }`}
                            >
                              <span>{button.text}</span>
                              {button.primary && <ArrowRightIcon className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about location analysis..."
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-xl transition-all"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl border-2 border-cyan-400/30 relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification Badge */}
          {!isOpen && showNotification && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default OptimalChatWidget;