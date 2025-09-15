import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const ImprovedAuthModal = ({ mode, onClose, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    facebookMember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(
          formData.email, 
          formData.password, 
          formData.fullName,
          formData.facebookMember
        );
      }

      if (result.success) {
        // Show success animation
        setShowSuccessAnimation(true);
        setSuccessMessage(
          mode === 'login' 
            ? `Welcome back! Redirecting to your dashboard...` 
            : `Account created successfully! Welcome to LaundroTech Intelligence.`
        );
        
        // Wait for animation before redirecting
        setTimeout(() => {
          onClose();
          window.location.href = '/dashboard';
        }, 2500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    onSwitchMode(newMode);
    setError('');
    setSuccessMessage('');
    setShowSuccessAnimation(false);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      facebookMember: false
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="modal-content p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm z-10 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-slate-300"
                >
                  {successMessage}
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, repeat: Infinity, duration: 1 }}
                  className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join LaundroTech Intelligence'}
            </h2>
            <p className="text-slate-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to access your intelligence platform' 
                : 'Start your laundromat intelligence journey'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Feedback Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-red-300 font-semibold">Authentication Failed</div>
                  <div className="text-red-200 text-sm">{error}</div>
                  <div className="text-red-200 text-xs mt-1">Please check your credentials and try again.</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMessage && !showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-emerald-300 font-semibold">Success!</div>
                  <div className="text-emerald-200 text-sm">{successMessage}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
                required
                disabled={loading || showSuccessAnimation}
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your email"
              required
              disabled={loading || showSuccessAnimation}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pr-12"
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={loading || showSuccessAnimation}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                disabled={loading || showSuccessAnimation}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="glass p-4 rounded-xl"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facebookMember"
                  checked={formData.facebookMember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-400 bg-transparent border-2 border-slate-500 rounded focus:ring-cyan-400 focus:ring-2"
                  disabled={loading || showSuccessAnimation}
                />
                <span className="ml-3 text-sm text-slate-300">
                  I'm a member of the Laundromat Exchange Facebook Group (67K members)
                </span>
              </label>
              <AnimatePresence>
                {formData.facebookMember && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg overflow-hidden"
                  >
                    <p className="text-emerald-300 text-sm font-semibold">
                      🎉 Exclusive Facebook Group Benefits:
                    </p>
                    <ul className="text-emerald-300 text-sm mt-2 space-y-1">
                      <li>• 30% discount on first analysis</li>
                      <li>• Early access to new features</li>
                      <li>• Community case studies</li>
                      <li>• Monthly expert AMA sessions</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Enhanced Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || showSuccessAnimation}
            whileHover={{ scale: (loading || showSuccessAnimation) ? 1 : 1.02 }}
            whileTap={{ scale: (loading || showSuccessAnimation) ? 1 : 0.98 }}
            className={`w-full text-lg py-4 rounded-xl font-bold transition-all duration-300 ${
              loading || showSuccessAnimation
                ? 'bg-slate-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-cyan-500/25'
            }`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </motion.div>
              ) : showSuccessAnimation ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-3" />
                  {mode === 'login' ? 'Success! Redirecting...' : 'Account Created!'}
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        {/* Switch Mode */}
        {!showSuccessAnimation && (
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="text-cyan-400 hover:text-cyan-300 font-semibold ml-2 transition-colors duration-200"
                disabled={loading}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}

        {/* Social Proof */}
        {mode === 'register' && !showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="glass p-4 rounded-xl">
              <p className="text-slate-300 text-sm mb-2">Trusted by Industry Leaders</p>
              <div className="flex justify-center items-center space-x-6 text-slate-400 text-xs">
                <div>67K+ Members</div>
                <div>•</div>
                <div>Professional Network</div>
                <div>•</div>
                <div>98% Success Rate</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImprovedAuthModal;