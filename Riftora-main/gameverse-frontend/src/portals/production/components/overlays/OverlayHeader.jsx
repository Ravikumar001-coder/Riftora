import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Play, ArrowLeft, CheckCircle2, AlertTriangle, MonitorPlay } from 'lucide-react';
import { overlayTypes, getStatus } from './overlayDefaults';

export function OverlayHeader({ tournament, tournamentId, configs }) {
  // Calculate status summary
  let ready = 0;
  let needsAttention = 0;
  let disabled = 0;

  overlayTypes.forEach(t => {
    const status = getStatus(t.id, configs[t.id]);
    if (status === 'READY' || status === 'ACTIVE') ready++;
    else if (status === 'NEEDS ATTENTION') needsAttention++;
    else disabled++;
  });

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 md:px-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-50">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Link 
            to={`/production/${tournamentId}/dashboard`}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
            RIFTORA PRODUCTION
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
          Overlay Configuration
        </h1>
        <div className="text-sm font-medium text-slate-400 mt-1">
          {tournament.name} <span className="mx-1.5 opacity-50">•</span> {tournament.game}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-3 mr-4">
          <div className="bg-slate-800/50 rounded-lg px-3 py-1.5 flex flex-col border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-500">Overlays</span>
            <span className="text-sm font-bold text-white">{overlayTypes.length} Total</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-3 py-1.5 flex flex-col border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-emerald-500/70">Ready</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm font-bold text-white">{ready}</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-3 py-1.5 flex flex-col border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-amber-500/70">Attention</span>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-bold text-white">{needsAttention}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/production/${tournamentId}/dashboard`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          >
            Dashboard
          </Link>
          <Link 
            to={`/production/${tournamentId}/live`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-900/20"
          >
            <MonitorPlay className="w-4 h-4" />
            Live Control
          </Link>
        </div>
      </div>
    </div>
  );
}
