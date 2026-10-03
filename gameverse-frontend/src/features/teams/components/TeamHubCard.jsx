import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, ExternalLink, Settings, Copy, Archive, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useLeaveTeam } from '../api/useTeamQueries';

export function TeamHubCard({ team, onArchive, onToast }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  
  const currentUser = useAuthStore(state => state.user);
  const leaveTeam = useLeaveTeam(team.teamId);

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam.mutateAsync();
      if (onToast) onToast("You have left the team.", false);
      setShowLeaveDialog(false);
    } catch (e) {
      if (onToast) onToast("Failed to leave team.", true);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/teams/${team.teamSlug}`;
    navigator.clipboard.writeText(link);
    if (onToast) {
      onToast("Team profile link copied.", false);
    }
    setDropdownOpen(false);
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

  const getInitials = (tag) => {
    return tag?.substring(0, 2).toUpperCase() || 'TM';
  };

  const isCaptain = team.captainUserId === currentUser?.userId;

  const totalRoster = team.totalMatches || 0; // Temp placeholder till member API is used
  const displayMaxRoster = 5;
  const status = team.isActive ? 'active' : 'inactive';

  return (
    <>
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-0.5">
        
        {/* Header Section */}
        <div className="p-5 flex items-start justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-4">
            {team.logoUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 ring-1 ring-slate-700 shrink-0">
                <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-slate-800 ring-1 ring-slate-700 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-white tracking-wider">{getInitials(team.teamTag)}</span>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
                {team.teamName}
              </h3>
              <div className="text-sm font-medium text-slate-400 mt-0.5">
                {team.teamTag}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
              team.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 grid grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Game</div>
            <div className="text-sm font-medium text-slate-200">{getGameName(team.gameId)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</div>
            <div className="text-sm font-medium text-blue-400">
              {isCaptain ? 'Captain • You' : 'Member'}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800/50 flex items-center gap-2">
          <Link 
            to={`/teams/${team.teamSlug}/manage`}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg text-center transition-colors border border-blue-500"
          >
            Manage Team
          </Link>
          
          <Link 
            to={`/teams/${team.teamSlug}`}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg text-center transition-colors border border-slate-700"
          >
            View Profile
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 flex items-center justify-center"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 bottom-full mb-2 z-50 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                  <Link 
                    to={`/teams/${team.teamSlug}`}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> View Public Profile
                  </Link>
                  <Link 
                    to={`/teams/${team.teamSlug}/manage`}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Manage Team
                  </Link>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy Team Link
                  </button>
                  {!isCaptain && (
                    <>
                      <div className="h-px bg-slate-800 my-1 mx-2" />
                      <button 
                        onClick={() => setShowLeaveDialog(true)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Leave Team
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowLeaveDialog(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Leave Team?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to leave <strong>{team.teamName}</strong>? You will lose access to team features.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLeaveDialog(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleLeaveTeam}
                disabled={leaveTeam.isPending}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                {leaveTeam.isPending ? 'Leaving...' : 'Leave Team'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
