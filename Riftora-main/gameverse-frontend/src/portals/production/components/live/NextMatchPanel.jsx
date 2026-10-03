import React from 'react';
import { CalendarClock, CheckCircle2, AlertTriangle } from 'lucide-react';

export function NextMatchPanel({ state }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <CalendarClock className="w-3.5 h-3.5" />
          Next Match
        </h2>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Match 05</h3>
            <p className="text-xs text-slate-400 mt-0.5">Miramar • Lobby B • 16 Teams</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Starts in 18:32</span>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Production Checklist</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Match Data
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Match Bar
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Leaderboard
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" /> Sponsor Pkg
            </div>
          </div>
        </div>

        <button 
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-700"
        >
          PREPARE NEXT MATCH
        </button>
      </div>
    </div>
  );
}
