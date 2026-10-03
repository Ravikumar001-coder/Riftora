import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  CalendarDays, 
  Radio, 
  PlusCircle, 
  UserPlus,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { organizerDashboardData } from '../../../portals/organizer/data/mockOrganizerData';

export function OrganizationOverviewPage() {
  const { orgSlug } = useParams();
  
  // Use mock data, pretend we loaded it by orgSlug
  const { organization, stats, activeTournaments, upcomingSchedule, actionRequired, activity } = organizerDashboardData;

  // Determine actual rendered org name for fallback
  const orgName = organization?.slug === orgSlug ? organization.name : (orgSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  const role = organization?.role || 'Org Admin';

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header & Breadcrumb */}
      <header className="mb-8">
        <nav className="flex items-center text-sm text-slate-500 font-medium mb-4">
          <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-300">{orgName}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-amber-500">Overview</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-xl">
              <span className="text-white font-black text-2xl">{orgName.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{orgName}</h1>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {role}
                </span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-4">
                Organization Workspace
                <Link to={`/organizations/${orgSlug}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Public Profile
                </Link>
              </p>
            </div>
          </div>
          
          {/* Primary Actions */}
          <div className="flex items-center gap-3">
            <Link 
              to={`/organizations/${orgSlug}/manage/members`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </Link>
            <Link 
              to="/manage/t1/overview" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <PlusCircle className="w-4 h-4" />
              Create Tournament
            </Link>
          </div>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to={`/organizations/${orgSlug}/manage/tournaments`} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total Tournaments</p>
          <p className="text-3xl font-black text-white">{organization.totalTournaments}</p>
        </Link>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <p className="text-slate-400 text-sm font-medium mb-1">Active Now</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-black text-white">{stats.activeTournaments}</p>
            <span className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>
        <Link to={`/organizations/${orgSlug}/manage/members`} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Organization Members</p>
          <p className="text-3xl font-black text-white">{organization.staffCount}</p>
        </Link>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Registrations</p>
          <p className="text-3xl font-black text-white">{organization.totalParticipants}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* 3. Active & Upcoming Tournaments (takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Tournaments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-500" /> Active Tournaments
              </h2>
              <Link to={`/organizations/${orgSlug}/manage/tournaments`} className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {activeTournaments.length > 0 ? (
              <div className="space-y-3">
                {activeTournaments.map(tournament => (
                  <div key={tournament.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white">{tournament.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          tournament.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          tournament.status === 'REGISTRATION' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {tournament.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {tournament.currentTeams} / {tournament.maxTeams} Teams registered
                      </p>
                    </div>
                    <Link 
                      to={tournament.link}
                      className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
                    >
                      {tournament.nextAction}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-8 text-center">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">No active tournaments</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">You don't have any live or active tournaments running right now.</p>
              </div>
            )}
          </div>

          {/* Upcoming Tournaments / Schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-500" /> Upcoming Schedule
              </h2>
            </div>
            
            {upcomingSchedule.length > 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-800/50">
                  {upcomingSchedule.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                      <div className="flex gap-4">
                        <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-xs font-bold text-slate-500 uppercase">{item.date}</span>
                          <span className="text-xs font-black text-white">{item.time.split(' ')[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{item.tournament}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{item.context}</p>
                        </div>
                      </div>
                      <Link 
                        to={item.link}
                        className="shrink-0 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-colors border border-slate-700"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-8 text-center">
                <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">Schedule clear</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">No upcoming events scheduled for the next 30 days.</p>
              </div>
            )}
          </div>

        </div>

        {/* 4. Sidebar Content (takes 1/3 space) */}
        <div className="space-y-8">
          
          {/* Attention Required */}
          {actionRequired && actionRequired.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Attention Required
              </h2>
              <div className="space-y-4">
                {actionRequired.map(action => (
                  <div key={action.id} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {action.priority === 'critical' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium leading-tight mb-1">{action.message}</p>
                      <p className="text-xs text-amber-500/70 mb-2">{action.context}</p>
                      <Link to={action.link} className="text-xs font-bold text-amber-500 hover:text-amber-400">
                        {action.actionLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Overview */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Registration Overview</h2>
              <ClipboardList className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Total Pending</span>
                <span className="text-sm font-bold text-amber-500">{organizerDashboardData.registrationOverview.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Approved</span>
                <span className="text-sm font-bold text-white">{organizerDashboardData.registrationOverview.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Waitlisted</span>
                <span className="text-sm font-bold text-slate-400">{organizerDashboardData.registrationOverview.waitlisted}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">From 4 active tournaments</span>
                <Link to={`/organizations/${orgSlug}/manage/analytics`} className="text-xs font-medium text-blue-400 hover:text-blue-300">View detailed analytics &rarr;</Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/organizations/${orgSlug}/manage/tournaments`} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 hover:bg-slate-900 transition-colors">
                <Trophy className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300 text-center">Tournaments</span>
              </Link>
              <Link to={`/organizations/${orgSlug}/manage/members`} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 hover:bg-slate-900 transition-colors">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300 text-center">Members</span>
              </Link>
              <Link to={`/organizations/${orgSlug}/manage/analytics`} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 hover:bg-slate-900 transition-colors">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300 text-center">Analytics</span>
              </Link>
              <Link to={`/organizations/${orgSlug}/manage/settings`} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 hover:bg-slate-900 transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300 text-center">Settings</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activity.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    {act.icon === 'check' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {act.icon === 'zap' && <CalendarDays className="w-4 h-4 text-amber-400" />}
                    {act.icon === 'user' && <Users className="w-4 h-4 text-blue-400" />}
                    {act.icon === 'alert' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{act.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{act.context} • {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
