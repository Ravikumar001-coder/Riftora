import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Settings, Shield, Lock, Check, X } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { ProfileTab } from '../components/settings/ProfileTab';
import { AccountTab } from '../components/settings/AccountTab';
import { PreferencesTab } from '../components/settings/PreferencesTab';
import { PrivacyTab } from '../components/settings/PrivacyTab';
import { SecurityTab } from '../components/settings/SecurityTab';
export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  // To handle unsaved changes warning
  const [isDirty, setIsDirty] = useState(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState(null);

  // Transient Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastIsError, setToastIsError] = useState(false);

  const showToast = (message, isError = false) => {
    setToastMessage(message);
    setToastIsError(isError);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleTabChange = (tabId) => {
    if (isDirty) {
      setPendingTabSwitch(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  // Completion calculation (mock)
  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;
    let total = 6;
    if (user.username) score++;
    if (user.display_name || user.displayName) score++;
    if (user.avatar_url || user.avatarUrl || user.avatar) score++;
    if (user.bio) score++;
    if (user.gameProfiles && user.gameProfiles.length > 0) score++;
    if (user.socialProfiles && Object.keys(user.socialProfiles).length > 0) score++;
    return Math.round((score / total) * 100);
  };

  const completionPct = calculateCompletion();

  const displayName = user?.display_name ?? user?.displayName ?? 'Unknown User';
  const username = user?.username ?? 'username';
  const avatarUrl = user?.avatar_url ?? user?.avatarUrl ?? user?.avatar;
  const rawRole = user?.platform_role ?? user?.platformRole;
  const onboardingPath = user?.onboarding_path ?? user?.onboardingPath;
  
  let displayRole = 'Player';
  if (rawRole === 'SUPER_ADMIN') displayRole = 'Super Admin';
  else if (onboardingPath === 'ORGANIZER') displayRole = 'Organizer';
  else if (onboardingPath === 'PRODUCTION') displayRole = 'Producer';

  return (
    <>
      
      <div className="flex-1 overflow-y-auto w-full z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Back Button */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 -ml-1" /> Back to Dashboard
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Profile & Settings</h1>
                <p className="text-slate-400">Manage your Riftora identity, account preferences, and privacy settings.</p>
              </div>
              <Link 
                to={`/profile/${user?.username}`} 
                className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                View Public Profile
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0 space-y-6">
              
              {/* Profile Preview */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{displayName}</h3>
                <p className="text-sm text-slate-400 mb-2">@{username}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {displayRole}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Completion Indicator */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 hidden lg:block">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Profile Completion</span>
                  <span className="text-xs font-bold text-blue-400">{completionPct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${completionPct}%` }}></div>
                </div>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className={`flex items-center gap-2 ${user?.username ? 'text-emerald-500' : ''}`}>
                    {user?.username ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />} Username
                  </li>
                  <li className={`flex items-center gap-2 ${avatarUrl ? 'text-emerald-500' : ''}`}>
                    {avatarUrl ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />} Avatar
                  </li>
                  <li className={`flex items-center gap-2 ${user?.bio ? 'text-emerald-500' : ''}`}>
                    {user?.bio ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />} Bio
                  </li>
                  <li className={`flex items-center gap-2 ${user?.gameProfiles?.length > 0 ? 'text-emerald-500' : ''}`}>
                    {user?.gameProfiles?.length > 0 ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />} Game Profile
                  </li>
                </ul>
              </div>

            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === 'profile' && (
                <ProfileTab 
                  user={user} 
                  onUpdateUser={updateUser} 
                  onToast={showToast} 
                  setIsDirty={setIsDirty} 
                />
              )}
              {activeTab === 'account' && (
                <AccountTab 
                  user={user} 
                  onToast={showToast} 
                />
              )}
              {activeTab === 'preferences' && (
                <PreferencesTab 
                  user={user} 
                  onUpdateUser={updateUser} 
                  onToast={showToast} 
                  setIsDirty={setIsDirty} 
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacyTab 
                  user={user} 
                  onUpdateUser={updateUser} 
                  onToast={showToast} 
                  setIsDirty={setIsDirty} 
                />
              )}
              {activeTab === 'security' && (
                <SecurityTab 
                  user={user} 
                  onToast={showToast} 
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      {pendingTabSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPendingTabSwitch(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Unsaved changes</h3>
            <p className="text-slate-400 text-sm mb-6">
              You have changes that haven't been saved.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPendingTabSwitch(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Keep Editing
              </button>
              <button 
                onClick={() => {
                  setIsDirty(false);
                  setActiveTab(pendingTabSwitch);
                  setPendingTabSwitch(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border ${
            toastIsError ? 'bg-red-950 border-red-900 text-red-200' : 'bg-slate-800 border-slate-700 text-slate-200'
          }`}>
            {toastIsError ? <X className="w-5 h-5 text-red-500" /> : <Check className="w-5 h-5 text-emerald-500" />}
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

    </>
  );
}
