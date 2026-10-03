import React from 'react';
import { Activity, Wifi, HardDrive, Clock, Monitor } from 'lucide-react';

export function StreamHealth({ health }) {
  if (!health) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">STREAM HEALTH</h3>
        <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-white/5">
          Demo / Mock Data
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="font-bold text-green-400">Healthy</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wifi className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Connection</span>
          </div>
          <div className="text-sm font-bold text-white">{health.connection}</div>
        </div>
        
        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Bitrate</span>
          </div>
          <div className="text-sm font-bold text-white">{health.bitrate}</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Monitor className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">FPS</span>
          </div>
          <div className="text-sm font-bold text-white">{health.fps}</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Dropped</span>
          </div>
          <div className="text-sm font-bold text-white">{health.droppedFrames}</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 col-span-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Latency</span>
          </div>
          <div className="text-sm font-bold text-white">{health.latency}</div>
        </div>
      </div>
    </div>
  );
}
