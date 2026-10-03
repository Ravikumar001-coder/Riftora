import React from 'react';

export function ProductionReadiness({ readiness }) {
  if (!readiness) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Production Readiness</h3>
        <span className="text-sm font-medium text-slate-400">
          {readiness.readyCount} / {readiness.totalCount} Ready
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${(readiness.readyCount / readiness.totalCount) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-1">
        {readiness.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
            <span className="text-sm font-medium text-slate-300">{item.name}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
              item.status === 'READY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              item.status === 'STANDBY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
