import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
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
        onClose();
        // Redirect to dashboard after successful authentication
        window.location.href = '/dashboard';
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    onSwitchMode(newMode);
    setError('');
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
        className="modal-content p-8"
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert-error mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
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
              />
            </div>
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
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
            <div className="glass p-4 rounded-xl">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facebookMember"
                  checked={formData.facebookMember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-400 bg-transparent border-2 border-slate-500 rounded focus:ring-cyan-400 focus:ring-2"
                />
                <span className="ml-3 text-sm text-slate-300">
                  I'm a member of the Laundromat Exchange Facebook Group (67K members)
                </span>
              </label>
              {formData.facebookMember && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
                >
                  <p className="text-emerald-300 text-sm">
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
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-accent w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-3"></div>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </motion.button>
        </form>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className="text-cyan-400 hover:text-cyan-300 font-semibold ml-2 transition-colors duration-200"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Social Proof */}
        {mode === 'register' && (
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
                <div>$8.4M+ Revenue</div>
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

export default AuthModal;