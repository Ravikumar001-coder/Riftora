import React from 'react';
import { Medal, ExternalLink, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrizeDistribution({ distribution, currency, results }) {
  if (!distribution || distribution.length === 0) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMedalColor = (place) => {
    if (place.includes('1st')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (place.includes('2nd')) return 'text-slate-300 bg-slate-300/10 border-slate-300/30';
    if (place.includes('3rd')) return 'text-amber-600 bg-amber-600/10 border-amber-600/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getIcon = (place) => {
    if (place.includes('1st')) return <Trophy className="w-6 h-6" />;
    return <Medal className="w-6 h-6" />;
  };

  // Helper to find winner from results based on place
  const getWinnerForPlace = (place) => {
    if (!results || !results.standings) return null;
    
    // Simple matching logic based on place string (e.g., "1st Place", "2nd Place")
    let rank = null;
    if (place.includes('1st')) rank = 1;
    else if (place.includes('2nd')) rank = 2;
    else if (place.includes('3rd')) rank = 3;
    
    if (rank) {
      return results.standings.find(s => s.rank === rank) || null;
    }
    return null;
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
        Prize Distribution
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {distribution.map((prize) => {
          const medalStyle = getMedalColor(prize.place);
          const winner = getWinnerForPlace(prize.place);
          
          return (
            <div 
              key={prize.id}
              className="gameverse-card p-6 rounded-xl border border-white/5 bg-slate-800/30 flex flex-col hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${medalStyle}`}>
                  {getIcon(prize.place)}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white block">
                    {formatCurrency(prize.amount)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-1">{prize.place}</h3>
              {prize.description && (
                <p className="text-sm text-slate-400 mb-4 flex-grow">{prize.description}</p>
              )}
              
              {winner && (
                <div className="mt-auto pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block font-medium">Officially Awarded To</span>
                  <Link 
                    to={`/teams/${winner.teamSlug}`}
                    className="flex items-center gap-3 group"
                  >
                    <img src={winner.logo} alt={winner.team} className="w-8 h-8 rounded bg-slate-900" />
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors flex-grow">
                      {winner.team}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
