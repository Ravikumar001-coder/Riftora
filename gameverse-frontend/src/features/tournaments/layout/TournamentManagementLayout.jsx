import React from 'react';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Trophy, 
  UserPlus, Settings, ChevronLeft, ArrowLeft
} from 'lucide-react';
import { mockTournamentData } from '../data/mockTournamentOverview';

const NAVIGATION = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/manage/:tournamentId/overview' },
  { id: 'registrations', label: 'Registrations', icon: Users, path: '/manage/:tournamentId/registrations' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/manage/:tournamentId/schedule' },
  { id: 'prizes', label: 'Prizes', icon: Trophy, path: '/manage/:tournamentId/prizes' },
  { id: 'staff', label: 'Staff', icon: UserPlus, path: '/manage/:tournamentId/staff' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/manage/:tournamentId/settings' }
];

export function TournamentManagementLayout() {
  const { tournamentId } = useParams();
  const location = useLocation();
  
  // Replace param in paths
  const navItems = NAVIGATION.map(item => ({
    ...item,
    resolvedPath: item.path.replace(':tournamentId', tournamentId)
  }));

  // In a real app we'd fetch the tournament data here to ensure access.
  // For now, we use the mock data.
  const t = mockTournamentData;

  return (
    <div className="min-h-screen bg-[#071426] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/organizer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Organizations
          </Link>
          <div className="w-px h-6 bg-slate-800 hidden sm:block"></div>
          <h2 className="hidden sm:block text-white font-bold tracking-tight">{t.name}</h2>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {t.status}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to={`/t/${t.slug}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Public Page
          </Link>
          <Link to={`/command-center/${tournamentId}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            Command Center
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-800 min-h-[calc(100vh-64px)] p-4 sticky top-16">
          <div className="mb-6 px-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tournament Management</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.id);
              return (
                <Link
                  key={item.id}
                  to={item.resolvedPath}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Dropdown/Scroll area (Optional improvement, skipping for now, keeping content area primary) */}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
