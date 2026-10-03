import React from 'react';
import { MatchResultCard } from './MatchResultCard';

export function MatchResultsList({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Results Yet</h3>
        <p className="text-slate-400 max-w-sm">
          Completed match results will appear here when they become officially available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {matches.map((match) => (
        <MatchResultCard key={match.id} match={match} />
      ))}
    </div>
  );
}
