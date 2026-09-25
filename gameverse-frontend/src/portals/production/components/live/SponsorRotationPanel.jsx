import React from 'react';
import { Ticket, ArrowRightCircle } from 'lucide-react';
import { useObsStore } from '../../../../features/broadcast/store/useObsStore';

export function SponsorRotationPanel({ state, dispatch }) {
  const { isConnected, currentScene, setTextSource } = useObsStore();
  
  const currentSponsor = state.sponsors[state.currentSponsorIndex];
  const nextIndex = (state.currentSponsorIndex + 1) % state.sponsors.length;
  const nextSponsor = state.sponsors[nextIndex];

  const handleNextSponsor = () => {
    dispatch({ type: 'NEXT_SPONSOR' });
    if (isConnected && currentScene) {
      // Update text source in OBS to reflect new sponsor
      setTextSource('sponsor_text_source', state.sponsors[nextIndex].name);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Ticket className="w-3.5 h-3.5" />
          Sponsor Rotation
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
          {state.currentSponsorIndex + 1} / {state.sponsors.length}
        </span>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">CURRENT SPONSOR</span>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white">{currentSponsor.name}</span>
            <div className={`w-2 h-2 rounded-full ${state.overlays.sponsor ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">NEXT IN QUEUE</span>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center">
            <span className="text-sm font-medium text-slate-400">{nextSponsor.name}</span>
          </div>
        </div>

        <button 
          onClick={handleNextSponsor}
          className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 transition-colors mt-2"
        >
          <ArrowRightCircle className="w-4 h-4" />
          NEXT SPONSOR
        </button>
      </div>
    </div>
  );
}
