import React from 'react';
import { Trophy, Target, Activity } from 'lucide-react';

export function LeaderboardSummary({ standings, tournament }) {
  if (!standings || standings.length === 0) return null;

  const currentLeader = standings[0];
  const mostElims = [...standings].sort((a, b) => b.eliminations - a.eliminations)[0];
  
  // Assuming total matches could be dynamically known, or just max matches played so far
  const maxMatches = Math.max(...standings.map(s => s.matchesPlayed));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="gameverse-card rounded-xl p-5 border border-white/5 flex items-center gap-4 bg-gradient-to-br from-blue-900/20 to-transparent">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Current Leader</div>
          <div className="font-display font-bold text-white text-lg truncate">{currentLeader.team}</div>
          <div className="text-sm font-semibold text-slate-300">{currentLeader.points} Points</div>
        </div>
      </div>

      <div className="gameverse-card rounded-xl p-5 border border-white/5 flex items-center gap-4 bg-gradient-to-br from-red-900/20 to-transparent">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-red-300 font-bold uppercase tracking-wider mb-1">Most Eliminations</div>
          <div className="font-display font-bold text-white text-lg truncate">{mostElims.team}</div>
          <div className="text-sm font-semibold text-slate-300">{mostElims.eliminations} Eliminations</div>
        </div>
      </div>

      <div className="gameverse-card rounded-xl p-5 border border-white/5 flex items-center gap-4 bg-gradient-to-br from-emerald-900/20 to-transparent">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">Matches Played</div>
          <div className="font-display font-bold text-white text-xl">{maxMatches}</div>
          <div className="text-sm font-semibold text-slate-300">Across {standings.length} Teams</div>
        </div>
      </div>
    </div>
  );
}
