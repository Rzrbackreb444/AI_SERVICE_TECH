import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hi! I\'m your LaundroTech AI assistant. How can I help you analyze locations or understand our platform?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: generateBotResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return 'Our pricing starts with a FREE Location Scout tier, then Market Analyzer ($29), Business Intelligence ($79), Enterprise Analysis ($199), and Real-time Monitoring ($299/month). Each tier provides deeper insights and analysis.';
    }
    
    if (input.includes('how it works') || input.includes('how does')) {
      return 'LaundroTech uses advanced AI to analyze 156+ data points including demographics, competition, traffic patterns, and market potential. Simply enter an address and choose your analysis depth level for instant intelligence.';
    }
    
    if (input.includes('wash room') || input.includes('vista laundry')) {
      return 'Great question! Our platform features real-world case studies including The Wash Room\'s successful expansion in Fort Smith, AR and the Vista Laundry rebuild analysis in Van Buren. These showcase our AI\'s ability to guide million-dollar decisions.';
    }
    
    if (input.includes('accuracy') || input.includes('reliable')) {
      return 'Our AI maintains 99.2% accuracy across analysis predictions with 87.3% success probability on location recommendations. We use real-time data from Google Maps, Census Bureau, ATTOM Data, and proprietary algorithms.';
    }
    
    if (input.includes('facebook') || input.includes('group')) {
      return 'Yes! Facebook Group members from our 67K+ Laundromat Exchange community get exclusive benefits including 30% discount on first analysis, early access to features, and monthly expert AMA sessions.';
    }
    
    return 'Thanks for your question! I can help you with pricing information, explain how our AI analysis works, discuss our real-world case studies, or guide you through getting started. What would you like to know more about?';
  };

  const quickActions = [
    { text: 'View Pricing', action: 'pricing' },
    { text: 'How it Works', action: 'how' },
    { text: 'Case Studies', action: 'cases' },
    { text: 'Get Started', action: 'start' }
  ];

  const handleQuickAction = (action) => {
    let message = '';
    switch(action) {
      case 'pricing':
        message = 'What are your pricing options?';
        break;
      case 'how':
        message = 'How does LaundroTech work?';
        break;
      case 'cases':
        message = 'Tell me about your case studies';
        break;
      case 'start':
        message = 'How do I get started?';
        break;
      default:
        message = 'I need help';
    }
    setInputMessage(message);
    handleSendMessage();
  };

  return (
    <>
      {/* Fixed positioning to avoid conflicts */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mb-4 w-80 h-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">LaundroTech AI</h3>
                    <p className="text-white/80 text-xs">Intelligence Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 p-3 rounded-2xl">
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

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="bg-slate-800/50 text-slate-300 text-xs px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about locations, pricing, features..."
                    className="flex-1 bg-slate-800/50 text-white placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border border-slate-700/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
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
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-all relative"
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
                <XMarkIcon className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification dot */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default ChatWidget;