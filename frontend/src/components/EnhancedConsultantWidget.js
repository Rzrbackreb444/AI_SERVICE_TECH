import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [panelHeight, setPanelHeight] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [initializedConsultant, setInitializedConsultant] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | awaiting_address_preview | awaiting_address_tier
  const [selectedTier, setSelectedTier] = useState(null); // 'intelligence' | 'optimization'

  const messagesEndRef = useRef(null);

  // Helpers for persistence
  const chatKey = user?.id ? `lt_chat_${user.id}` : 'lt_chat_guest';
  const saveState = (state) => {
    try {
      const payload = {
        ...state,
        messages: (state.messages || []).map(m => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString()
        }))
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
        messages: (parsed.messages || []).map(m => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
        }))
      };
    } catch {
      return null;
    }
  };

  // Responsive detection (mobile)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Adjust height on mobile to avoid virtual keyboard overlap
  useEffect(() => {
    if (!isMobile) return;
    const setVH = () => {
      const h = Math.round(window.innerHeight * 0.8);
      setPanelHeight(h);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, [isMobile]);

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
      }, 400);
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
        } catch (e) {
          // Keep fallback-only mode
        }
      }
    };
    ensureConsultant();
  }, [isAuthenticated, initializedConsultant]);

  // Auto-minimize when analysis input gets focus
  useEffect(() => {
    const onFocusInput = () => setIsOpen(false);
    window.addEventListener('lt:inputFocus', onFocusInput);
    return () => window.removeEventListener('lt:inputFocus', onFocusInput);
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Welcome content builder
  const getContextualWelcome = (path = '/') => {
    if (path === '/analyze') {
      return {
        message: '👋 Ready to analyze a location? Paste an address and choose your depth. I can run a free preview or full analysis based on your tier.',
        buttons: [
          { text: '🆓 Start Free Preview', action: 'start_free_preview', primary: true },
          { text: '💡 Market Intelligence', action: 'choose_market_intelligence' },
          { text: '💎 Investment Grade', action: 'choose_investment_grade' }
        ]
      };
    }
    return {
      message: "👋 Welcome to LaundroTech! I can run a free preview on your address or help you choose the right analysis depth.",
      buttons: [
        { text: '🆓 Start Free Preview', action: 'start_free_preview', primary: true },
        { text: '💡 Market Intelligence', action: 'choose_market_intelligence' },
        { text: '💎 Investment Grade', action: 'choose_investment_grade' },
        { text: '❓ What exactly do you do?', action: 'how_it_works' }
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
        setMessages(prev => prev.map(m => (m.id === message.id ? { ...m, typing: false } : m)));
      }, 1200);
    }
  };

  // Backend calls
  const runPreview = async (address) => {
    try {
      if (!isAuthenticated) {
        addMessage('bot', 'Please sign in to run a live preview. Your free preview includes a real-time grade, score, and nearby competitor snapshot.', [
          { text: '🔐 Sign in', action: 'go_login', primary: true },
          { text: '📖 How it works', action: 'how_it_works' }
        ]);
        return;
      }
      const resp = await axios.post(`${API}/revenue/analysis/preview`, { address });
      const report = resp.data?.preview_report || {};
      const grade = report.grade || report?.summary?.grade || '—';
      const score = report.score || report?.summary?.score || '—';
      addMessage('bot', `✅ Preview ready for ${address}\n\nGrade: ${grade}\nScore: ${score}\n\nUpgrade for full demographics, competition analysis, and ROI model.`, [
        { text: '💡 Upgrade to Market Intelligence', action: 'choose_market_intelligence', primary: true },
        { text: '💎 Investment Grade', action: 'choose_investment_grade' }
      ]);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        addMessage('bot', 'You need to sign in to run a preview.', [
          { text: '🔐 Sign in', action: 'go_login', primary: true }
        ]);
      } else {
        addMessage('bot', 'Preview temporarily unavailable. Try a full analysis or try again later.');
      }
    } finally {
      setMode('idle');
      setSelectedTier(null);
    }
  };

  const runFullAnalysis = async (address, analysisType) => {
    try {
      if (!isAuthenticated) {
        addMessage('bot', 'Sign in to run a full analysis. Based on your tier, I can unlock deeper intelligence and a PDF report.', [
          { text: '🔐 Sign in', action: 'go_login', primary: true },
          { text: '🆓 Or run a free preview', action: 'start_free_preview' }
        ]);
        return;
      }
      const resp = await axios.post(`${API}/analyze`, { address, analysis_type: analysisType });
      const a = resp.data;
      addMessage('bot', `📊 Analysis complete for ${a.address}\nGrade: ${a.grade}  |  Score: ${a.score}`, [
        { text: '📄 Generate PDF Report', action: 'generate_pdf' },
        { text: '📍 Open in Analyzer', action: 'open_analyzer', primary: true }
      ]);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) {
        addMessage('bot', 'This depth requires an upgrade. Would you like to see pricing options?', [
          { text: '💳 See pricing', action: 'show_pricing', primary: true },
          { text: '🆓 Run free preview', action: 'start_free_preview' }
        ]);
      } else if (status === 401) {
        addMessage('bot', 'You need to sign in to run a full analysis.', [
          { text: '🔐 Sign in', action: 'go_login', primary: true }
        ]);
      } else {
        addMessage('bot', 'Analysis temporarily unavailable. Please try again later.');
      }
    } finally {
      setMode('idle');
      setSelectedTier(null);
    }
  };

  // Quick action router (frontend flow)
  const processAction = async (action) => {
    switch (action) {
      case 'start_free_preview':
        setMode('awaiting_address_preview');
        try { localStorage.setItem('lt_preview_mode', 'true'); } catch {}
        addMessage('bot', 'Paste the address you want me to preview here and I\'ll run a limited preview instantly (some details blurred).');
        // Keep chat open for inline address capture
        break;
      case 'choose_market_intelligence':
        setSelectedTier('intelligence');
        setMode('awaiting_address_tier');
        addMessage('bot', 'Great — Market Intelligence selected. Paste the address to begin. I\'ll move out of the way.');
        navigate('/analyze');
        setIsOpen(false);
        setTimeout(() => {
          try { window.dispatchEvent(new CustomEvent('lt:focusAnalyzeInput')); } catch {}
        }, 50);
        break;
      case 'choose_investment_grade':
        setSelectedTier('optimization');
        setMode('awaiting_address_tier');
        addMessage('bot', 'Excellent — Investment Grade selected. Paste the address to begin. I\'ll move out of the way.');
        navigate('/analyze');
        setIsOpen(false);
        setTimeout(() => {
          try { window.dispatchEvent(new CustomEvent('lt:focusAnalyzeInput')); } catch {}
        }, 50);
        break;
      case 'how_it_works':
        addMessage('bot', '🔬 We analyze 50+ data points: demographics, competition, traffic, and real estate. Free preview is instant; full analysis delivers an executive report.');
        break;
      case 'show_pricing':
        navigate('/pricing');
        addMessage('bot', 'Opening pricing. You can continue chatting here.');
        break;
      case 'open_analyzer':
        navigate('/analyze');
        setIsOpen(false);
        break;
      case 'generate_pdf':
        navigate('/dashboard');
        addMessage('bot', 'From your analysis, open the report and tap Generate PDF.');
        break;
      case 'go_login':
        // Open landing and signal to open auth modal
        navigate('/');
        try { window.dispatchEvent(new CustomEvent('openAuth', { detail: 'login' })); } catch {}
        break;
      default:
        addMessage('bot', "I'd be happy to help! What specific question do you have about laundromat location analysis?", [
          { text: '🆓 Start Free Preview', action: 'start_free_preview', primary: true },
          { text: '💡 Market Intelligence', action: 'choose_market_intelligence' },
          { text: '💎 Investment Grade', action: 'choose_investment_grade' }
        ]);
    }
  };

  const handleQuickAction = async (action) => {
    addMessage('user', getActionText(action));
    setIsTyping(true);
    setTimeout(async () => { setIsTyping(false); await processAction(action); }, 300);
  };

  const getActionText = (action) => {
    const map = {
      start_free_preview: 'Start a free preview',
      case 'contact_support':
        if (!isAuthenticated) {
          addMessage('bot', 'Please sign in so I can include your account details in the support request.', [
            { text: '🔐 Sign in', action: 'go_login', primary: true }
          ]);
          break;
        }
        addMessage('bot', 'Sure — briefly describe the issue and hit Send. I\'ll forward it to support.');
        setMode('awaiting_support_message');
        break;

      choose_market_intelligence: 'Choose Market Intelligence',
      choose_investment_grade: 'Choose Investment Grade',
      show_pricing: 'Show me pricing',
      open_analyzer: 'Open Analyzer',
      generate_pdf: 'Generate PDF',
      go_login: 'Sign me in'
    };
    return map[action] || action;
  };

  // Backend-synced free text send (uses consultant when logged in)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);

    // Address capture flows first
    if (mode === 'awaiting_address_preview') {
      setIsTyping(true);
      await runPreview(userMessage);
      setIsTyping(false);
      return;
    }
    if (mode === 'awaiting_address_tier' && selectedTier) {
      setIsTyping(true);
      await runFullAnalysis(userMessage, selectedTier);
      setIsTyping(false);
      return;
    }

    // Otherwise, normal Q&A
    setIsTyping(true);
    try {
      if (isAuthenticated) {
        if (!initializedConsultant) {
          try { await axios.post(`${API}/consultant/initialize`, {}); setInitializedConsultant(true); } catch (err) { /* ignore */ }
        }
        const resp = await axios.post(`${API}/consultant/ask`, { question: userMessage, consultation_tier: 'basic_questions' });
        const payload = resp.data?.consultant_response || resp.data;
        const text = typeof payload === 'string' ? payload : (payload?.consultant_response || "Here's what I recommend based on your question and analysis context.");
        addMessage('bot', text);
      } else {
        await processAction('how_it_works');
      }
    } catch (e) {
      addMessage('bot', "I'm here to help. Try again in a moment or start a guided analysis.");
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Accessibility helpers
  const toggleOpen = () => setIsOpen(v => !v);
  const onKeyDownInput = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  return (
    <>
      {/* Chat Launcher */}
      <div
        className="fixed"
        style={{ right: 'max(0.5rem, env(safe-area-inset-right))', bottom: 'max(0.5rem, env(safe-area-inset-bottom))', zIndex: 10000 }}
      >
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
              height: isMobile ? (panelHeight ? `${panelHeight}px` : '80vh') : '650px',
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
                  placeholder="Paste address or ask a question..."
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