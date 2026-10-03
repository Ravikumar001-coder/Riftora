import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MOCK_ADMIN_GAMES } from '../../admin/data/mockAdminGames';

export const GameSelectionCards = ({ value, onChange, error }) => {
  // Only show active games for team creation
  const availableGames = MOCK_ADMIN_GAMES.filter(g => g.status === 'Active');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableGames.map(game => {
          const isSelected = value === game.slug;
          return (
            <div
              key={game.id}
              onClick={() => onChange(game.slug)}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800'}
              `}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(game.slug);
                }
              }}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 overflow-hidden border border-slate-700 shadow-inner">
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-slate-600">
                    {game.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-white text-center">{game.name}</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">{game.category}</p>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}

      {value && (
        <div className="mt-4 p-4 rounded-lg bg-blue-950/30 border border-blue-900/50 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-blue-200 mb-1">
              {availableGames.find(g => g.slug === value)?.name} Team Rules
            </h4>
            <p className="text-sm text-blue-300/70">
              {(() => {
                const game = availableGames.find(g => g.slug === value);
                if (!game) return null;
                const rules = game.capabilities.teamRosterRules;
                if (!rules) return "Standard roster rules apply.";
                return `Roster configuration: ${rules.minPlayers} minimum players. Maximum ${rules.maxPlayers} main players${rules.maxSubstitutes > 0 ? ` + ${rules.maxSubstitutes} substitute(s)` : ''}.`;
              })()}
            </p>
          </div>
          <div className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-800">
            You can manage your roster after creating the team.
          </div>
        </div>
      )}
    </div>
  );
};
