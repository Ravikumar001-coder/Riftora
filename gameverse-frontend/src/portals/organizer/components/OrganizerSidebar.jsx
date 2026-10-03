import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard,
  ClipboardList,
  CalendarDays,
  Radio,
  UserCog,
  Bell,
  User
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useAuthStore } from '../../../store/authStore';

export function OrganizerSidebar({ isOpen, setIsOpen, orgSlug, role }) {
  const { user, logout } = useAuthStore();
  // Roles: 'Org Owner', 'Org Admin', 'Tournament Director'
  const isOwner = role === 'Org Owner';
  const isAdminOrOwner = isOwner || role === 'Org Admin';

  const organizationNav = [
    { name: 'Overview', path: `/organizations/${orgSlug}/manage/overview`, icon: Building2 },
    { name: 'Tournaments', path: `/organizations/${orgSlug}/manage/tournaments`, icon: Trophy },
    { name: 'Members', path: `/organizations/${orgSlug}/manage/members`, icon: Users },
    { name: 'Analytics', path: `/organizations/${orgSlug}/manage/analytics`, icon: BarChart3 },
    { name: 'Scoring Templates', path: `/organizations/${orgSlug}/manage/scoring`, icon: Trophy },
    { name: 'Settings', path: `/organizations/${orgSlug}/manage/settings`, icon: Settings },
  ];

  if (isOwner) {
    organizationNav.push({ name: 'Billing', path: `/organizations/${orgSlug}/manage/billing`, icon: CreditCard });
  }

  const operationsNav = [
    { name: 'Registrations', path: `/manage/t1/registrations`, icon: ClipboardList }, // Hardcoded t1 for mock
    { name: 'Schedule', path: `/manage/t1/schedule`, icon: CalendarDays },
    { name: 'Command Center', path: `/command-center/t1`, icon: Radio },
    { name: 'Staff', path: `/manage/t1/staff`, icon: UserCog },
  ];

  const platformNav = [
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile/me', icon: User },
  ];

  const renderNavGroup = (title, items) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mx-2
              ${isActive 
                ? 'bg-amber-500/10 text-amber-500' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
            `}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );

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

          <div className="flex-1 overflow-y-auto">
            <div className="mb-6">
              <nav className="space-y-1">
                <NavLink
                  to="/dashboard/organizer"
                  end
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mx-2
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
                  `}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </NavLink>
              </nav>
            </div>

            {isAdminOrOwner && renderNavGroup('Organization', organizationNav)}
            {renderNavGroup('Tournament Operations', operationsNav)}
            {renderNavGroup('Platform', platformNav)}
          </div>

          <div className="p-4 border-t border-slate-800">
             <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                   {user?.username?.substring(0, 2).toUpperCase() || 'O'}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-white truncate">{user?.username || 'Organizer'}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{role || 'Organizer'}</p>
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
