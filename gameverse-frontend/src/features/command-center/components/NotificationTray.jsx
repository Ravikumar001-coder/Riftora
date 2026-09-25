import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, Pin, Trash2 } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

const typeConfig = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', dot: 'bg-emerald-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', dot: 'bg-amber-400' },
  error: { icon: AlertCircle, color: 'text-red-400', dot: 'bg-red-400' },
  info: { icon: Info, color: 'text-blue-400', dot: 'bg-blue-400' },
};

export function NotificationTray() {
  const { allNotifications, isTrayOpen, setTrayOpen, clearAllNotifications } = useCommandCenterStore();
  
  if (!isTrayOpen) return null;

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[130]" onClick={() => setTrayOpen(false)} />

      {/* Tray Panel */}
      <div className="fixed top-14 right-4 z-[140] w-96 bg-[#0d1829] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-white text-sm">Notification Tray</h3>
            {allNotifications.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                {allNotifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {allNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear all
              </button>
            )}
            <button onClick={() => setTrayOpen(false)} className="p-1 text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[70vh] overflow-y-auto">
          {allNotifications.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No notifications this session</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {allNotifications.map(n => {
                const config = typeConfig[n.type] || typeConfig.info;
                const Icon = config.icon;
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${n.dismissed ? 'opacity-40' : ''}`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium leading-tight">{n.message}</p>
                      {n.entity && <p className="text-xs text-slate-500 font-mono mt-0.5">{n.entity}</p>}
                      <p className="text-[10px] text-slate-600 mt-1">{formatTime(n.timestamp)}</p>
                    </div>
                    {n.pinned && <Pin className="w-3 h-3 text-blue-400 mt-1 shrink-0" title="Pinned" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
