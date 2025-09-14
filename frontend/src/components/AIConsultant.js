import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  SparklesIcon,
  CheckBadgeIcon,
  StarIcon,
  ClockIcon,
  UserCircleIcon,
  CpuChipIcon,
  BoltIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIConsultant = ({ isOpen, onClose, userTier = 'free' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [consultantFeatures, setConsultantFeatures] = useState([]);
  const [showFeatures, setShowFeatures] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadConsultantFeatures();
      loadUserSessions();
      
      // Add welcome message
      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          type: 'ai',
          content: `👋 Welcome to **LaundroTech Master AI** - your professional laundromat consultant!

I'm equivalent to a $500/hour industry expert, here to help with:

🏗️ **Site Selection & Analysis** - Demographics, traffic, competition
🏭 **Equipment Selection** - Washer/dryer optimization, ROI calculations  
📊 **Business Operations** - Revenue optimization, pricing strategies
🔧 **Technical Support** - Troubleshooting, maintenance, error codes
📋 **Compliance** - ADA, zoning, permits, regulations

What can I help you with today?`,
          timestamp: new Date(),
          features: []
        }]);
      }
      
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadConsultantFeatures = async () => {
    try {
      const response = await axios.get(`${API}/consultant/features`, {
        headers: getAuthHeaders()
      });
      setConsultantFeatures(response.data.available_features || []);
    } catch (error) {
      console.error('Failed to load consultant features:', error);
    }
  };

  const loadUserSessions = async () => {
    try {
      const response = await axios.get(`${API}/consultant/sessions`, {
        headers: getAuthHeaders()
      });
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSessionHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/consultant/history/${sessionId}`, {
        headers: getAuthHeaders()
      });
      
      const history = response.data.conversations || [];
      const formattedMessages = history.reverse().map((conv, index) => ([
        {
          id: `user-${index}`,
          type: 'user',
          content: conv.user_message,
          timestamp: new Date(conv.created_at)
        },
        {
          id: `ai-${index}`,
          type: 'ai',
          content: conv.ai_response,
          timestamp: new Date(conv.created_at),
          features: []
        }
      ])).flat();
      
      setMessages(formattedMessages);
      setActiveSession(sessionId);
      setSessionId(sessionId);
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/consultant/ask`, {
        message: userMessage.content,
        session_id: sessionId
      }, {
        headers: getAuthHeaders()
      });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        features: response.data.enhanced_features || [],
        userTier: response.data.user_tier,
        consultantType: response.data.consultant_type
      };

      setMessages(prev => [...prev, aiMessage]);
      setSessionId(response.data.session_id);
      
      // Refresh sessions list
      await loadUserSessions();

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: '⚠️ I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
        features: [],
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewSession = () => {
    setMessages([{
      id: 'welcome-new',
      type: 'ai',
      content: `🚀 **New Consultation Session Started**

I'm ready to provide professional laundromat consulting. What's your biggest challenge or question today?

**Popular Topics:**
• Site evaluation and selection
• Equipment recommendations  
• Financial projections and ROI
• Operational optimization
• Troubleshooting and repairs`,
      timestamp: new Date(),
      features: []
    }]);
    setSessionId(null);
    setActiveSession(null);
  };

  const getTierBadge = (tier) => {
    const badges = {
      'free': { color: 'from-slate-500 to-slate-600', label: 'Scout', icon: UserCircleIcon },
      'analyzer': { color: 'from-blue-500 to-blue-600', label: 'Analyzer', icon: ChartBarIcon },
      'intelligence': { color: 'from-cyan-500 to-emerald-500', label: 'Intelligence', icon: CpuChipIcon },
      'optimization': { color: 'from-purple-500 to-pink-500', label: 'Optimization', icon: BoltIcon },
      'portfolio': { color: 'from-orange-500 to-red-500', label: 'Portfolio', icon: BuildingOfficeIcon },
      'watch_pro': { color: 'from-green-500 to-teal-500', label: 'Watch Pro', icon: ShieldCheckIcon }
    };
    return badges[tier] || badges.free;
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to JSX
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <div key={index} className="font-bold text-white mb-2">{line.slice(2, -2)}</div>;
        }
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <div key={index} className="ml-4 text-slate-300 mb-1">• {line.slice(2)}</div>;
        }
        // Emojis and regular text
        return <div key={index} className="text-slate-300 mb-1">{line}</div>;
      });
  };

  if (!isOpen) return null;

  const tierBadge = getTierBadge(userTier);
  const TierIcon = tierBadge.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">LaundroTech Master AI</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-sm">Professional Consultant</span>
                  <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${tierBadge.color} text-white text-xs font-bold flex items-center space-x-1`}>
                    <TierIcon className="w-3 h-3" />
                    <span>{tierBadge.label}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center space-x-2 bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                <LightBulbIcon className="w-4 h-4" />
                <span>Features</span>
              </button>
              
              <button
                onClick={startNewSession}
                className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>New Chat</span>
              </button>
              
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sessions Sidebar */}
            <div className="w-64 border-r border-white/10 bg-slate-900/50 p-4 overflow-y-auto">
              <h3 className="text-white font-medium mb-3">Recent Sessions</h3>
              <div className="space-y-2">
                {sessions.slice(0, 10).map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => loadSessionHistory(session.session_id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSession === session.session_id 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-white text-sm font-medium mb-1">
                      {session.preview}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{session.message_count} messages</span>
                      <span>{new Date(session.last_activity).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Features Panel */}
              <AnimatePresence>
                {showFeatures && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-white/10 bg-slate-900/30 p-4 overflow-hidden"
                  >
                    <h4 className="text-white font-medium mb-3">Available Features - {tierBadge.label} Tier</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {consultantFeatures.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckBadgeIcon className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.type === 'user' ? (
                            <UserCircleIcon className="w-5 h-5 text-white" />
                          ) : (
                            <SparklesIcon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        
                        <div className={`p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : message.isError
                            ? 'bg-red-500/20 border border-red-500/30'
                            : 'bg-slate-800/50 border border-slate-600/30'
                        }`}>
                          <div className="prose prose-invert max-w-none">
                            {message.type === 'user' ? (
                              <p className="text-white">{message.content}</p>
                            ) : (
                              <div>{formatMessage(message.content)}</div>
                            )}
                          </div>
                          
                          {message.features && message.features.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-600/30">
                              <div className="text-xs text-slate-400 mb-1">Enhanced Features Used:</div>
                              <div className="flex flex-wrap gap-1">
                                {message.features.slice(0, 3).map((feature, index) => (
                                  <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/20">
                            <span className="text-xs text-slate-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.consultantType && (
                              <span className="text-xs text-slate-500">
                                {message.consultantType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-slate-800/50 border border-slate-600/30 p-4 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <ArrowPathIcon className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-slate-300">Consulting...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask your professional laundromat consultant anything..."
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      rows={inputMessage.split('\n').length || 1}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>💡 Press Enter to send, Shift+Enter for new line</span>
                  <span>Powered by Claude 3.7 Sonnet</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIConsultant;