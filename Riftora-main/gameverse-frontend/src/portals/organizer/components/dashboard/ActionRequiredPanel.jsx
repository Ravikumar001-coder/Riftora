import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function ActionRequiredPanel({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-center text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">All Caught Up</h3>
        <p className="text-slate-500 text-sm">No operational issues require your immediate attention.</p>
      </div>
    );
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
      case 'high':
        return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'medium':
        return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' };
      case 'info':
      default:
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">ACTION REQUIRED</span>
        <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
          {items.length} ITEMS
        </span>
      </div>
      
      <div className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
        {items.map((item) => {
          const config = getPriorityConfig(item.priority);
          const Icon = config.icon;
          
          return (
            <div key={item.id} className="flex gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h4 className={`text-sm font-bold mb-1 ${item.priority === 'critical' ? 'text-red-400' : 'text-white'}`}>
                    {item.message}
                  </h4>
                  <p className="text-xs text-slate-400">{item.context}</p>
                </div>
                
                <Link 
                  to={item.link} 
                  className="shrink-0 inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700 self-start sm:self-auto"
                >
                  {item.actionLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
