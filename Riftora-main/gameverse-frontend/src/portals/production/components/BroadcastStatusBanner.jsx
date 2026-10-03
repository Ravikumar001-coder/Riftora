import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}

export function BroadcastStatusBanner({ broadcast, match }) {
  const isLive = broadcast.status === 'LIVE';

  return (
    <div className={`w-full rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${isLive ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900 border-white/10'}`}>
      
      {/* Background Pulse if LIVE */}
      {isLive && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[80px] rounded-full pointer-events-none -mr-32 -mt-32 animate-pulse" />
      )}

      <div className="flex items-center gap-6 relative z-10">
        {/* Status Indicator Big */}
        <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border ${isLive ? 'bg-red-950/50 border-red-500/30 text-red-500' : 'bg-slate-800 border-white/10 text-slate-400'}`}>
          <div className="relative flex h-4 w-4 mb-2">
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-4 w-4 ${isLive ? 'bg-red-500' : 'bg-slate-500'}`}></span>
          </div>
          <span className="font-black tracking-widest text-sm">{broadcast.status}</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {isLive ? 'Broadcast is currently active' : 'Broadcast is currently offline'}
          </h2>
          <p className="text-slate-400">
            {match ? `Match ${match.number} • ${match.map} • ${match.lobby}` : 'No active match'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        {isLive && broadcast.startedAt && (
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-5 h-5 text-red-400" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase">Uptime</span>
              <span className="font-medium">{getRelativeTime(broadcast.startedAt)}</span>
            </div>
          </div>
        )}

        <button className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${isLive ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'}`}>
          <PlayCircle className="w-5 h-5" />
          {isLive ? 'Stop Broadcast' : 'Start Broadcast'}
        </button>
      </div>
    </div>
  );
}
