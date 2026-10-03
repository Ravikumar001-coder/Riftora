import React, { useState, useEffect } from 'react';
import { Camera, Gamepad2, Plus, Trash2, Globe, User, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useAvatarUploadMutation } from '../../api/useProfileMutations';
import { useLinkedAccounts, useAddLinkedAccountMutation, useDeleteLinkedAccountMutation } from '../../api/useLinkedAccounts';
import { useGames } from '../../../games/api/useGames';
import { VerificationModal } from './VerificationModal';

export function ProfileTab({ user, onUpdateUser, onToast, setIsDirty }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || null,
    socialProfiles: user?.socialProfiles || {}
  });

  const [newLinkedAccount, setNewLinkedAccount] = useState({ gameId: '', inGameUid: '', inGameName: '' });
  const [isLinking, setIsLinking] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(null);

  const { data: linkedAccounts = [], isLoading: isLoadingLinkedAccounts } = useLinkedAccounts();
  const { data: games = [] } = useGames();
  const addLinkedAccountMutation = useAddLinkedAccountMutation();
  const deleteLinkedAccountMutation = useDeleteLinkedAccountMutation();

  const [errors, setErrors] = useState({});
  const uploadAvatarMutation = useAvatarUploadMutation();

  useEffect(() => {
    // Check for dirty state
    const isChanged = 
      formData.username !== (user?.username || '') ||
      formData.displayName !== (user?.displayName || '') ||
      formData.bio !== (user?.bio || '') ||
      formData.location !== (user?.location || '') ||
      formData.avatar !== (user?.avatar || null) ||
      JSON.stringify(formData.socialProfiles) !== JSON.stringify(user?.socialProfiles || {});
      
    setIsDirty(isChanged);
  }, [formData, user, setIsDirty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation
    if (name === 'username') {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        setErrors(prev => ({ ...prev, username: 'Username can only contain alphanumeric characters and underscores (3-20 chars).' }));
      } else {
        setErrors(prev => ({ ...prev, username: null }));
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onToast("File size must be less than 2MB.", true);
        return;
      }
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      uploadAvatarMutation.mutate(formData, {
        onSuccess: (data) => {
          // Assuming the backend returns the URL in data.data.avatarUrl
          const avatarUrl = data.data?.avatarUrl || data.avatarUrl;
          
          setFormData(prev => ({ ...prev, avatar: avatarUrl }));
          // Update the global store directly for immediate UI reflection
          onUpdateUser({ avatar: avatarUrl });
          onToast("Avatar uploaded successfully", false);
        },
        onError: (err) => {
          onToast(err.response?.data?.error?.message || "Failed to upload avatar", true);
        }
      });
    }
  };

  const handleAddLinkedAccount = () => {
    if (!newLinkedAccount.gameId || !newLinkedAccount.inGameUid) {
      onToast("Game and UID are required.", true);
      return;
    }
    addLinkedAccountMutation.mutate(newLinkedAccount, {
      onSuccess: () => {
        onToast("Game account linked successfully.", false);
        setNewLinkedAccount({ gameId: '', inGameUid: '', inGameName: '' });
        setIsLinking(false);
      },
      onError: (err) => {
        onToast(err.response?.data?.error?.message || "Failed to link account", true);
      }
    });
  };

  const handleRemoveLinkedAccount = (linkedId) => {
    deleteLinkedAccountMutation.mutate(linkedId, {
      onSuccess: () => onToast("Game account unlinked.", false),
      onError: (err) => onToast(err.response?.data?.error?.message || "Failed to unlink account", true)
    });
  };

  const addSocialProfile = () => {
    const defaultKey = `platform_${Object.keys(formData.socialProfiles).length}`;
    setFormData(prev => ({
      ...prev,
      socialProfiles: { ...prev.socialProfiles, [defaultKey]: '' }
    }));
  };

  const updateSocialProfile = (oldKey, newKey, value) => {
    const newSocials = { ...formData.socialProfiles };
    if (oldKey !== newKey) {
      delete newSocials[oldKey];
    }
    newSocials[newKey] = value;
    setFormData(prev => ({ ...prev, socialProfiles: newSocials }));
  };

  const removeSocialProfile = (key) => {
    const newSocials = { ...formData.socialProfiles };
    delete newSocials[key];
    setFormData(prev => ({ ...prev, socialProfiles: newSocials }));
  };

  const handleSave = () => {
    if (errors.username) {
      onToast("Please fix validation errors before saving.", true);
      return;
    }
    onUpdateUser(formData);
    setIsDirty(false);
    onToast("Profile updated successfully", false);
  };

  return (
    <div className="space-y-8">
      
      {/* Avatar Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Avatar</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <div>
            <input 
              type="file" 
              id="avatar-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <label 
              htmlFor="avatar-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700 mb-2 ${uploadAvatarMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {uploadAvatarMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Camera className="w-4 h-4" /> Change Avatar</>
              )}
            </label>
            <p className="text-xs text-slate-400">Recommended: Square image, max 2MB. JPG or PNG.</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white mb-2">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">@</span>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full bg-slate-950 border ${errors.username ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'} text-white rounded-lg pl-8 pr-4 py-2.5 focus:outline-none transition-colors`}
              />
            </div>
            {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Display Name</label>
            <input 
              type="text" 
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-slate-300">Bio</label>
            <span className="text-xs text-slate-500">{formData.bio.length} / 160</span>
          </div>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={160}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Location</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. India"
            className="w-full md:w-1/2 bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Game Profiles */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Linked Game Accounts</h3>
            <p className="text-sm text-slate-400">Link your in-game identities for tournament registration.</p>
          </div>
          {!isLinking && (
            <button 
              onClick={() => setIsLinking(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 text-sm font-medium rounded-lg transition-colors border border-blue-500/20"
            >
              <Plus className="w-4 h-4" /> Link Account
            </button>
          )}
        </div>

        <div className="space-y-4">
          {isLoadingLinkedAccounts ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
          ) : linkedAccounts.length === 0 && !isLinking ? (
            <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No game accounts linked yet.</p>
            </div>
          ) : (
            linkedAccounts.map((account) => (
              <div key={account.linkedId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Game</label>
                    <p className="text-sm text-white font-medium">{account.gameName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">In-Game Name</label>
                    <p className="text-sm text-white font-medium">{account.inGameName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">UID</label>
                    <p className="text-sm text-slate-300 font-mono">{account.inGameUid}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                    <div className="flex items-center gap-1.5">
                      {account.status === 'verified' ? (
                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> <span className="text-xs text-green-500 font-medium">Verified</span></>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> <span className="text-xs text-amber-500 font-medium">Pending</span>
                          <button 
                            onClick={() => setVerifyingAccount(account)}
                            className="ml-2 px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-[10px] uppercase font-bold hover:bg-blue-600/40 transition-colors"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveLinkedAccount(account.linkedId)}
                  disabled={deleteLinkedAccountMutation.isPending}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                  title="Unlink Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {isLinking && (
             <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-900 border border-blue-500/30 rounded-lg relative">
               <div className="w-full md:w-1/3">
                 <label className="block text-xs font-medium text-slate-400 mb-1">Select Game</label>
                 <select 
                   value={newLinkedAccount.gameId}
                   onChange={(e) => setNewLinkedAccount(prev => ({ ...prev, gameId: e.target.value }))}
                   className="w-full bg-slate-950 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                 >
                   <option value="" disabled>Select a Game</option>
                   {games.map(g => <option key={g.gameId} value={g.gameId}>{g.gameName}</option>)}
                 </select>
               </div>
               <div className="w-full md:w-1/3">
                 <label className="block text-xs font-medium text-slate-400 mb-1">In-Game Name (Optional)</label>
                 <input 
                   type="text" 
                   value={newLinkedAccount.inGameName}
                   onChange={(e) => setNewLinkedAccount(prev => ({ ...prev, inGameName: e.target.value }))}
                   placeholder="e.g. PlayerOP"
                   className="w-full bg-slate-950 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                 />
               </div>
               <div className="w-full md:w-1/3">
                 <label className="block text-xs font-medium text-slate-400 mb-1">Player ID / UID</label>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={newLinkedAccount.inGameUid}
                     onChange={(e) => setNewLinkedAccount(prev => ({ ...prev, inGameUid: e.target.value }))}
                     placeholder="e.g. 512345678"
                     className="w-full bg-slate-950 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                   />
                   <button 
                     onClick={handleAddLinkedAccount}
                     disabled={addLinkedAccountMutation.isPending}
                     className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors disabled:opacity-50 whitespace-nowrap text-sm font-medium"
                   >
                     {addLinkedAccountMutation.isPending ? 'Linking...' : 'Link'}
                   </button>
                   <button 
                     onClick={() => setIsLinking(false)}
                     className="p-2 text-slate-400 hover:text-white rounded-md transition-colors"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Social Profiles */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Social Profiles</h3>
            <p className="text-sm text-slate-400">Link your social media and streaming accounts.</p>
          </div>
          <button 
            onClick={addSocialProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 text-sm font-medium rounded-lg transition-colors border border-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(formData.socialProfiles).length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-lg">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No social links added yet.</p>
            </div>
          ) : (
            Object.entries(formData.socialProfiles).map(([key, value], idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg relative">
                <div className="w-1/3">
                  <select 
                    value={key.startsWith('platform_') ? '' : key}
                    onChange={(e) => updateSocialProfile(key, e.target.value || `platform_${idx}`, value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Select Platform</option>
                    <option value="discord">Discord</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X (Twitter)</option>
                    <option value="twitch">Twitch</option>
                    <option value="website">Website</option>
                  </select>
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={value}
                      onChange={(e) => updateSocialProfile(key, key, e.target.value)}
                      placeholder={key === 'discord' ? 'Username#0000' : 'https://...'}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => removeSocialProfile(key)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <button 
          onClick={() => {
            // Reset to user data
            setFormData({
              username: user?.username || '',
              displayName: user?.displayName || '',
              bio: user?.bio || '',
              location: user?.location || '',
              avatar: user?.avatar || null,
              socialProfiles: user?.socialProfiles || {}
            });
            setIsDirty(false);
          }}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
        >
          Save Changes
        </button>
      </div>

      {verifyingAccount && (
        <VerificationModal 
          account={verifyingAccount} 
          onClose={() => setVerifyingAccount(null)} 
          onToast={onToast} 
        />
      )}
    </div>
  );
}
