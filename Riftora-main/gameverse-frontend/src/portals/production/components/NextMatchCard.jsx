import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const diff = Math.floor((new Date(dateString) - new Date()) / 1000);
  if (diff <= 0) return 'starting now';
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `in ${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  return `in ${hours} hr${hours > 1 ? 's' : ''}`;
}

export function NextMatchCard({ match }) {
  const [prepareState, setPrepareState] = useState(match?.status || 'SCHEDULED');

  if (!match) return null;

  const handlePrepare = () => {
    setPrepareState('PREPARING');
    setTimeout(() => {
      setPrepareState('READY');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none -mr-16 -mt-16" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">NEXT UP</h3>
          <p className="text-slate-400 text-sm">Match {match.number} • {match.map}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Starts in</p>
          {match.startTime ? (
            <p className="text-lg font-bold text-amber-400 tabular-nums">
              {getRelativeTime(match.startTime)}
            </p>
          ) : (
            <p className="text-lg font-bold text-slate-400">TBD</p>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Readiness Checklist</h4>
        <div className="space-y-3">
          {match.readiness.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.ready ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600" />
              )}
              <span className={`text-sm font-medium ${item.ready ? 'text-slate-200' : 'text-slate-500'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <button 
          onClick={handlePrepare}
          disabled={prepareState === 'PREPARING' || prepareState === 'READY'}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            prepareState === 'READY' ? 'bg-green-600 hover:bg-green-500 text-white' :
            prepareState === 'PREPARING' ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse' :
            'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {prepareState === 'READY' ? 'Ready to Broadcast' : 
           prepareState === 'PREPARING' ? 'Preparing Systems...' : 
           'Prepare Broadcast'}
        </button>
      </div>
    </div>
  );
}
