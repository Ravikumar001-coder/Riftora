import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { ChatMessageList } from './ChatMessageList';
import { MessageSquare, Megaphone, Users, Settings2, X } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function ChatWidget({ tournament }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('viewer');

  // Logic to determine if user is a competitor or admin in this tournament
  // In a real app, this would check the user's role against the tournament's participants/staff lists
  const isCompetitor = user?.onboardingPath === 'player'; // Mock logic
  const isAdmin = user?.onboardingPath === 'organizer' || user?.platformRole === 'super_admin'; 

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    slowModeSeconds: 0,
    subscribersOnlyMode: false,
    competitorOnlyMode: false,
  });

  const tournamentId = tournament?.tournamentId || tournament?.id || tournament?.slug || 'unknown';

  const { data: fetchedSettings } = useQuery({
    queryKey: ['chatSettings', tournamentId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/tournaments/${tournamentId}/chat/settings`);
      return res.data.data;
    },
    enabled: !!tournamentId && tournamentId !== 'unknown',
  });

  // Sync fetched settings to local state when opening modal
  React.useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings, showSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      await api.put(`/api/v1/tournaments/${tournamentId}/chat/settings`, newSettings);
    },
    onSuccess: () => {
      setShowSettings(false);
      // could invalidate or toast
    },
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(settings);
  };

  return (
    <div className="flex flex-col h-[500px] gameverse-card rounded-xl border border-white/5 overflow-hidden">
      
      {/* Custom Tabs Header */}
      <div className="bg-[#0b1b36]/80 p-2 border-b border-white/5">
        <div className="grid w-full grid-cols-3 bg-black/40 rounded-lg p-1 gap-1">
          <button 
            onClick={() => setActiveTab('viewer')}
            className={`flex items-center justify-center text-xs font-bold py-1.5 px-3 rounded-md transition-colors ${activeTab === 'viewer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="w-3 h-3 mr-1" /> Viewer
          </button>
          
          <button 
            onClick={() => setActiveTab('competitor')}
            disabled={!isCompetitor && !isAdmin}
            className={`flex items-center justify-center text-xs font-bold py-1.5 px-3 rounded-md transition-colors ${activeTab === 'competitor' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'} disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <Users className="w-3 h-3 mr-1" /> Competitor
          </button>

          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center justify-center text-xs font-bold py-1.5 px-3 rounded-md transition-colors ${activeTab === 'announcements' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <Megaphone className="w-3 h-3 mr-1" /> Announce
          </button>

          {isAdmin && (
            <button 
              onClick={() => setShowSettings(true)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
              title="Chat Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'viewer' && (
          <ChatMessageList 
            tournamentId={tournament.tournamentId || tournament.id || tournament.slug} 
            channel="viewer"
            canSend={true} 
          />
        )}

        {activeTab === 'competitor' && (
          <ChatMessageList 
            tournamentId={tournament.tournamentId || tournament.id || tournament.slug} 
            channel="competitor"
            canSend={isCompetitor || isAdmin}
          />
        )}

        {activeTab === 'announcements' && (
          <ChatMessageList 
            tournamentId={tournamentId} 
            channel="announcements"
            canSend={isAdmin} // Only Admins can send Announcements
          />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="gameverse-card p-5 rounded-xl w-full max-w-sm border border-white/10 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Chat Settings</h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slow Mode (Seconds)</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white"
                  value={settings.slowModeSeconds}
                  onChange={e => setSettings({...settings, slowModeSeconds: parseInt(e.target.value)})}
                >
                  <option value={0}>Off</option>
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.subscribersOnlyMode}
                  onChange={e => setSettings({...settings, subscribersOnlyMode: e.target.checked})}
                  className="rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-sm text-slate-200">Subscribers Only Mode</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.competitorOnlyMode}
                  onChange={e => setSettings({...settings, competitorOnlyMode: e.target.checked})}
                  className="rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-sm text-slate-200">Competitor Only Mode</span>
              </label>

              <button 
                type="submit" 
                disabled={updateSettingsMutation.isPending}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
