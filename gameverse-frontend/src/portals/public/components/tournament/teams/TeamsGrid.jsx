import React from 'react';
import { TeamCard } from './TeamCard';
import { UsersRound } from 'lucide-react';

export function TeamsGrid({ teams, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="gameverse-card p-6 h-64 animate-pulse bg-slate-800/50 rounded-xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="gameverse-card flex flex-col items-center justify-center p-16 text-center border border-white/5 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
          <UsersRound className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Teams Found</h3>
        <p className="text-slate-400 max-w-md">
          We couldn't find any teams matching your current filters. Try adjusting your search criteria or clearing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
