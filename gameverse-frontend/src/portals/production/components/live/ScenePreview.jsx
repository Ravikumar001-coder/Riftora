import React from 'react';
import { MonitorPlay, Radio } from 'lucide-react';

export function ScenePreview({ state }) {
  const isLive = state.broadcastStatus === 'LIVE';

  return (
    <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/40 flex flex-col relative min-h-[300px] lg:min-h-[400px]">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isLive && (
          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE
          </div>
        )}
        <div className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700 shadow-lg">
          {state.currentScene}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
        {/* Placeholder Visuals depending on scene */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen" />
        </div>

        <MonitorPlay className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">{state.currentScene}</h3>
        <p className="text-sm text-slate-600 mt-2">Simulation / Preview Viewport</p>

        {state.currentScene === 'LIVE GAMEPLAY' && (
          <div className="absolute bottom-8 left-8 flex flex-col gap-1">
            <span className="text-2xl font-black text-white/50 tracking-wider">MATCH {state.match.id.replace('M', '')}</span>
            <span className="text-lg font-bold text-white/30 uppercase">{state.match.map} • {state.match.teamCount} TEAMS</span>
          </div>
        )}
      </div>

      <div className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4">
        <span className="text-xs text-slate-500">PROGRAM PREVIEW</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>
    </div>
  );
}
