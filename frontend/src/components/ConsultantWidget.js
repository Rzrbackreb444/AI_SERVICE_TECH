import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  XMarkIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import AIConsultant from './AIConsultant';

const ConsultantWidget = ({ userTier = 'free' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Floating Widget Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
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

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-slate-900 border border-slate-600 rounded-xl p-4 shadow-2xl min-w-64"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">LaundroTech Master AI</h4>
                  <p className="text-slate-400 text-xs">Professional Consultant</p>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-slate-300 mb-3">
                <div>🏗️ Site Selection & Analysis</div>
                <div>🏭 Equipment Optimization</div>
                <div>📊 Business Strategy</div>
                <div>🔧 Technical Support</div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold text-xs">$500/hour Value</span>
                <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                  FREE ACCESS
                </div>
              </div>
              
              {/* Arrow pointer */}
              <div className="absolute top-1/2 transform -translate-y-1/2 -right-2 w-4 h-4 bg-slate-900 border-r border-b border-slate-600 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Consultant Modal */}
      <AIConsultant
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userTier={userTier}
      />
    </>
  );
};

export default ConsultantWidget;