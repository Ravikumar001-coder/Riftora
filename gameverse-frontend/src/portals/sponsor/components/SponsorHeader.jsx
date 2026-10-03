import React from 'react';
import { Link } from 'react-router-dom';

export function SponsorHeader({ tournament, sponsor }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-400 font-medium tracking-wide uppercase text-sm">Sponsor Dashboard</span>
          {tournament.status === 'LIVE' && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider animate-pulse flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
              Live
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{tournament.name}</h1>
        <p className="text-slate-400 text-sm">{tournament.game}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sponsor</p>
          <p className="text-white font-medium">{sponsor.name}</p>
        </div>
        <Link 
          to={`/t/${tournament.slug}`}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700 font-medium text-center"
        >
          View Tournament
        </Link>
      </div>
    </div>
  );
}
