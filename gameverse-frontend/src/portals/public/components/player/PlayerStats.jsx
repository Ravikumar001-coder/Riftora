import React from 'react';
import { Trophy, Activity, Target, Medal } from 'lucide-react';

export function PlayerStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      <div className="gameverse-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Trophy className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tournaments</p>
          <p className="text-2xl font-bold text-white font-rajdhani">{stats.totalTournaments}</p>
        </div>
      </div>

      <div className="gameverse-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative">
          <Activity className="w-6 h-6 text-red-500" />
          {stats.activeEvents > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-[#0A1930]" />
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Events</p>
          <p className="text-2xl font-bold text-white font-rajdhani">{stats.activeEvents}</p>
        </div>
      </div>

      <div className="gameverse-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Target className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Matches</p>
          <p className="text-2xl font-bold text-white font-rajdhani">{stats.matchesPlayed?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="gameverse-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Medal className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Best Rank</p>
          <p className="text-2xl font-bold text-white font-rajdhani">{stats.bestPlacement}</p>
        </div>
      </div>
    </div>
  );
}
