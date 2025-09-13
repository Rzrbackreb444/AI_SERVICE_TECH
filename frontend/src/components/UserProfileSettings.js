import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [securitySettings, setSecuritySettings] = useState({});
  const [sessions, setSessions] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    language: 'en',
    company: '',
    role: '',
    bio: ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    marketing_emails: false,
    security_alerts: true,
    payment_notifications: true,
    badge_updates: true,
    weekly_reports: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: UserCircleIcon },
    { id: 'security', name: 'Security & Privacy', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCardIcon },
    { id: 'sessions', name: 'Active Sessions', icon: DevicePhoneMobileIcon },
    { id: 'audit', name: 'Security Log', icon: DocumentTextIcon }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const [
        userResponse,
        securityResponse,
        sessionsResponse,
        auditResponse
      ] = await Promise.all([
        axios.get(`${API}/user/profile`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/security-settings`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/sessions`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/audit-log?limit=20`, { headers: getAuthHeaders() })
      ]);

      const userData = userResponse.data.user || JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      
      setProfileForm({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        timezone: userData.timezone || 'America/New_York',
        language: userData.language || 'en',
        company: userData.company || '',
        role: userData.role || '',
        bio: userData.bio || ''
      });

      setSecuritySettings(securityResponse.data);
      setSessions(sessionsResponse.data.sessions || []);
      setAuditLog(auditResponse.data.events || []);

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/user/profile`, profileForm, { headers: getAuthHeaders() });
      
      // Update localStorage
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    
    if (securityForm.new_password !== securityForm.confirm_password) {
      alert('New passwords do not match');
      return;
    }

    try {
      await axios.post(`${API}/security/change-password`, {
        current_password: securityForm.current_password,
        new_password: securityForm.new_password
      }, { headers: getAuthHeaders() });
      
      setSecurityForm({ current_password: '', new_password: '', confirm_password: '' });
      alert('Password changed successfully! You will need to log in again.');
      
      // Force logout after password change
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      console.error('Password change failed:', error);
      alert('Failed to change password. Please check your current password.');
    }
  };

  const setup2FA = async () => {
    try {
      const response = await axios.post(`${API}/security/2fa/setup`, {}, { headers: getAuthHeaders() });
      setTwoFactorSetup(response.data);
    } catch (error) {
      console.error('2FA setup failed:', error);
      alert('Failed to setup 2FA. Please try again.');
    }
  };

  const verify2FA = async (code) => {
    try {
      await axios.post(`${API}/security/2fa/verify`, { code }, { headers: getAuthHeaders() });
      setTwoFactorSetup(null);
      await loadUserData(); // Refresh security settings
      alert('Two-factor authentication enabled successfully!');
    } catch (error) {
      console.error('2FA verification failed:', error);
      alert('Invalid code. Please try again.');
    }
  };

  const disable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    const password = prompt('Please enter your password to confirm:');
    if (!password) return;

    try {
      await axios.post(`${API}/security/2fa/disable`, { password }, { headers: getAuthHeaders() });
      await loadUserData(); // Refresh security settings
      alert('Two-factor authentication disabled.');
    } catch (error) {
      console.error('2FA disable failed:', error);
      alert('Failed to disable 2FA. Please check your password.');
    }
  };

  const revokeSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to revoke this session?')) {
      return;
    }

    try {
      await axios.delete(`${API}/security/sessions/${sessionId}`, { headers: getAuthHeaders() });
      setSessions(sessions.filter(s => s.id !== sessionId));
      alert('Session revoked successfully.');
    } catch (error) {
      console.error('Session revoke failed:', error);
      alert('Failed to revoke session.');
    }
  };

  const revokeAllSessions = async () => {
    if (!window.confirm('Are you sure you want to log out all other devices? This will end all active sessions except your current one.')) {
      return;
    }

    try {
      const response = await axios.post(`${API}/security/sessions/revoke-all`, {}, { headers: getAuthHeaders() });
      alert(`Successfully logged out ${response.data.revoked_count} sessions.`);
      await loadUserData(); // Refresh sessions
    } catch (error) {
      console.error('Revoke all sessions failed:', error);
      alert('Failed to revoke sessions.');
    }
  };

  const updateNotifications = async () => {
    try {
      await axios.put(`${API}/user/notifications`, notificationSettings, { headers: getAuthHeaders() });
      alert('Notification settings updated successfully!');
    } catch (error) {
      console.error('Notification update failed:', error);
      alert('Failed to update notification settings.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'login_success': CheckCircleIcon,
      'login_failed': ExclamationTriangleIcon,
      '2fa_setup': ShieldCheckIcon,
      'password_changed': KeyIcon,
      'session_revoked': DevicePhoneMobileIcon
    };
    return icons[eventType] || DocumentTextIcon;
  };

  const getEventColor = (eventType) => {
    const colors = {
      'login_success': 'text-green-400',
      'login_failed': 'text-red-400',
      '2fa_setup': 'text-blue-400',
      'password_changed': 'text-yellow-400',
      'session_revoked': 'text-purple-400'
    };
    return colors[eventType] || 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                Profile Settings <span className="text-slate-400 text-sm">Account Management</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium">{user?.full_name || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user?.full_name || 'User Profile'}</h2>
              <p className="text-slate-300">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Email Verified</span>
                </div>
                {securitySettings.two_factor_enabled && (
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm">2FA Enabled</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">
                    Member since {formatDate(user?.created_at || new Date())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="glass-card">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="City, State, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Role/Title</label>
                    <input
                      type="text"
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Your role or title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Language</label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({...profileForm, language: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {/* Security & Privacy Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Two-Factor Authentication */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                      <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {securitySettings.two_factor_enabled ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">Enabled</span>
                          <button
                            onClick={disable2FA}
                            className="text-red-400 hover:text-red-300 font-medium"
                          >
                            Disable
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={setup2FA}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          Enable 2FA
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {twoFactorSetup && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-white font-medium mb-4">Set Up Two-Factor Authentication</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-slate-300 mb-4">
                            1. Install an authenticator app like Google Authenticator or Authy
                          </p>
                          <p className="text-slate-300 mb-4">
                            2. Scan this QR code with your app:
                          </p>
                          <img src={twoFactorSetup.qr_code} alt="2FA QR Code" className="max-w-48 border rounded-lg" />
                        </div>
                        <div>
                          <p className="text-slate-300 mb-4">
                            3. Enter the 6-digit code from your app:
                          </p>
                          <input
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg text-center text-2xl tracking-widest"
                            onChange={(e) => {
                              if (e.target.value.length === 6) {
                                verify2FA(e.target.value);
                              }
                            }}
                          />
                          <p className="text-slate-400 text-xs mt-2">
                            Or enter secret key manually: <code className="bg-slate-700 px-2 py-1 rounded">{twoFactorSetup.secret}</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                  <form onSubmit={changePassword} className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={securityForm.current_password}
                          onChange={(e) => setSecurityForm({...securityForm, current_password: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">New Password</label>
                        <input
                          type="password"
                          value={securityForm.new_password}
                          onChange={(e) => setSecurityForm({...securityForm, new_password: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={securityForm.confirm_password}
                          onChange={(e) => setSecurityForm({...securityForm, confirm_password: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="text-slate-400 text-sm">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Change Password
                    </button>
                  </form>
                </div>

                {/* Security Summary */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Security Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Two-Factor Authentication:</span>
                        <span className={securitySettings.two_factor_enabled ? 'text-green-400' : 'text-red-400'}>
                          {securitySettings.two_factor_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Password Last Changed:</span>
                        <span className="text-white">
                          {securitySettings.password_last_changed ? 
                            formatDate(securitySettings.password_last_changed) : 
                            'Never'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Active Sessions:</span>
                        <span className="text-white">{sessions.length}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Login Notifications:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Security Alerts:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Backup Codes:</span>
                        <span className="text-white">{securitySettings.backup_codes_remaining || 0} remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                    
                    {[
                      { key: 'email_notifications', label: 'General Email Notifications', desc: 'Receive important updates via email' },
                      { key: 'security_alerts', label: 'Security Alerts', desc: 'Login attempts, password changes, etc.' },
                      { key: 'payment_notifications', label: 'Payment Notifications', desc: 'Payment receipts, billing updates' },
                      { key: 'badge_updates', label: 'Badge Updates', desc: 'Badge activation, renewal reminders' },
                      { key: 'weekly_reports', label: 'Weekly Reports', desc: 'Analytics and performance summaries' },
                      { key: 'marketing_emails', label: 'Marketing Emails', desc: 'Product updates, tips, and promotions' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between glass-card p-4">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-slate-400 text-sm">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: !notificationSettings[setting.key]
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings[setting.key] ? 'bg-blue-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Mobile & Push Notifications</h3>
                    
                    {[
                      { key: 'push_notifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                      { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Text message alerts for critical events' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between glass-card p-4">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-slate-400 text-sm">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: !notificationSettings[setting.key]
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings[setting.key] ? 'bg-blue-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={updateNotifications}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}

            {/* Active Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Active Sessions</h3>
                  <button
                    onClick={revokeAllSessions}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Log Out All Devices
                  </button>
                </div>
                
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <DevicePhoneMobileIcon className="w-8 h-8 text-blue-400" />
                          <div>
                            <h4 className="text-white font-medium">
                              {session.device || 'Unknown Device'}
                              {session.is_current && (
                                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                  Current Session
                                </span>
                              )}
                            </h4>
                            <p className="text-slate-400 text-sm">
                              {session.location || 'Unknown Location'} • {session.ip_address}
                            </p>
                            <p className="text-slate-500 text-xs">
                              Last active: {formatDate(session.last_activity || session.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {!session.is_current && (
                          <button
                            onClick={() => revokeSession(session.id)}
                            className="text-red-400 hover:text-red-300 font-medium"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Log Tab */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white">Security Activity Log</h3>
                
                <div className="space-y-4">
                  {auditLog.map((event, index) => {
                    const EventIcon = getEventIcon(event.event_type);
                    return (
                      <div key={event.id || index} className="glass-card p-4">
                        <div className="flex items-center space-x-4">
                          <EventIcon className={`w-6 h-6 ${getEventColor(event.event_type)}`} />
                          <div className="flex-1">
                            <h4 className="text-white font-medium capitalize">
                              {event.event_type.replace('_', ' ')}
                            </h4>
                            <p className="text-slate-400 text-sm">
                              {formatDate(event.created_at)} • {event.ip_address} • {event.location || 'Unknown Location'}
                            </p>
                            {event.details && Object.keys(event.details).length > 0 && (
                              <p className="text-slate-500 text-xs mt-1">
                                {JSON.stringify(event.details)}
                              </p>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.success !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {event.success !== false ? 'Success' : 'Failed'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="text-center py-12">
                <CreditCardIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Billing Management</h3>
                <p className="text-slate-400 mb-6">
                  Advanced billing features are available in your main dashboard
                </p>
                <a
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all inline-block"
                >
                  Go to Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;