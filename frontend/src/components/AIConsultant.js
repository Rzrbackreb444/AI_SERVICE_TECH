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
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
  CreditCardIcon,
  FireIcon,
  ExclamationTriangleIcon
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
  const [tierInfo, setTierInfo] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState(null);
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
      
      // Add welcome message with tier info
      if (messages.length === 0) {
        const welcomeMessage = getWelcomeMessage(userTier);
        setMessages([welcomeMessage]);
      }
      
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const getWelcomeMessage = (tier) => {
    const tierInfo = getTierInfo(tier);
    const dailyLimit = getTierLimits(tier).daily_messages;
    
    return {
      id: 'welcome',
      type: 'ai',
      content: `👋 Welcome to **LaundroTech Master AI** - your ${tier === 'free' ? 'professional' : 'premium'} laundromat consultant!

${tier === 'free' ? '🆓 **Free Tier Active**' : `💎 **${tier.toUpperCase()} Tier Active**`}
📊 You have **${dailyLimit} daily messages** available

I'm equivalent to a $500/hour industry expert, here to help with:

🏗️ **Site Selection & Analysis** - Demographics, traffic, competition
🏭 **Equipment Selection** - Washer/dryer optimization, ROI calculations  
📊 **Business Operations** - Revenue optimization, pricing strategies
🔧 **Technical Support** - Troubleshooting, maintenance, error codes
📋 **Compliance** - ADA, zoning, permits, regulations
${tier !== 'free' && getTierLimits(tier).research_enabled ? '\n🔍 **Real-time Research** - Current industry data and trends' : ''}

${tier === 'free' ? '\n💡 **Want more?** Upgrade for research capabilities, unlimited messages, and advanced features!' : ''}

What can I help you with today?`,
      timestamp: new Date(),
      features: [],
      tierInfo: { tier, dailyLimit }
    };
  };

  const getTierInfo = (tier) => {
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

  const getTierLimits = (tier) => {
    const limits = {
      'free': { daily_messages: 3, research_enabled: false },
      'analyzer': { daily_messages: 15, research_enabled: false },
      'intelligence': { daily_messages: 50, research_enabled: true },
      'optimization': { daily_messages: 150, research_enabled: true },
      'portfolio': { daily_messages: 300, research_enabled: true },
      'watch_pro': { daily_messages: 500, research_enabled: true }
    };
    return limits[tier] || limits.free;
  };

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
          features: [],
          tierInfo: conv.tier_info
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

      if (response.data.blocked) {
        // Handle tier limit exceeded
        const blockedMessage = {
          id: `blocked-${Date.now()}`,
          type: 'ai',
          content: response.data.message,
          timestamp: new Date(),
          features: [],
          isBlocked: true,
          upgradeInfo: response.data.upgrade_info
        };
        
        setMessages(prev => [...prev, blockedMessage]);
        setUpgradeInfo(response.data.upgrade_info);
        setShowUpgradeModal(true);
        
      } else {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(response.data.timestamp || new Date()),
          features: response.data.enhanced_features || [],
          userTier: response.data.user_tier,
          consultantType: response.data.consultant_type,
          tierInfo: response.data.tier_info,
          researchUsed: response.data.research_used,
          upgradeUrl: response.data.upgrade_suggested ? '/pricing' : null
        };

        setMessages(prev => [...prev, aiMessage]);
        setSessionId(response.data.session_id);
        setTierInfo(response.data.tier_info);
      }
      
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
    const welcomeMessage = getWelcomeMessage(userTier);
    setMessages([welcomeMessage]);
    setSessionId(null);
    setActiveSession(null);
  };

  const handleUpgrade = (tier) => {
    window.open(`/pricing?highlight=${tier}&source=consultant`, '_blank');
    setShowUpgradeModal(false);
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to JSX with better parsing
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        return <div key={index} className="font-bold text-white mb-2 text-lg">{line.slice(2, -2)}</div>;
      }
      
      // Handle upgrade links
      if (line.includes('[Upgrade') && line.includes('](')) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = line.split(linkRegex);
        return (
          <div key={index} className="mb-2">
            {parts.map((part, i) => {
              if (i % 3 === 1) { // Link text
                return (
                  <button
                    key={i}
                    onClick={() => window.open('/pricing', '_blank')}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    <span>{part}</span>
                  </button>
                );
              } else if (i % 3 === 0) { // Regular text
                return <span key={i} className="text-slate-300">{part}</span>;
              }
              return null;
            })}
          </div>
        );
      }
      
      // Handle bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <div key={index} className="ml-4 text-slate-300 mb-1 flex items-start"><span className="text-cyan-400 mr-2">•</span>{line.slice(2)}</div>;
      }
      
      // Handle tier indicators
      if (line.includes('🆓') || line.includes('💎')) {
        return <div key={index} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 mb-2 font-medium text-cyan-400">{line}</div>;
      }
      
      // Handle warnings and important messages
      if (line.includes('⚠️') || line.includes('🔒')) {
        return <div key={index} className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-2 text-orange-300">{line}</div>;
      }
      
      // Regular text and emojis
      if (line.trim()) {
        return <div key={index} className="text-slate-300 mb-1">{line}</div>;
      }
      
      return <div key={index} className="mb-1"></div>;
    });
  };

  if (!isOpen) return null;

  const tierBadge = getTierInfo(userTier);
  const TierIcon = tierBadge.icon;
  const tierLimits = getTierLimits(userTier);

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
          className="glass-card w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
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
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-sm">Professional Consultant</span>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${tierBadge.color} text-white text-xs font-bold flex items-center space-x-1`}>
                    <TierIcon className="w-3 h-3" />
                    <span>{tierBadge.label}</span>
                  </div>
                  {tierInfo && (
                    <div className="text-xs text-slate-400">
                      {tierInfo.messages_remaining}/{tierInfo.daily_limit} messages today
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {userTier === 'free' && (
                <button
                  onClick={() => window.open('/pricing?source=consultant', '_blank')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  <FireIcon className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}
              
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
                    <div className="text-white text-sm font-medium mb-1 truncate">
                      {session.preview}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{session.message_count} messages</span>
                      <span>{new Date(session.last_activity).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Tier Usage Summary */}
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                <h4 className="text-white font-medium mb-2 text-sm">Usage Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Tier:</span>
                    <span className="font-medium">{tierBadge.label}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Daily Limit:</span>
                    <span>{tierLimits.daily_messages}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Research:</span>
                    <span className={tierLimits.research_enabled ? 'text-green-400' : 'text-red-400'}>
                      {tierLimits.research_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
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
                      {!tierLimits.research_enabled && (
                        <div className="flex items-center space-x-2 text-sm">
                          <LockClosedIcon className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-300">Real-time Research (Premium)</span>
                        </div>
                      )}
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
                    <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                            : message.isBlocked || message.isError
                            ? 'bg-gradient-to-r from-orange-500 to-red-500'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.type === 'user' ? (
                            <UserCircleIcon className="w-5 h-5 text-white" />
                          ) : message.isBlocked ? (
                            <LockClosedIcon className="w-5 h-5 text-white" />
                          ) : (
                            <SparklesIcon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        
                        <div className={`p-4 rounded-2xl max-w-3xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : message.isError
                            ? 'bg-red-500/20 border border-red-500/30'
                            : message.isBlocked
                            ? 'bg-orange-500/20 border border-orange-500/30'
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
                                {message.features.slice(0, 4).map((feature, index) => (
                                  <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {message.researchUsed && (
                            <div className="mt-3 pt-3 border-t border-slate-600/30">
                              <div className="flex items-center space-x-2 text-xs text-cyan-400">
                                <SparklesIcon className="w-3 h-3" />
                                <span>Real-time research conducted</span>
                              </div>
                            </div>
                          )}
                          
                          {message.upgradeInfo && (
                            <div className="mt-3 pt-3 border-t border-slate-600/30">
                              <button
                                onClick={() => handleUpgrade(message.upgradeInfo.next_tier)}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                              >
                                Upgrade to {message.upgradeInfo.next_tier} - {message.upgradeInfo.price}
                              </button>
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
                          <span className="text-slate-300">Consulting{tierLimits.research_enabled ? ' & researching' : ''}...</span>
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
                      placeholder={`Ask your ${tierLimits.research_enabled ? 'research-enabled ' : ''}professional laundromat consultant anything...`}
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
                  <div className="flex items-center space-x-4">
                    {tierInfo && (
                      <span>
                        {tierInfo.messages_remaining}/{tierInfo.daily_limit} messages remaining
                      </span>
                    )}
                    <span>Powered by Claude 3.7 Sonnet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && upgradeInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4"
              onClick={() => setShowUpgradeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <ExclamationTriangleIcon className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Daily Limit Reached</h3>
                  <p className="text-slate-400">Upgrade for unlimited access to professional consulting</p>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-white">Upgrade to {upgradeInfo.next_tier} ({upgradeInfo.price}):</h4>
                  <ul className="space-y-2">
                    {upgradeInfo.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-300">
                        <CheckBadgeIcon className="w-4 h-4 text-green-400" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => handleUpgrade(upgradeInfo.next_tier)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Upgrade Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIConsultant;