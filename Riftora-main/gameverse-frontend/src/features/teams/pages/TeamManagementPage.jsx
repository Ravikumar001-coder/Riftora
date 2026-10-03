import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_TEAMS } from '../data/mockTeams';
import { ChevronLeft, Check, X, Shield, Users, Activity, Settings, LayoutDashboard, Copy, ExternalLink, Mail, Trophy, History } from 'lucide-react';
import { ManageOverviewTab } from '../components/manage/ManageOverviewTab';
import { ManageRosterTab } from '../components/manage/ManageRosterTab';
import { ManageRosterHistoryTab } from '../components/manage/ManageRosterHistoryTab';
import { ManageInvitationsTab } from '../components/manage/ManageInvitationsTab';
import { ManageProfileTab } from '../components/manage/ManageProfileTab';
import { ManageTournamentsTab } from '../components/manage/ManageTournamentsTab';
import { ManageSettingsTab } from '../components/manage/ManageSettingsTab';
import { ManageFinanceTab } from '../components/manage/ManageFinanceTab';
import { DollarSign } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useGetTeamBySlug } from '../api/useTeamQueries';

export function TeamManagementPage() {
  const { teamSlug } = useParams();
  const navigate = useNavigate();
  
  // Local state to simulate backend updates
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // To handle unsaved changes warning
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState(null);

  // Current user
  const currentUser = useAuthStore(state => state.user);

  // TanStack Query
  const { data: teamData, isLoading: queryLoading, error: queryError } = useGetTeamBySlug(teamSlug);

  // Transient Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastIsError, setToastIsError] = useState(false);

  const showToast = (message, isError = false) => {
    setToastMessage(message);
    setToastIsError(isError);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (!loading && teamData) {
      if (teamData.captainUserId !== currentUser?.userId) {
        // Unauthorized, redirect to public profile
        navigate(`/teams/${teamSlug}`, { replace: true });
        return;
      }
      setTeam(teamData);
    } else if (queryError) {
      setError('not-found');
    }
  }, [teamData, loading, queryError, currentUser, teamSlug, navigate]);

  const handleTabChange = (tabId) => {
    if (isProfileDirty && activeTab === 'profile') {
      setPendingTabSwitch(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleUpdateTeam = (updates) => {
    setTeam(prev => ({ ...prev, ...updates }));
  };

  const copyProfileLink = () => {
    const url = `${window.location.origin}/teams/${team.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Team profile link copied.", false);
    }).catch(() => {
      showToast("Failed to copy link.", true);
    });
  };

  const getGameName = (gameId) => {
    const games = {
      'bgmi': 'BGMI',
      'free-fire-max': 'Free Fire MAX',
      'valorant': 'Valorant',
      'pokemon-unite': 'Pokémon UNITE'
    };
    return games[gameId] || gameId;
  };

  const getInitials = (tag) => tag?.substring(0, 2).toUpperCase() || 'TM';

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
          <div className="h-32 bg-slate-900/50 rounded-2xl border border-slate-800"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-24 bg-slate-800 rounded-lg"></div>)}
          </div>
          <div className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (error === 'not-found' || !team) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Team not found</h2>
        <p className="text-slate-400 mb-6 text-center max-w-md">
          The team you're looking for doesn't exist or is no longer available.
        </p>
        <Link 
          to="/teams/my-team" 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
        >
          Back to My Teams
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'invitations', label: 'Invitations', icon: Mail },
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto w-full z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Back Button */}
          <Link 
            to="/teams/my-team" 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to My Teams"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            {team.bannerUrl && (
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img src={team.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                {team.logoUrl ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shadow-xl border border-slate-700">
                    <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center shadow-xl border border-slate-700">
                    <span className="text-3xl font-bold text-white tracking-wider">{getInitials(team.teamTag)}</span>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{team.teamName}</h1>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">{team.teamTag}</span>
                    {!team.isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">Archived</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${team.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className="uppercase">{team.isActive ? 'active' : 'inactive'}</span>
                    </div>
                    <span>•</span>
                    <span className="text-blue-400">{getGameName(team.gameId)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Captain: You</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link 
                  to={`/teams/${team.slug}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" /> View Profile
                </Link>
                <button 
                  onClick={copyProfileLink}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 shadow-sm"
                  title="Copy Profile Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* If Archived, show message and disable edits */}
          {!team.isActive ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-3 opacity-80" />
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Archived</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                This team is archived. You cannot modify the roster or settings. 
                Restore functionality is not implemented in this mock environment.
              </p>
              <Link 
                to="/teams/my-team" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors mt-6"
              >
                Back to My Teams
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Tabs */}
              <div className="lg:w-64 shrink-0">
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
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {activeTab === 'overview' && (
                  <ManageOverviewTab team={team} />
                )}
                {activeTab === 'roster' && (
                  <ManageRosterTab 
                    team={team} 
                    onUpdateRoster={(roster) => handleUpdateTeam({ roster })}
                    onToast={showToast} 
                  />
                )}
                {activeTab === 'history' && (
                  <ManageRosterHistoryTab team={team} />
                )}
                {activeTab === 'tournaments' && (
                  <ManageTournamentsTab team={team} onToast={showToast} />
                )}
                {activeTab === 'finance' && (
                  <ManageFinanceTab team={team} onToast={showToast} />
                )}
                {activeTab === 'invitations' && (
                  <ManageInvitationsTab 
                    team={team} 
                    onUpdateInvitations={(invitations) => handleUpdateTeam({ invitations })}
                    onToast={showToast}
                  />
                )}
                {activeTab === 'profile' && (
                  <ManageProfileTab 
                    team={team} 
                    onUpdateProfile={handleUpdateTeam}
                    onToast={showToast}
                    setIsDirty={setIsProfileDirty}
                  />
                )}
                {activeTab === 'settings' && (
                  <ManageSettingsTab 
                    team={team} 
                    onUpdateTeam={handleUpdateTeam}
                    onToast={showToast}
                  />
                )}
              </div>
            </div>
          )}

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
                Continue Editing
              </button>
              <button 
                onClick={() => {
                  setIsProfileDirty(false);
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
