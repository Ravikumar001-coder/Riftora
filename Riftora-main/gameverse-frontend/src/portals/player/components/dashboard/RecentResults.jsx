import React from 'react';
import { Link } from 'react-router-dom';
import { Medal, ChevronRight } from 'lucide-react';

export function RecentResults({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-center text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No results yet</h3>
        <p className="text-slate-500 text-sm">Complete your first tournament match to see results here.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">RECENT RESULTS</span>
        <Link to="/t/riftora-championship/results" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
        {results.map((result) => (
          <div key={result.id} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <Medal className={`w-5 h-5 ${
                result.placement === '1st' ? 'text-yellow-400' :
                result.placement === '2nd' ? 'text-slate-300' :
                result.placement === '3rd' ? 'text-amber-600' :
                'text-slate-500'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate mb-0.5">{result.tournament}</h4>
              <p className="text-xs text-slate-400">{result.match}</p>
            </div>
            
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-white mb-0.5">{result.placement}</div>
              <div className="text-xs font-medium text-emerald-400">+{result.points} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
