import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../../store/authStore';

export function PlayerSummaryCard({ player }) {
  const { user } = useAuthStore();
  const username = user?.username || player.username || 'player';
  const name = user?.username || player.name || 'Player';

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-slate-800 flex flex-shrink-0 items-center justify-center text-3xl font-bold text-slate-300 ring-4 ring-slate-800/50 shadow-xl">
            {username.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                LEVEL {player.level}
              </span>
            </div>
            
            <p className="text-slate-400 mb-2">@{username}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {player.status}
              </div>
              <span className="text-slate-600">•</span>
              <span>{player.game}</span>
              <span className="text-slate-600">•</span>
              <span>{player.region}</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400">{player.team}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="grid grid-cols-4 gap-4 text-center bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
            <div>
              <div className="text-xl font-bold text-white">{player.tournaments}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tourneys</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{player.matches}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Matches</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{player.wins}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Wins</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">{player.points.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Points</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to="/profile/me" className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
              View Profile
            </Link>
            <Link to="/profile/me#edit" className="flex-1 text-center py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700">
              Edit Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
