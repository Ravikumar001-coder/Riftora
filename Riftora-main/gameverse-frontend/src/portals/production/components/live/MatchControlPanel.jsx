import React, { useState } from 'react';
import { Play, Pause, Square, Map, Users, CheckCircle2 } from 'lucide-react';
import { formatTime } from './utils';
import { VodLinkModal } from './VodLinkModal';

export function MatchControlPanel({ state, dispatch }) {
  const match = state.match;
  const [isVodModalOpen, setIsVodModalOpen] = useState(false);
  
  const handleMatchAction = (status) => {
    dispatch({ type: 'SET_MATCH_STATUS', payload: status });
  };

  const statusColors = {
    SCHEDULED: 'text-slate-400 bg-slate-800',
    READY: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    IN_PROGRESS: 'text-red-500 bg-red-500/10 border-red-500/30',
    PAUSED: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    COMPLETED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col xl:flex-row">
      <div className="p-4 border-b xl:border-b-0 xl:border-r border-slate-800/50 bg-slate-900/80 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match Control</h2>
          <div className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wide ${statusColors[match.status]}`}>
            {match.status.replace('_', ' ')}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded bg-slate-800 border border-slate-700 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs text-slate-500">MATCH</span>
            <span className="text-xl font-black text-white">{match.id.replace('M', '')}</span>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Map</span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200">
                <Map className="w-3.5 h-3.5 text-slate-400" />
                {match.map}
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Lobby</span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {match.lobby}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Teams</span>
              <span className="text-sm font-medium text-slate-200">{match.teamCount} Teams (BR)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/30 flex flex-col justify-center gap-3 xl:w-64 shrink-0">
        <div className="flex flex-col items-center justify-center mb-2">
          <span className="text-xs text-slate-500 mb-1">MATCH TIME</span>
          <span className={`text-3xl font-mono font-bold tracking-widest ${match.status === 'IN_PROGRESS' ? 'text-white' : match.status === 'PAUSED' ? 'text-amber-500' : 'text-slate-500'}`}>
            {formatTime(match.timeSeconds)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {match.status === 'SCHEDULED' && (
            <button 
              onClick={() => handleMatchAction('READY')}
              className="col-span-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold rounded border border-blue-500/30 transition-colors"
            >
              MARK READY
            </button>
          )}

          {(match.status === 'READY' || match.status === 'PAUSED') && (
            <button 
              onClick={() => handleMatchAction('IN_PROGRESS')}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/20 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              {match.status === 'PAUSED' ? 'RESUME MATCH' : 'START MATCH'}
            </button>
          )}

          {match.status === 'IN_PROGRESS' && (
            <>
              <button 
                onClick={() => handleMatchAction('PAUSED')}
                className="flex items-center justify-center gap-1.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 text-xs font-bold rounded border border-amber-500/30 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                PAUSE
              </button>
              <button 
                onClick={() => handleMatchAction('COMPLETED')}
                className="flex items-center justify-center gap-1.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMPLETE
              </button>
            </>
          )}

          {match.status === 'COMPLETED' && (
            <>
              <div className="col-span-2 text-center py-2 text-xs font-medium text-slate-500">
                Match Completed
              </div>
              <button
                onClick={() => setIsVodModalOpen(true)}
                className="col-span-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-bold rounded border border-purple-500/30 transition-colors"
              >
                LINK VOD
              </button>
            </>
          )}
        </div>
      </div>

      <VodLinkModal 
        match={match} 
        isOpen={isVodModalOpen} 
        onClose={() => setIsVodModalOpen(false)} 
      />
    </div>
  );
}
