import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ArrowRightIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
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
  const [initializedConsultant, setInitializedConsultant] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);

  // Helpers for persistence
  const chatKey = user?.id ? `lt_chat_${user.id}` : 'lt_chat_guest';
  const saveState = (state) => {
    try {
      const payload = {
        ...state,
        messages: (state.messages || []).map(m => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString() }))
      };
      localStorage.setItem(chatKey, JSON.stringify(payload));
    } catch (e) { /* ignore */ }
  };
  const loadState = () => {
    try {
      const raw = localStorage.getItem(chatKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        messages: (parsed.messages || []).map(m => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp) : new Date() }))
      };
    } catch {
      return null;
    }
  };

  // Responsive detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load persisted state on mount or when user changes
  useEffect(() => {
    const s = loadState();
    if (s) {
      setMessages(s.messages || []);
      setIsOpen(!!s.isOpen);
    } else {
      // First-time welcome
      setTimeout(() => {
        const welcome = getContextualWelcome(location?.pathname);
        addMessage('bot', welcome.message, welcome.buttons);
      }, 600);
    }
  }, [user?.id]);

  // Persist when changes
  useEffect(() => { saveState({ isOpen, messages }); }, [isOpen, messages]);

  // Sync across tabs/routes
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === chatKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMessages((parsed.messages || []).map(m => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp) : new Date() })));
          setIsOpen(!!parsed.isOpen);
        } catch {/* ignore */}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [chatKey]);

  // Update contextual welcome when route changes (only if no messages)
  useEffect(() => {
    if (!messages.length) {
      const welcome = getContextualWelcome(location?.pathname);
      addMessage('bot', welcome.message, welcome.buttons);
    }
  }, [location?.pathname]);

  // Ensure consultant profile exists when authenticated
  useEffect(() => {
    const ensureConsultant = async () => {
      if (!isAuthenticated || initializedConsultant) return;
      try {
        await axios.get(`${API}/consultant/profile`);
        setInitializedConsultant(true);
      } catch (err) {
        // If not initialized, initialize without analysis_id
        try {
          await axios.post(`${API}/consultant/initialize`, {});
          setInitializedConsultant(true);
        } catch {
          // ignore and keep fallback-only mode
        }
      }
    };
    ensureConsultant();
  }, [isAuthenticated, initializedConsultant]);

  // Welcome content builder
  const getContextualWelcome = (path = '/') => {
    if (path === '/analyze') {
      return {
        message: "👋 Ready to analyze a location? I can help you choose the right analysis tier and get started!",
        buttons: [
          { text: '🚀 Start Free Analysis', action: 'navigate_analyze', primary: true },
          { text: '💡 Which tier is right for me?', action: 'tier_help' },
          { text: '❓ How does this work?', action: 'how_it_works' }
        ]
      };
    }
    if (path === '/marketplace') {
      return {
        message: '🏢 Browsing the marketplace? Let me help you find the perfect laundromat investment opportunity!',
        buttons: [
          { text: '🔍 Help me find listings', action: 'find_listings' },
          { text: '📊 Get location analysis first', action: 'suggest_analysis' },
          { text: '💰 What should I look for?', action: 'investment_tips' }
        ]
      };
    }
    if (path?.includes('case-study')) {
      return {
        message: '📈 Impressed by our analysis examples? Let me show you how to get this level of intelligence for your investment!',
        buttons: [
          { text: '🚀 Get My Analysis', action: 'start_analysis', primary: true },
          { text: '💵 See pricing options', action: 'show_pricing' },
          { text: '❓ How accurate are these?', action: 'accuracy_question' }
        ]
      };
    }
    return {
      message: "👋 Welcome to LaundroTech! I'm here to help you make smarter laundromat investment decisions. What brings you here today?",
      buttons: [
        { text: '🎯 I want to analyze a location', action: 'start_analysis', primary: true },
        { text: "🏢 I'm browsing investments", action: 'browse_marketplace' },
        { text: '❓ What exactly do you do?', action: 'explain_service' },
        { text: '💰 What does this cost?', action: 'show_pricing' }
      ]
    };
  };

  const addMessage = (sender, content, buttons = null, typing = false) => {
    const message = {
      id: Date.now() + Math.random(),
      sender,
      content,
      buttons,
      timestamp: new Date(),
      typing
    };
    setMessages(prev => [...prev, message]);
    if (typing) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, typing: false } : m));
      }, 1200);
    }
  };

  // Quick action router (frontend flow)
  const processAction = async (action) => {
    switch (action) {
      case 'navigate_analyze':
        navigate('/analyze');
        addMessage('bot', "🚀 Perfect! I'm taking you to our analysis page. Start with any address to see what we can do!", null, true);
        break;
      case 'tier_help':
        addMessage('bot', "Great question! Here's how to choose:\n\n🆓 Free Preview – basic grade\n💡 Market Intelligence – full analysis\n💎 Investment Grade – executive package\n\nWhat's your investment budget range?", [
          { text: 'Under $500K', action: 'suggest_market_intel' },
          { text: '$500K - $1M', action: 'suggest_investment_grade' },
          { text: 'Over $1M', action: 'suggest_portfolio' },
          { text: 'Just browsing', action: 'suggest_free' }
        ]);
        break;
      case 'how_it_works':
        addMessage('bot', '🔬 We analyze 50+ data points: demographics, competition, traffic, real estate. Free preview: instant. Full analysis: 24-48h.', [
          { text: '🎯 Analyze my location', action: 'navigate_analyze', primary: true },
          { text: '📈 Show me examples', action: 'show_examples' }
        ]);
        break;
      case 'show_examples':
        navigate('/case-study/vista-laundry');
        addMessage('bot', '📈 Check out these detailed analysis examples! You\'ll see exactly what we deliver.', null, true);
        break;
      case 'show_pricing':
        addMessage('bot', '💰 Pricing:\n\n🆓 Preview\n💡 Market Intelligence – $897\n💎 Investment Grade – $2,497\n\nSuccess rate: 94% | Avg ROI improvement: 23%', [
          { text: '🆓 Start with free preview', action: 'navigate_analyze' },
          { text: '💡 Get Market Intelligence', action: 'navigate_analyze', primary: true },
          { text: '💎 Need Investment Grade', action: 'navigate_analyze' }
        ]);
        break;
      default:
        addMessage('bot', "I'd be happy to help! What specific question do you have about laundromat location analysis?", [
          { text: '🎯 Start analysis', action: 'navigate_analyze', primary: true },
          { text: '💰 See pricing', action: 'show_pricing' }
        ]);
    }
  };

  const handleQuickAction = async (action) => {
    addMessage('user', getActionText(action));
    setIsTyping(true);
    setTimeout(async () => { setIsTyping(false); await processAction(action); }, 600);
  };

  const getActionText = (action) => {
    const map = {
      navigate_analyze: 'Take me to the analyzer',
      tier_help: 'Which analysis tier should I choose?',
      how_it_works: 'How does this work?',
      show_examples: 'Show me examples',
      show_pricing: 'Show me pricing'
    };
    return map[action] || action;
  };

  // Backend-synced free text send (uses consultant when logged in)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    setIsTyping(true);

    try {
      if (isAuthenticated) {
        // Ensure consultant initialized lazily
        if (!initializedConsultant) {
          try { await axios.post(`${API}/consultant/initialize`, {}); setInitializedConsultant(true); } catch (err) { /* ignore init error */ }
        }
        // Ask consultant
        const resp = await axios.post(`${API}/consultant/ask`, { question: userMessage, consultation_tier: 'basic_questions' });
        const payload = resp.data?.consultant_response || resp.data;
        const text = typeof payload === 'string' ? payload : (payload?.consultant_response || 'Here\'s what I recommend based on your question and analysis context.');
        addMessage('bot', text);
      } else {
        // Fallback: route through local guidance
        await processTextInput(userMessage);
      }
    } catch (e) {
      addMessage('bot', 'I\'m here to help. Try again in a moment or start a guided analysis.');
    } finally {
      setIsTyping(false);
    }
  };

  const processTextInput = async (text) => {
    const q = text.toLowerCase();
    if (q.includes('price') || q.includes('cost')) return processAction('show_pricing');
    if (q.includes('how') && q.includes('work')) return processAction('how_it_works');
    if (q.includes('example')) return processAction('show_examples');
    return addMessage('bot', 'Great question! Want me to start an analysis or show pricing?', [
      { text: '🎯 Start analysis', action: 'navigate_analyze', primary: true },
      { text: '💰 See pricing', action: 'show_pricing' }
    ]);
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Accessibility helpers
  const toggleOpen = () => setIsOpen(v => !v);
  const onKeyDownInput = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  return (
    <>
      {/* Chat Launcher */}
      <div className="fixed" style={{ right: 'max(0.5rem, env(safe-area-inset-right))', bottom: 'max(0.5rem, env(safe-area-inset-bottom))', zIndex: 10000 }}>
        <motion.button
          onClick={toggleOpen}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 text-white rounded-xl shadow-2xl border-2 border-cyan-400/60 relative backdrop-blur-xl overflow-hidden px-5 py-4"
          style={{ minWidth: 140 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <SparklesIcon className="w-5 h-5" />
              <CpuChipIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-wide leading-tight">LaundroTech</div>
              <div className="text-[10px] font-medium opacity-90 leading-tight">INTELLIGENCE</div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            className="fixed bg-slate-900/98 backdrop-blur-xl border-2 border-slate-600/70 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              zIndex: 9999,
              right: 'max(0.5rem, env(safe-area-inset-right))',
              bottom: 'max(0.5rem, env(safe-area-inset-bottom))',
              width: isMobile ? '95vw' : '450px',
              height: isMobile ? '80vh' : '650px',
              maxWidth: 520
            }}
            role="dialog"
            aria-modal="true"
            aria-label="LaundroTech Assistant"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">LaundroTech Intelligence</div>
                  <div className="text-[10px] sm:text-xs text-cyan-100">Investment Assistant</div>
                </div>
              </div>
              <button onClick={toggleOpen} className="text-white/80 hover:text-white transition-colors p-1" aria-label="Close chat">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 overscroll-contain" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-slate-800/60 text-slate-100 border border-slate-700/50'
                  }`}>
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
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
            <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900/80 sticky bottom-0">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={onKeyDownInput}
                  placeholder="Ask me anything about location analysis..."
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 text-sm"
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-xl transition-all"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedConsultantWidget;