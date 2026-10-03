import React from 'react';
import { DollarSign, CheckSquare } from 'lucide-react';

export function SponsorStatus({ sponsors }) {
  if (!sponsors) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-500" />
          Sponsor Deliverables
        </h3>
        <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded">Current Session</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="p-3 bg-slate-950/50 border border-white/5 rounded-xl hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                {sponsor.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                sponsor.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                sponsor.status === 'READY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {sponsor.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 pl-5.5">
              Placement: <span className="text-slate-300">{sponsor.placement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
