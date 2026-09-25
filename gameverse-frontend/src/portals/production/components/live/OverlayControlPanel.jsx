import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ToggleLeft, ToggleRight, Layout } from 'lucide-react';
import { useObsStore } from '../../../../features/broadcast/store/useObsStore';

export function OverlayControlPanel({ state, dispatch, tournamentId }) {
  const { isConnected, currentScene, setSourceVisibility } = useObsStore();
  
  const overlays = [
    { id: 'leaderboard', name: 'Leaderboard', hasConfig: true, route: `/production/${tournamentId}/overlays` },
    { id: 'top10', name: 'Top 10', hasConfig: true, route: `/production/${tournamentId}/overlays` },
    { id: 'matchbar', name: 'Match Bar', hasConfig: false },
    { id: 'sponsor', name: 'Sponsor', hasConfig: false },
    { id: 'result', name: 'Result', hasConfig: true, route: `/production/${tournamentId}/overlays` },
  ];

  const handleToggle = (overlayId, isActive) => {
    dispatch({ type: 'TOGGLE_OVERLAY', payload: overlayId });
    if (isConnected && currentScene) {
      // OBS Source names are assumed to match overlay names/ids, e.g. "leaderboard_overlay"
      setSourceVisibility(currentScene, `${overlayId}_overlay`, !isActive);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layout className="w-3.5 h-3.5" />
          Overlay Control {isConnected && <span className="text-emerald-500">(OBS)</span>}
        </h2>
      </div>
      
      <div className="p-2 flex flex-col gap-1">
        {overlays.map((overlay) => {
          const isActive = state.overlays[overlay.id];
          
          return (
            <div key={overlay.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggle(overlay.id, isActive)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {isActive ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-600" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {overlay.name}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>
                    {isActive ? '● ACTIVE' : '○ INACTIVE'}
                  </span>
                </div>
              </div>
              
              {overlay.hasConfig && (
                <Link 
                  to={overlay.route}
                  className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title={`Configure ${overlay.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
