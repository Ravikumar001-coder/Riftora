import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function ProductionAlerts({ alerts }) {
  if (!alerts) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          Production Alerts
        </h3>
        <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded">
          {alerts.filter(a => a.priority === 'warning').length} Warnings
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-3 border rounded-xl flex items-start gap-3 ${
            alert.priority === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
            alert.priority === 'error' ? 'bg-red-500/10 border-red-500/20' :
            alert.priority === 'success' ? 'bg-green-500/10 border-green-500/20' :
            'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="mt-0.5 shrink-0">
              {alert.priority === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {alert.priority === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {alert.priority === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {alert.priority === 'info' && <Info className="w-4 h-4 text-blue-500" />}
            </div>
            <p className={`text-sm ${
              alert.priority === 'warning' ? 'text-amber-200' :
              alert.priority === 'error' ? 'text-red-200' :
              alert.priority === 'success' ? 'text-green-200' :
              'text-blue-200'
            }`}>
              {alert.message}
            </p>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
            <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
