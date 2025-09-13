import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationCenter = ({ isOpen, onClose, className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({});
  const [showSettings, setShowSettings] = useState(false);

  const notificationTypes = {
    'badge_activated': { icon: ShieldCheckIcon, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    'payment_success': { icon: CreditCardIcon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    'security_alert': { icon: ExclamationTriangleIcon, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    'renewal_reminder': { icon: BellIcon, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    'system_update': { icon: InformationCircleIcon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    'settings_updated': { icon: CogIcon, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    'announcement': { icon: UserGroupIcon, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    'test': { icon: CheckCircleIcon, color: 'text-green-400', bgColor: 'bg-green-500/20' }
  };

  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: unreadCount },
    { id: 'badge_activated', name: 'Badges', count: notifications.filter(n => n.type === 'badge_activated').length },
    { id: 'payment_success', name: 'Payments', count: notifications.filter(n => n.type === 'payment_success').length },
    { id: 'security_alert', name: 'Security', count: notifications.filter(n => n.type === 'security_alert').length }
  ];

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadSettings();
    }
  }, [isOpen]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/notifications?limit=50`, {
        headers: getAuthHeaders()
      });

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/notifications/settings`, {
        headers: getAuthHeaders()
      });
      setSettings(response.data.settings || {});
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API}/notifications/${notificationId}/mark-read`, {}, {
        headers: getAuthHeaders()
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API}/notifications/mark-all-read`, {}, {
        headers: getAuthHeaders()
      });

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API}/notifications/${notificationId}`, {
        headers: getAuthHeaders()
      });

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await axios.put(`${API}/notifications/settings`, newSettings, {
        headers: getAuthHeaders()
      });
      setSettings(newSettings);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const sendTestNotification = async (type) => {
    try {
      await axios.post(`${API}/notifications/test`, { type }, {
        headers: getAuthHeaders()
      });
      toast.success(`Test ${type} notification sent`);
      setTimeout(loadNotifications, 1000); // Reload after a second
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end">
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="w-full max-w-md h-full glass-card rounded-none border-l border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Settings"
              >
                <CogIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/10 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium text-white">Notification Settings</h3>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'email_notifications', label: 'Email Notifications' },
                      { key: 'push_notifications', label: 'Push Notifications' },
                      { key: 'security_alerts', label: 'Security Alerts' },
                      { key: 'badge_updates', label: 'Badge Updates' },
                      { key: 'payment_notifications', label: 'Payment Notifications' }
                    ].map(setting => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{setting.label}</span>
                        <button
                          onClick={() => updateSettings({
                            ...settings,
                            [setting.key]: !settings[setting.key]
                          })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings[setting.key] ? 'bg-blue-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings[setting.key] ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-slate-600">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => sendTestNotification('email')}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Test Email
                      </button>
                      <button
                        onClick={() => sendTestNotification('push')}
                        className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Test Push
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10">
            {filters.map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  filter === filterOption.id
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span>{filterOption.name}</span>
                {filterOption.count > 0 && (
                  <span className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded-full">
                    {filterOption.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={loadNotifications}
                disabled={loading}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                <span className="text-sm">Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <ArrowPathIcon className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                <BellIcon className="w-12 h-12 text-slate-600 mb-2" />
                <p className="text-slate-400">No notifications</p>
                <p className="text-slate-500 text-sm">
                  {filter === 'unread' ? 'All caught up!' : 'You\'ll see notifications here when they arrive'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => {
                    const typeConfig = notificationTypes[notification.type] || notificationTypes['system_update'];
                    const IconComponent = typeConfig.icon;
                    
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-4 hover:bg-white/5 transition-colors group ${
                          !notification.read ? 'bg-blue-500/5 border-l-2 border-blue-400' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${typeConfig.bgColor} flex items-center justify-center`}>
                            <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                                    title="Mark as read"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Delete"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <p className={`text-sm mt-1 ${notification.read ? 'text-slate-400' : 'text-slate-300'}`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-slate-500">
                                {formatDate(notification.created_at)}
                              </span>
                              
                              {notification.action_url && (
                                <a
                                  href={notification.action_url}
                                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                  onClick={onClose}
                                >
                                  View Details →
                                </a>
                              )}
                            </div>
                            
                            {notification.priority === 'high' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                                  High Priority
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <span className="text-xs text-slate-500">
                {filteredNotifications.length} of {notifications.length} notifications
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotificationCenter;