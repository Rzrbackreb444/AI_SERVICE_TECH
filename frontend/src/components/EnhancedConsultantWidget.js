import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  XMarkIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const EnhancedConsultantWidget = ({ userTier = 'free' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-minimize when analysis input gets focus
  useEffect(() => {
    const onFocusInput = () => setIsOpen(false);
    window.addEventListener('lt:inputFocus', onFocusInput);
    return () => window.removeEventListener('lt:inputFocus', onFocusInput);
  }, []);

  return (
    <>
      {/* Chat Launcher */}
      <div
        className="fixed"
        style={{ right: 'max(0.5rem, env(safe-area-inset-right))', bottom: 'max(0.5rem, env(safe-area-inset-bottom))', zIndex: 10000 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Main Button */}
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300">
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SparklesIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <BoltIcon className="w-3 h-3 text-white" />
          </div>
        </motion.button>

        {/* Chat Interface */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-20 right-0 w-80 h-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Enhanced AI Consultant</h3>
                    <p className="text-white/80 text-xs">Professional Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="h-64 overflow-y-auto p-4">
                <div className="text-slate-300 text-sm">
                  <p>Enhanced consultant interface coming soon...</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-400 text-center">
                  Enhanced AI Consultant - {userTier} tier
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EnhancedConsultantWidget;