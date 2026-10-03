import React from 'react';
import { Target, Users, Map, Shield } from 'lucide-react';
import { Badge } from '../../../components/ui/badge'; // Assuming this exists or standard html badge

export function CurrentMatchCard({ match }) {
  if (!match) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">CURRENT BROADCAST</h3>
          <p className="text-slate-400 text-sm">Match {match.number} • {match.status.replace('_', ' ')}</p>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
          IN PROGRESS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Teams</span>
          </div>
          <div className="text-xl font-bold text-white">{match.teamCount}</div>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Lobby</span>
          </div>
          <div className="text-xl font-bold text-white">{match.lobby}</div>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 col-span-2">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Map className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Map</span>
          </div>
          <div className="text-xl font-bold text-white">{match.map}</div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Production State</h4>
        <div className="space-y-3">
          {match.productionStates.map((state, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">{state.name}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                state.status === 'LIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                state.status === 'READY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                state.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {state.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
