import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function SponsorUpdates({ updates }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-5">Recent Updates</h2>
      
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex gap-3">
            <div className="mt-0.5">
              {update.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
              {update.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
              {update.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            </div>
            <div>
              <p className="text-sm text-slate-300 mb-0.5 leading-snug">{update.message}</p>
              <p className="text-xs text-slate-500">{update.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
