import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Compass, Users, Gamepad2, Medal, TrendingUp, Bell, User, Settings, PlusCircle } from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useAuthStore } from '../../../store/authStore';

export function PlayerSidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuthStore();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard/player', icon: LayoutDashboard },
    { name: 'Tournaments', path: '/explore', icon: Compass },
    { name: 'My Teams', path: '/teams/my-team', icon: Users },
    { name: 'Create Team', path: '/teams/create', icon: PlusCircle },
    { name: 'My Matches', path: '/tournaments/t1/my-matches', icon: Gamepad2 }, // Placeholder route
    { name: 'Results', path: '/t/riftora-championship/results', icon: Medal }, // Placeholder route
    { name: 'Performance', path: '/dashboard/performance', icon: TrendingUp },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile/me', icon: User },
    { name: 'Settings', path: '/profile/me#settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full py-6">
          <div className="px-6 mb-8 flex items-center justify-between lg:justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="Riftora Logo" className="h-8 w-auto object-contain" />
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              // Custom active logic to handle exact matches, paths with hashes, and subpaths
              const isActive = (item.path === '/dashboard/player' && location.pathname === '/dashboard/player' && !location.hash) ||
                               (item.path.includes('#') ? location.pathname + location.hash === item.path : location.pathname.startsWith(item.path) && item.path !== '/dashboard/player');

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600/10 text-blue-500' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
             <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                   {user?.username?.substring(0, 2).toUpperCase() || 'P'}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-white truncate">{user?.username || 'Player'}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Player</p>
                 </div>
               </div>
               <button onClick={logout} className="w-full py-2 bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-md text-xs font-bold transition-colors">
                 Sign Out
               </button>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}
