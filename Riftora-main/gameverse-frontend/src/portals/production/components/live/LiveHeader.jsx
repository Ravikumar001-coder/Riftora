import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Radio } from 'lucide-react';
import { formatTime } from './utils';
import { ObsConnectionPanel } from './ObsConnectionPanel';

export function LiveHeader({ state, tournamentId }) {
  const isLive = state.broadcastStatus === 'LIVE' || state.broadcastStatus === 'PAUSED' || state.broadcastStatus === 'BREAK';

  return (
    <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Riftora</span>
          <span className="text-sm font-semibold text-white">Production</span>
        </div>

        <div className="h-8 w-px bg-slate-800 mx-2" />

        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200">Riftora Championship 2026</span>
          <span className="text-xs text-slate-400">BGMI • Grand Finals</span>
        </div>

        <div className="h-8 w-px bg-slate-800 mx-2" />

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isLive ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
            <Radio className={`w-3 h-3 ${isLive ? 'animate-pulse' : ''}`} />
            {state.broadcastStatus}
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Current Match</span>
            <span className="text-sm font-mono font-medium text-slate-200">{state.match?.id || 'None'}</span>
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2" />
          
          <div className="flex flex-col min-w-[80px]">
            <span className="text-xs text-slate-400">Uptime</span>
            <span className="text-sm font-mono font-bold text-white tracking-wider">{formatTime(state.uptimeSeconds)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ObsConnectionPanel />
        <Link 
          to={`/production/${tournamentId}/dashboard`}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </header>
  );
}
