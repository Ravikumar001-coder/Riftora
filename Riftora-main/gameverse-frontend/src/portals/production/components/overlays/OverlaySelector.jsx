import React from 'react';
import { overlayTypes, getStatus } from './overlayDefaults';
import { CheckCircle2, AlertTriangle, Circle, MonitorPlay } from 'lucide-react';

export function OverlaySelector({ selectedOverlay, setSelectedOverlay, configs }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'READY':
      case 'ACTIVE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'NEEDS ATTENTION':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Circle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/80">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <MonitorPlay className="w-3.5 h-3.5" />
          Overlay Catalog
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar flex flex-row lg:flex-col gap-1">
        {overlayTypes.map((overlay) => {
          const isSelected = selectedOverlay === overlay.id;
          const config = configs[overlay.id];
          const status = getStatus(overlay.id, config);
          
          return (
            <button
              key={overlay.id}
              onClick={() => setSelectedOverlay(overlay.id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors min-w-[200px] lg:min-w-0 ${
                isSelected 
                  ? 'bg-blue-600/10 border border-blue-500/30' 
                  : 'hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="shrink-0">
                {getStatusIcon(status)}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {overlay.name}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  status === 'READY' || status === 'ACTIVE' ? 'text-emerald-500' :
                  status === 'NEEDS ATTENTION' ? 'text-amber-500' :
                  'text-slate-500'
                }`}>
                  {status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
