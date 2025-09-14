import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
  BellIcon,
  CpuChipIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SecuritySettings = () => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({});
  const [sessions, setSessions] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [securityForm, setSecurityForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      const [securityResponse, sessionsResponse, auditResponse] = await Promise.all([
        axios.get(`${API}/security/security-settings`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/sessions`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/audit-log?limit=20`, { headers: getAuthHeaders() })
      ]);

      setSecuritySettings(securityResponse.data);
      setSessions(sessionsResponse.data.sessions || []);
      setAuditLog(auditResponse.data.events || []);

    } catch (error) {
      console.error('Failed to load security data:', error);
      
      // Get REAL security data from backend - no mock data
      const [securityResponse, sessionsResponse, auditResponse] = await Promise.all([
        axios.get(`${API}/security/security-settings`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/sessions`, { headers: getAuthHeaders() }),
        axios.get(`${API}/security/audit-log?limit=20`, { headers: getAuthHeaders() })
      ]);

      setSecuritySettings(securityResponse.data || {});
      setSessions(sessionsResponse.data.sessions || []);
      setAuditLog(auditResponse.data.events || []);
    } finally {
      setLoading(false);
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
      await loadSecurityData(); // Refresh security settings
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
      await loadSecurityData(); // Refresh security settings
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
      await loadSecurityData(); // Refresh sessions
    } catch (error) {
      console.error('Revoke all sessions failed:', error);
      alert('Failed to revoke sessions.');
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
          <p className="text-white text-lg">Loading security settings...</p>
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
              <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Security Settings</h1>
                <p className="text-slate-400 text-sm">Account protection and authentication</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                securitySettings.two_factor_enabled ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {securitySettings.two_factor_enabled ? '🔒 2FA Enabled' : '⚠️ 2FA Disabled'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Two-Factor Authentication */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
                  <p className="text-slate-400">Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {securitySettings.two_factor_enabled ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-medium">Enabled</span>
                    <button
                      onClick={disable2FA}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                    >
                      Disable
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={setup2FA}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Enable 2FA
                  </button>
                )}
              </div>
            </div>
            
            {twoFactorSetup && (
              <div className="mt-6 p-6 bg-slate-800/50 rounded-xl border border-slate-600">
                <h4 className="text-white font-medium mb-4">Set Up Two-Factor Authentication</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-300 mb-4">
                      1. Install an authenticator app like Google Authenticator or Authy
                    </p>
                    <p className="text-slate-300 mb-4">
                      2. Scan this QR code with your app:
                    </p>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img src={twoFactorSetup.qr_code} alt="2FA QR Code" className="max-w-48" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-300 mb-4">
                      3. Enter the 6-digit code from your app:
                    </p>
                    <input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg text-center text-2xl tracking-widest font-mono"
                      onChange={(e) => {
                        if (e.target.value.length === 6) {
                          verify2FA(e.target.value);
                        }
                      }}
                    />
                    <p className="text-slate-400 text-xs mt-3">
                      Or enter secret key manually:<br />
                      <code className="bg-slate-700 px-2 py-1 rounded text-xs font-mono">
                        {twoFactorSetup.secret}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <BellIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Enhanced Security</h4>
                  <p className="text-slate-300 text-sm">
                    Two-factor authentication significantly improves your account security by requiring 
                    both your password and a time-based code from your authenticator app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <KeyIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Change Password</h3>
                <p className="text-slate-400">Update your account password</p>
              </div>
            </div>
            
            <form onSubmit={changePassword} className="space-y-6">
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
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium mb-1">Password Requirements:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Active Sessions</h3>
                  <p className="text-slate-400">Manage your logged-in devices</p>
                </div>
              </div>
              <button
                onClick={revokeAllSessions}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
              >
                Log Out All Devices
              </button>
            </div>
            
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium flex items-center space-x-2">
                          <span>{session.device || 'Unknown Device'}</span>
                          {session.is_current && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
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
                        className="text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Summary */}
          <div className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CpuChipIcon className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Security Summary</h3>
                <p className="text-slate-400">Your account security overview</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Two-Factor Authentication:</span>
                    <div className="flex items-center space-x-2">
                      {securitySettings.two_factor_enabled ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                      )}
                      <span className={securitySettings.two_factor_enabled ? 'text-green-400' : 'text-yellow-400'}>
                        {securitySettings.two_factor_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Password Last Changed:</span>
                    <span className="text-white text-sm">
                      {securitySettings.password_last_changed ? 
                        formatDate(securitySettings.password_last_changed) : 
                        'Never'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Active Sessions:</span>
                    <span className="text-white font-medium">{sessions.length}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Login Notifications:</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Enabled</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Security Alerts:</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Enabled</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Backup Codes:</span>
                    <span className="text-white font-medium">
                      {securitySettings.backup_codes_remaining || 0} remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Score */}
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <LockClosedIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white font-medium">Security Score</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {securitySettings.two_factor_enabled ? '95%' : '75%'}
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: securitySettings.two_factor_enabled ? '95%' : '75%' }}
                  ></div>
                </div>
                <p className="text-slate-300 text-sm mt-2">
                  {securitySettings.two_factor_enabled 
                    ? 'Excellent! Your account is highly secure.'
                    : 'Good, but enable 2FA for maximum security.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Activity Log */}
        <div className="mt-8 glass-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Security Activity Log</h3>
              <p className="text-slate-400">Recent security events and activities</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {auditLog.map((event, index) => {
              const EventIcon = getEventIcon(event.event_type);
              return (
                <div key={event.id || index} className="glass-card p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <EventIcon className={`w-6 h-6 ${getEventColor(event.event_type)}`} />
                    </div>
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
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
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
      </div>
    </div>
  );
};

export default SecuritySettings;