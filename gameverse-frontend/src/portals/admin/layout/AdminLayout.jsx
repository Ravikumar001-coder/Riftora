import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Building, Trophy, Users, AlertCircle, Gamepad2, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export function AdminLayout() {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: `/admin/dashboard`, icon: LayoutDashboard, exact: true },
    { name: 'Organizations', path: `/admin/organizations`, icon: Building },
    { name: 'Tournaments', path: `/admin/tournaments`, icon: Trophy },
    { name: 'Users', path: `/admin/users`, icon: Users },
    { name: 'Disputes', path: `/admin/disputes`, icon: AlertCircle, badge: 2, badgeCritical: true },
    { name: 'Games', path: `/admin/games`, icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </Link>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Platform Admin
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md mt-2 w-fit">
              <ShieldAlert className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">Super Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex justify-between items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                 <item.icon className="w-5 h-5" />
                 {item.name}
              </div>
              {item.badge && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black ${item.badgeCritical ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                 {user?.username?.substring(0, 2).toUpperCase() || 'SA'}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate">{user?.username || 'Super Admin'}</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Level: 0</p>
               </div>
             </div>
             <button onClick={logout} className="w-full py-2 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-md text-xs font-bold transition-colors">
               Sign Out
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-[#071426]">
        <div className="flex-1 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
