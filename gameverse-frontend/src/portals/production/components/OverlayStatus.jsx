import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Copy, CheckCircle2, Clock, Signal, AlertTriangle, Settings } from 'lucide-react';
import { useOverlays } from '../../../features/command-center/api/useOverlayQueries';

export function OverlayStatus({ tournamentId }) {
  const { data: overlays, isLoading, isError } = useOverlays(tournamentId);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    // In a real app we'd add a small toast here
  };

  const getOverlayName = (type) => {
    switch (type) {
      case 'leaderboard_full': return 'Full Leaderboard';
      case 'top10': return 'Top 10 Leaderboard';
      case 'match_info_bar': return 'Match Info Bar';
      case 'sponsor_banner': return 'Sponsor Banner';
      case 'match_result': return 'Match Result Splash';
      case 'tournament_winner': return 'Tournament Winner';
      default: return type;
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            Overlay Management
          </h3>
          <span className="text-xs text-slate-400 mt-1">Manage OBS overlay URLs</span>
        </div>
        <Link 
          to={`/production/${tournamentId}/overlays`}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/50"
          title="Overlay Configuration"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading && (
          <div className="text-sm text-slate-400 flex items-center justify-center h-full">Loading overlays...</div>
        )}
        
        {isError && (
          <div className="text-sm text-red-400 flex items-center justify-center h-full">Failed to load overlays</div>
        )}

        {!isLoading && !isError && (!overlays || overlays.length === 0) && (
          <div className="text-sm text-slate-400 flex items-center justify-center h-full text-center flex-col gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            No overlays generated yet. Go to Overlay Configuration to generate them.
          </div>
        )}

        {!isLoading && !isError && overlays && overlays.length > 0 && (
          <div className="space-y-3">
            {overlays.map((overlay) => (
              <div key={overlay.overlayId} className="p-3 bg-slate-950/50 border border-white/5 rounded-xl hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{getOverlayName(overlay.overlayType)}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium" title="Last Seen">
                      <Clock className="w-3 h-3" />
                      Never
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium" title="Connection Status">
                      <Signal className="w-3 h-3" />
                      Disconnected
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-1.5 rounded border border-white/5 truncate">
                    {overlay.overlayUrl}
                  </code>
                  <button 
                    onClick={() => handleCopyUrl(overlay.overlayUrl)}
                    className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 text-blue-500 hover:text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0" 
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
