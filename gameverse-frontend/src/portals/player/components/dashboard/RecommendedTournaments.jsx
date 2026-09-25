import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, IndianRupee } from 'lucide-react';

export function RecommendedTournaments({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-300 tracking-wider">RECOMMENDED TOURNAMENTS</span>
        <Link to="/explore" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
          Explore All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((tournament) => (
          <div key={tournament.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col">
            <div className="h-24 bg-gradient-to-br from-blue-900/40 to-slate-900 flex items-center justify-center border-b border-slate-800/50">
              <span className="text-xl font-bold text-white/5 tracking-widest">{tournament.game}</span>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="text-xs font-bold text-blue-400 mb-1">{tournament.game}</div>
              <h4 className="text-base font-bold text-white mb-4 line-clamp-1">{tournament.title}</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5 font-medium">
                    <IndianRupee className="w-3 h-3" /> Prize Pool
                  </div>
                  <div className="text-sm font-bold text-emerald-400">{tournament.prize}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5 font-medium">
                    <Users className="w-3 h-3" /> Slots
                  </div>
                  <div className="text-sm font-bold text-white">{tournament.teams} Teams</div>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link 
                  to={tournament.action === 'Register' ? `/tournaments/${tournament.id}/register` : `/t/${tournament.id}`} 
                  className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  {tournament.action === 'Register' ? 'Register' : 'View Tournament'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
