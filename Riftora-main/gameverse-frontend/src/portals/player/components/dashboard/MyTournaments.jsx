import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export function MyTournaments({ tournaments }) {
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No active tournaments</h3>
        <p className="text-slate-500 text-sm mb-4">Explore competitions and register for your next tournament.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700">
          Explore Tournaments
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden mb-8">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">MY TOURNAMENTS</span>
        <Link to="/explore" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="p-5 sm:p-6 grid gap-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-slate-950/50 rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row gap-6 hover:border-slate-700 transition-colors">
            
            {/* Header info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  {tournament.title}
                </h4>
              </div>
              <p className="text-sm text-slate-400 font-medium mb-4">
                {tournament.game} • {tournament.format}
              </p>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div>
                  <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Registration</div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> {tournament.status}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Next Match</div>
                  <div className="text-slate-300 font-medium">{tournament.nextMatch}</div>
                </div>
              </div>
            </div>

            {/* Progress & Action */}
            <div className="w-full md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800/50 pt-4 md:pt-0 md:pl-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-400 uppercase tracking-wider">Progress</span>
                  <span className="text-white">{tournament.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full" 
                    style={{ width: `${tournament.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <Link to={`/t/riftora-championship`} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-2">
                Open Tournament <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
