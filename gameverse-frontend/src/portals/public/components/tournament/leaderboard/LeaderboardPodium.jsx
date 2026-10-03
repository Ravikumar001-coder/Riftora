import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LeaderboardPodium({ standings }) {
  if (!standings || standings.length < 3) return null;

  const top3 = [
    { ...standings[1], position: 2, height: 'h-32', color: 'bg-slate-300', text: 'text-slate-800', border: 'border-slate-300' },
    { ...standings[0], position: 1, height: 'h-40', color: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-400' },
    { ...standings[2], position: 3, height: 'h-24', color: 'bg-amber-600', text: 'text-amber-100', border: 'border-amber-600' }
  ];

  return (
    <div className="flex justify-center items-end gap-2 sm:gap-4 mb-16 mt-8">
      {top3.map(team => (
        <div key={team.teamSlug} className="flex flex-col items-center group w-24 sm:w-32">
          {/* Rank Move Indicator (Optional here, we'll keep it simple for podium) */}
          
          <Link to={`/teams/${team.teamSlug}`} className="flex flex-col items-center mb-3 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 ${team.border} shadow-lg mb-2`}>
              <img src={team.logo} alt={team.team} className="w-full h-full object-cover" />
            </div>
            <div className="font-display font-bold text-white text-center text-xs sm:text-sm truncate w-full px-1">{team.team}</div>
            <div className="text-xs font-bold text-blue-300">{team.points} PTS</div>
          </Link>
          
          <div className={`w-full ${team.height} ${team.color} rounded-t-lg flex flex-col items-center justify-start pt-2 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 10%, 0 20%)' }} />
            <Trophy className={`w-6 h-6 ${team.text} mb-1`} />
            <span className={`text-2xl font-display font-black ${team.text}`}>#{team.position}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
