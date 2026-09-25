import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Bell } from 'lucide-react';

export function PreferencesTab({ user, onUpdateUser, onToast, setIsDirty }) {
  
  const [prefs, setPrefs] = useState({
    theme: user?.preferences?.theme || 'system',
    language: user?.preferences?.language || 'en',
    timezone: user?.preferences?.timezone || 'Asia/Kolkata',
    notifications: {
      matchStarting: user?.preferences?.notifications?.matchStarting ?? true,
      roomCredentials: user?.preferences?.notifications?.roomCredentials ?? true,
      matchDelayed: user?.preferences?.notifications?.matchDelayed ?? true,
      resultsPublished: user?.preferences?.notifications?.resultsPublished ?? true,
      registrationUpdates: user?.preferences?.notifications?.registrationUpdates ?? true,
      scheduleChanges: user?.preferences?.notifications?.scheduleChanges ?? true,
      marketing: user?.preferences?.notifications?.marketing ?? false,
    }
  });

  useEffect(() => {
    // Check dirty state
    const isChanged = JSON.stringify(prefs) !== JSON.stringify(user?.preferences || {
      theme: 'system',
      language: 'en',
      timezone: 'Asia/Kolkata',
      notifications: {
        matchStarting: true,
        roomCredentials: true,
        matchDelayed: true,
        resultsPublished: true,
        registrationUpdates: true,
        scheduleChanges: true,
        marketing: false,
      }
    });
    setIsDirty(isChanged);
  }, [prefs, user, setIsDirty]);

  const handleToggle = (key) => {
    setPrefs(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSave = () => {
    onUpdateUser({ preferences: prefs });
    setIsDirty(false);
    onToast("Preferences saved successfully", false);
  };

  return (
    <div className="space-y-8">
      
      {/* General Settings */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">General</h3>
        
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Theme</p>
              <p className="text-xs text-slate-500">Choose how Riftora looks to you.</p>
            </div>
            <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button 
                onClick={() => setPrefs(p => ({ ...p, theme: 'light' }))}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${prefs.theme === 'light' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => setPrefs(p => ({ ...p, theme: 'dark' }))}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${prefs.theme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button 
                onClick={() => setPrefs(p => ({ ...p, theme: 'system' }))}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${prefs.theme === 'system' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Monitor className="w-4 h-4" /> System
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Language</label>
              <select 
                value={prefs.language}
                onChange={(e) => setPrefs(p => ({ ...p, language: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Timezone</label>
              <select 
                value={prefs.timezone}
                onChange={(e) => setPrefs(p => ({ ...p, timezone: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Schedules will be displayed in this timezone.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
        </div>
        
        <div className="space-y-6">
          
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Match Day</h4>
            <div className="space-y-3">
              <ToggleRow 
                label="Match starting soon" 
                checked={prefs.notifications.matchStarting} 
                onChange={() => handleToggle('matchStarting')} 
              />
              <ToggleRow 
                label="Room credentials released" 
                checked={prefs.notifications.roomCredentials} 
                onChange={() => handleToggle('roomCredentials')} 
              />
              <ToggleRow 
                label="Match delayed or paused" 
                checked={prefs.notifications.matchDelayed} 
                onChange={() => handleToggle('matchDelayed')} 
              />
              <ToggleRow 
                label="Results published" 
                checked={prefs.notifications.resultsPublished} 
                onChange={() => handleToggle('resultsPublished')} 
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tournaments</h4>
            <div className="space-y-3">
              <ToggleRow 
                label="Registration updates" 
                checked={prefs.notifications.registrationUpdates} 
                onChange={() => handleToggle('registrationUpdates')} 
              />
              <ToggleRow 
                label="Schedule changes" 
                checked={prefs.notifications.scheduleChanges} 
                onChange={() => handleToggle('scheduleChanges')} 
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Delivery Channels</h4>
            <div className="space-y-3">
              <ToggleRow 
                label="In-App Notifications" 
                checked={prefs.notifications.inAppEnabled} 
                onChange={() => handleToggle('inAppEnabled')} 
              />
              <ToggleRow 
                label="Push Notifications" 
                checked={prefs.notifications.pushEnabled} 
                onChange={() => handleToggle('pushEnabled')} 
              />
              <ToggleRow 
                label="SMS Notifications" 
                checked={prefs.notifications.smsEnabled} 
                onChange={() => handleToggle('smsEnabled')} 
              />
              <ToggleRow 
                label="Email Notifications" 
                checked={prefs.notifications.emailEnabled} 
                onChange={() => handleToggle('emailEnabled')} 
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Do Not Disturb</h4>
              <ToggleRow 
                label="" 
                checked={prefs.notifications.doNotDisturbEnabled} 
                onChange={() => handleToggle('doNotDisturbEnabled')} 
              />
            </div>
            {prefs.notifications.doNotDisturbEnabled && (
              <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Time</label>
                  <input type="time" value={prefs.notifications.dndStartTime || '22:00'} onChange={(e) => setPrefs({...prefs, notifications: {...prefs.notifications, dndStartTime: e.target.value}})} className="w-full bg-slate-900 border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Time</label>
                  <input type="time" value={prefs.notifications.dndEndTime || '08:00'} onChange={(e) => setPrefs({...prefs, notifications: {...prefs.notifications, dndEndTime: e.target.value}})} className="w-full bg-slate-900 border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-3">When enabled, SMS and Push notifications will be suppressed during this window.</p>
          </div>

          <div className="h-px bg-slate-800" />

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Language</h4>
            <div className="space-y-3">
              <select
                value={prefs.notifications.preferredLanguage || 'en'}
                onChange={(e) => setPrefs({...prefs, notifications: {...prefs.notifications, preferredLanguage: e.target.value}})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="kn">Kannada</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
        >
          Save Preferences
        </button>
      </div>

    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          checked ? 'bg-blue-500' : 'bg-slate-700'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-2' : '-translate-x-2'
          }`}
        />
      </button>
    </div>
  );
}
