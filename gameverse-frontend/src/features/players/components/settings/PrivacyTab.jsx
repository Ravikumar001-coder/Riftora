import React, { useState, useEffect } from 'react';
import { Eye, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyTab({ user, onUpdateUser, onToast, setIsDirty }) {
  
  const [profileVisibility, setProfileVisibility] = useState(user?.profileVisibility || 'public_view');

  const [privacy, setPrivacy] = useState({
    showMatchHistory: user?.privacy?.showMatchHistory ?? true,
    showGameIds: user?.privacy?.showGameIds ?? false,
    showSocialLinks: user?.privacy?.showSocialLinks ?? true,
  });

  useEffect(() => {
    // Check dirty state
    const isPrivacyChanged = JSON.stringify(privacy) !== JSON.stringify(user?.privacy || {
      showMatchHistory: true,
      showGameIds: false,
      showSocialLinks: true,
    });
    const isVisibilityChanged = profileVisibility !== (user?.profileVisibility || 'public_view');
    setIsDirty(isPrivacyChanged || isVisibilityChanged);
  }, [privacy, profileVisibility, user, setIsDirty]);

  const handleToggle = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onUpdateUser({ profileVisibility, privacy });
    setIsDirty(false);
    onToast("Privacy settings saved successfully", false);
  };

  return (
    <div className="space-y-8">
      
      {/* Privacy Settings */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-white">Privacy Controls</h3>
          </div>
          <Link 
            to={`/profile/${user?.username || 'me'}`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            <Eye className="w-4 h-4" /> Preview Public Profile
          </Link>
        </div>
        
        <div className="space-y-6">
          
          <div>
            <span className="block text-sm font-medium text-slate-300 mb-1">Profile Visibility</span>
            <span className="block text-xs text-slate-500 mb-4">Control who can view your player profile and stats.</span>
            
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${profileVisibility === 'public_view' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                <input type="radio" name="visibility" value="public_view" checked={profileVisibility === 'public_view'} onChange={() => setProfileVisibility('public_view')} className="mt-1" />
                <div>
                  <div className="text-sm font-medium text-slate-200">Public</div>
                  <div className="text-xs text-slate-500">Visible to everyone on the internet.</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${profileVisibility === 'platform' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                <input type="radio" name="visibility" value="platform" checked={profileVisibility === 'platform'} onChange={() => setProfileVisibility('platform')} className="mt-1" />
                <div>
                  <div className="text-sm font-medium text-slate-200">Platform Only</div>
                  <div className="text-xs text-slate-500">Visible only to registered Riftora users.</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${profileVisibility === 'private_view' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                <input type="radio" name="visibility" value="private_view" checked={profileVisibility === 'private_view'} onChange={() => setProfileVisibility('private_view')} className="mt-1" />
                <div>
                  <div className="text-sm font-medium text-slate-200">Private</div>
                  <div className="text-xs text-slate-500">Visible only to you.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <ToggleRow 
            label="Show Match History" 
            description="Allow visitors to see my past match results and tournament placements."
            checked={privacy.showMatchHistory} 
            onChange={() => handleToggle('showMatchHistory')} 
            disabled={profileVisibility === 'private_view'}
          />

          <div className="h-px bg-slate-800" />

          <ToggleRow 
            label="Show Game IDs" 
            description="Display connected game IDs publicly. Keep this off if you prefer to hide your in-game UID from the public."
            checked={privacy.showGameIds} 
            onChange={() => handleToggle('showGameIds')} 
            disabled={profileVisibility === 'private_view'}
          />

          <div className="h-px bg-slate-800" />

          <ToggleRow 
            label="Show Social Links" 
            description="Display social profiles and external links publicly on your profile."
            checked={privacy.showSocialLinks} 
            onChange={() => handleToggle('showSocialLinks')} 
            disabled={profileVisibility === 'private_view'}
          />

        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
        >
          Save Privacy Settings
        </button>
      </div>

    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, disabled }) {
  return (
    <div className={`flex items-start justify-between gap-6 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <span className="block text-sm font-medium text-slate-300 mb-1">{label}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </div>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          checked ? 'bg-blue-500' : 'bg-slate-700'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
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
