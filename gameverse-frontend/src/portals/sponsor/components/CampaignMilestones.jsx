import React from 'react';
import { Check, Circle } from 'lucide-react';

export function CampaignMilestones({ milestones }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-6">Campaign Timeline</h2>
      
      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
            
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {m.status === 'COMPLETED' ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : m.status === 'CURRENT' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              ) : (
                <Circle className="w-2 h-2 text-slate-600" />
              )}
            </div>
            
            <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border ${
              m.status === 'CURRENT' ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 
              'bg-slate-800/40 border-slate-700/50'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold ${
                  m.status === 'COMPLETED' ? 'text-green-400' :
                  m.status === 'CURRENT' ? 'text-blue-400' : 'text-slate-400'
                }`}>{m.title}</span>
              </div>
              <p className="text-xs text-slate-500">{m.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
