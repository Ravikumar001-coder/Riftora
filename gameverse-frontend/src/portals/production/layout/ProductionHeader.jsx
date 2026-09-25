import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Bell } from 'lucide-react';

export function ProductionHeader({ tournament, broadcastStatus }) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left side: Tournament Context */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">{tournament?.name || 'Tournament'}</h1>
          <p className="text-slate-400 text-xs">
            {tournament?.game} • {tournament?.phase}
          </p>
        </div>
      </div>

      {/* Right side: Status and Profile */}
      <div className="flex items-center gap-6">
        
        {/* Broadcast Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full border border-white/5 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${broadcastStatus === 'LIVE' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${broadcastStatus === 'LIVE' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className={`text-xs font-bold tracking-widest ${broadcastStatus === 'LIVE' ? 'text-red-400' : 'text-amber-400'}`}>
            {broadcastStatus || 'STANDBY'}
          </span>
        </div>

        {/* Notifications (Mock) */}
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.username || 'Producer'}</p>
            <p className="text-xs text-blue-400 font-medium">{user?.roles?.[0] || 'Production'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
             <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Producer'}&background=1e293b&color=3b82f6`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
