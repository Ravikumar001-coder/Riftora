import React from 'react';
import { X, Pin, PinOff, CheckCircle2, AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

const typeConfig = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-900/60 border-emerald-700/50', iconColor: 'text-emerald-400', title: 'text-emerald-200' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-900/60 border-amber-700/50', iconColor: 'text-amber-400', title: 'text-amber-200' },
  error: { icon: AlertCircle, bg: 'bg-red-900/60 border-red-700/50', iconColor: 'text-red-400', title: 'text-red-200' },
  info: { icon: Info, bg: 'bg-slate-800/80 border-slate-700/50', iconColor: 'text-blue-400', title: 'text-slate-100' },
};

function Toast({ notification }) {
  const { dismissToast, pinToast, unpinToast } = useCommandCenterStore();
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md w-80 ${config.bg} animate-in slide-in-from-right-4 fade-in duration-300`}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${config.title}`}>{notification.message}</p>
        {notification.entity && (
          <p className="text-xs text-slate-400 mt-1 font-mono">{notification.entity}</p>
        )}
        {notification.actionLabel && notification.onAction && (
          <button
            onClick={notification.onAction}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {notification.actionLabel} <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={() => notification.pinned ? unpinToast(notification.id) : pinToast(notification.id)}
          className={`p-1 rounded transition-colors ${notification.pinned ? 'text-blue-400 hover:text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}
          title={notification.pinned ? 'Unpin' : 'Pin to keep'}
        >
          {notification.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => dismissToast(notification.id)}
          className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useCommandCenterStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[150] flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast key={toast.id} notification={toast} />
      ))}
    </div>
  );
}
