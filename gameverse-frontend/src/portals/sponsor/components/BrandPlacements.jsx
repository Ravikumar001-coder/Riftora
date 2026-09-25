import React, { useState } from 'react';
import { PlacementDetailsModal } from './PlacementDetailsModal';
import { MonitorPlay, Layout, Trophy, Ticket } from 'lucide-react';

export function BrandPlacements({ placements }) {
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  const getIcon = (name) => {
    if (name.includes('Stream') || name.includes('Match')) return <MonitorPlay className="w-5 h-5" />;
    if (name.includes('Tournament')) return <Layout className="w-5 h-5" />;
    if (name.includes('Result')) return <Trophy className="w-5 h-5" />;
    return <Ticket className="w-5 h-5" />;
  };

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-6">Brand Placements</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {placements.map((p) => (
            <button 
              key={p.id}
              onClick={() => setSelectedPlacement(p)}
              className="flex flex-col items-start bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 p-4 rounded-xl transition-all text-left group"
            >
              <div className="flex justify-between items-start w-full mb-3">
                <div className="p-2 bg-slate-700/50 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  {getIcon(p.name)}
                </div>
                {p.status === 'ACTIVE' && (
                  <span className="flex items-center text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                    ✓ Active
                  </span>
                )}
                {p.status === 'PENDING' && (
                  <span className="flex items-center text-xs font-semibold text-slate-400 bg-slate-700/50 px-2 py-1 rounded-md">
                    Pending
                  </span>
                )}
              </div>
              <h3 className="text-white font-medium mb-1">{p.name}</h3>
              <p className="text-slate-400 text-xs line-clamp-1">{p.type}</p>
              <div className="mt-3 text-xs text-slate-500 font-medium bg-slate-900/50 px-2.5 py-1 rounded w-full">
                {p.delivery}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPlacement && (
        <PlacementDetailsModal 
          placement={selectedPlacement} 
          onClose={() => setSelectedPlacement(null)} 
        />
      )}
    </>
  );
}
