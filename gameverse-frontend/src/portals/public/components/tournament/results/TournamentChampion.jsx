import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TournamentChampion({ champion }) {
  if (!champion) return null;

  return (
    <div className="relative gameverse-card rounded-xl border border-yellow-500/30 overflow-hidden mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
        
        <div className="flex flex-col items-center sm:items-start gap-2 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Tournament Champion
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            The Official Winner
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            After a grueling series of matches, the ultimate champion has been crowned.
          </p>
        </div>

        <div className="relative flex-shrink-0 group">
          <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full group-hover:bg-yellow-500/30 transition-all duration-500" />
          <Link 
            to={`/teams/${champion.teamSlug}`}
            className="relative flex flex-col items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-yellow-500/30 shadow-2xl hover:border-yellow-400/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative">
              <img 
                src={champion.logo} 
                alt={champion.team} 
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-xl bg-white/5 p-2 shadow-inner drop-shadow-xl"
              />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-slate-900 shadow-lg">
                <Medal className="w-4 h-4 text-slate-900" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-2xl font-black text-white tracking-wide group-hover:text-yellow-400 transition-colors">
                {champion.team}
              </h3>
              {champion.points && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 mt-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/50" />
                  <span className="text-sm font-bold text-yellow-400">{champion.points} PTS</span>
                </div>
              )}
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
