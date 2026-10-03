import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Tv, LayoutDashboard, Layers, ArrowLeft } from 'lucide-react';
import logo from '../../../assets/logo.png';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../../../store/authStore';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function ProductionSidebar() {
  const { tournamentId } = useParams();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: `/production/${tournamentId}/dashboard`, icon: LayoutDashboard },
    { name: 'Live Control', path: `/production/${tournamentId}/live`, icon: Tv },
    { name: 'Overlays', path: `/production/${tournamentId}/overlays`, icon: Layers },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex flex-col">
          <img src={logo} alt="Riftora" className="h-6 w-auto object-contain brightness-150" />
          <span className="text-[10px] font-bold text-blue-500 tracking-wider uppercase mt-1">Production</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-white/10 shrink-0 flex flex-col gap-3">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Production
        </NavLink>
        
        <div className="bg-slate-900/50 rounded-lg p-3 border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {user?.username?.substring(0, 2).toUpperCase() || 'PR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.username || 'Producer'}</p>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Broadcaster</p>
            </div>
          </div>
          <button onClick={logout} className="w-full py-2 bg-slate-950/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-md text-xs font-bold transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
