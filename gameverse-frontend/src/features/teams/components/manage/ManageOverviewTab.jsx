import React from 'react';
import { Activity, Users, Shield, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ManageOverviewTab({ team }) {
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

  const totalRoster = team.roster?.filter(r => r.role === 'player' || r.role === 'captain').length || 0;
  const maxRoster = team.gameId === 'bgmi' || team.gameId === 'valorant' || team.gameId === 'pokemon-unite' ? 5 : (team.gameId === 'free-fire-max' ? 5 : 5);
  
  const totalSubstitutes = team.roster?.filter(r => r.role === 'substitute').length || 0;
  const maxSubstitutes = team.gameId === 'free-fire-max' ? 7 : (team.gameId === 'bgmi' ? 1 : 2);

  const pendingInvitations = team.invitations?.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-slate-300 text-sm tracking-wide uppercase">Team Status</h3>
          </div>
          <p className="text-2xl font-bold text-white uppercase tracking-wider mt-2">{team.isActive ? 'Active' : 'Inactive'}</p>
          <p className="text-xs text-slate-500 mt-1">Available for normal activities</p>
        </div>

        {/* Primary Game */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-slate-300 text-sm tracking-wide uppercase">Primary Game</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{getGameName(team.gameId)}</p>
        </div>

        {/* Roster & Substitutes */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold text-slate-300 text-sm tracking-wide uppercase">Roster</h3>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{totalRoster} <span className="text-sm font-normal text-slate-500">/ {maxRoster} Main</span></p>
              <p className="text-sm text-slate-400 mt-0.5">{totalSubstitutes} / {maxSubstitutes} Subs</p>
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-semibold text-slate-300 text-sm tracking-wide uppercase">Pending Invites</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{pendingInvitations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
              <div>
                <p className="text-slate-300 font-medium">Team profile updated</p>
                <p className="text-slate-500 text-sm">Today, 2:30 PM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
              <div>
                <p className="text-slate-300 font-medium">Roster updated</p>
                <p className="text-slate-500 text-sm">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Public Profile</h3>
          
          <div className="flex-1 border border-slate-800 bg-slate-950/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            {team.logoUrl ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 mb-3">
                <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-white tracking-wider">{getInitials(team.teamTag)}</span>
              </div>
            )}
            <h4 className="font-bold text-white text-lg">{team.teamName}</h4>
            <span className="text-sm text-slate-400">{team.teamTag}</span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-1">{getGameName(team.gameId)}</span>
          </div>

          <Link 
            to={`/teams/${team.slug}`}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            View Public Profile <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
