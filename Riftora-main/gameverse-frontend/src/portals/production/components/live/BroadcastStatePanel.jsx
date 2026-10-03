import React, { useState } from 'react';
import { Play, Pause, Square, Radio, AlertTriangle } from 'lucide-react';

export function BroadcastStatePanel({ state, dispatch }) {
  const [confirmingAction, setConfirmingAction] = useState(null);
  
  const handleAction = (action, requireConfirm = false) => {
    if (requireConfirm) {
      setConfirmingAction(action);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action) => {
    dispatch({ type: 'SET_BROADCAST_STATUS', payload: action });
    setConfirmingAction(null);
  };

  const statusColors = {
    OFFLINE: 'bg-slate-800 text-slate-400',
    PREPARING: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    STANDBY: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    LIVE: 'bg-red-500/20 text-red-500 border-red-500/50',
    PAUSED: 'bg-slate-700/50 text-slate-300 border-slate-600',
    BREAK: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    ENDED: 'bg-slate-800 text-slate-500 border-slate-700'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Broadcast State</h2>
        <div className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wide ${statusColors[state.broadcastStatus] || statusColors.OFFLINE}`}>
          {state.broadcastStatus}
        </div>
      </div>
      
      <div className="p-4">
        {confirmingAction ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-400">Confirm Action</h3>
                <p className="text-xs text-red-300/80 mt-1">Are you sure you want to change the broadcast state to {confirmingAction}? This may affect live overlays and tracking.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setConfirmingAction(null)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeAction(confirmingAction)}
                className="px-3 py-1.5 rounded-md text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20"
              >
                Confirm {confirmingAction}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {(state.broadcastStatus === 'STANDBY' || state.broadcastStatus === 'PREPARING') && (
              <button 
                onClick={() => handleAction('LIVE')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20"
              >
                <Radio className="w-4 h-4" />
                GO LIVE
              </button>
            )}
            
            {state.broadcastStatus === 'LIVE' && (
              <>
                <button 
                  onClick={() => handleAction('BREAK')}
                  className="flex items-center justify-center gap-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg font-semibold transition-colors border border-purple-500/20"
                >
                  <Pause className="w-4 h-4" />
                  START BREAK
                </button>
                <button 
                  onClick={() => handleAction('ENDED', true)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition-colors border border-slate-700"
                >
                  <Square className="w-4 h-4" />
                  END BROADCAST
                </button>
              </>
            )}

            {state.broadcastStatus === 'BREAK' && (
              <button 
                onClick={() => handleAction('LIVE')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-bold transition-colors border border-red-500/20"
              >
                <Play className="w-4 h-4" />
                RESUME BROADCAST
              </button>
            )}

            {state.broadcastStatus === 'OFFLINE' && (
              <button 
                onClick={() => handleAction('PREPARING')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20"
              >
                <Play className="w-4 h-4" />
                INITIATE PRODUCTION
              </button>
            )}
            
            {state.broadcastStatus === 'ENDED' && (
              <div className="col-span-2 text-center py-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-slate-400 text-sm">
                Production Session Ended
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
