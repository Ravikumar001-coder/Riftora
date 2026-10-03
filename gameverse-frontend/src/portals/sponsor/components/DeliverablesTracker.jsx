import React from 'react';
import { CheckCircle2, Circle, Clock, Loader } from 'lucide-react';

export function DeliverablesTracker({ deliverables }) {
  const completedCount = deliverables.filter(d => d.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / deliverables.length) * 100);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'IN_PROGRESS': return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'SCHEDULED': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Circle className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Campaign Deliverables</h2>
        <span className="text-sm text-slate-300 font-medium">{completedCount} / {deliverables.length} Completed</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="space-y-4">
        {deliverables.map((d) => (
          <div key={d.id} className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <div className="mt-0.5">
              {getStatusIcon(d.status)}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">{d.name}</h3>
              <div className="flex gap-4 text-xs">
                <span className={`font-semibold capitalize ${
                  d.status === 'COMPLETED' ? 'text-green-400' :
                  d.status === 'IN_PROGRESS' ? 'text-blue-400' :
                  d.status === 'SCHEDULED' ? 'text-yellow-400' : 'text-slate-500'
                }`}>
                  {d.status.replace('_', ' ').toLowerCase()}
                </span>
                <span className="text-slate-500">Date: {d.date}</span>
                <span className="text-slate-500 hidden sm:inline">Placement: {d.placement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
