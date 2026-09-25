import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, Users, Calendar, ArrowRight, Settings, 
  CheckCircle2, Circle, AlertTriangle, LayoutDashboard,
  Clock, CheckSquare, ShieldAlert, MonitorPlay, ListChecks
} from 'lucide-react';
import { mockTournamentData } from '../data/mockTournamentOverview';

export function TournamentOverviewPage() {
  const { tournamentId } = useParams();
  const t = mockTournamentData;

  // Render Status Badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Live': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Upcoming': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Registration Open': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(t.status)}`}>
              {t.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><MonitorPlay className="w-4 h-4" /> {t.game}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {t.dates.start}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/manage/${tournamentId}/settings`} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Edit Tournament
          </Link>
          <Link to={`/t/${t.slug}`} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
            <LayoutDashboard className="w-4 h-4" /> Preview
          </Link>
          <Link to={`/command-center/${tournamentId}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
            Open Command Center
          </Link>
        </div>
      </header>

      {/* Organizer Alerts */}
      {t.alerts && t.alerts.length > 0 && (
        <div className="space-y-3">
          {t.alerts.map(alert => (
            <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border ${
              alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              <div className="flex items-center gap-3">
                {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                <p className="font-medium text-sm">{alert.message}</p>
              </div>
              {alert.cta && (
                <Link to={alert.link} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  alert.type === 'warning' ? 'bg-amber-500/20 hover:bg-amber-500/30' : 'bg-blue-500/20 hover:bg-blue-500/30'
                }`}>
                  {alert.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Setup Progress */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
          <div className="flex-1 w-full max-w-xl">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-lg font-bold text-white">Tournament Setup</h2>
              <span className="text-sm font-bold text-blue-400">{t.setupProgress.completionPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${t.setupProgress.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{t.setupProgress.completedSteps} of {t.setupProgress.totalSteps} setup steps completed</p>
          </div>
          
          {t.setupProgress.completionPercentage < 100 && (
            <Link to={t.setupProgress.steps.find(s => !s.completed)?.link || '#'} className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm shrink-0">
              Continue Setup <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.setupProgress.steps.map(step => (
            <Link key={step.id} to={step.link} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              step.completed 
                ? 'bg-slate-950/50 border-slate-800/50 hover:border-slate-700' 
                : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10'
            }`}>
              {step.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-blue-500 shrink-0" />}
              <span className={`text-sm font-medium ${step.completed ? 'text-slate-400' : 'text-blue-400'}`}>{step.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Key Information */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Key Information</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Game</p>
                <p className="text-sm font-semibold text-white">{t.game}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Format</p>
                <p className="text-sm font-semibold text-white">{t.format}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</p>
                <p className="text-sm font-semibold text-white">{t.type}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Region</p>
                <p className="text-sm font-semibold text-white">{t.region}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Platform</p>
                <p className="text-sm font-semibold text-white">{t.platform}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Capacity</p>
                <p className="text-sm font-semibold text-white">{t.registrations.capacity} Teams</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Registration Summary */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <Link to={`/manage/${tournamentId}/registrations`} className="text-sm font-medium text-blue-400 hover:text-blue-300">Manage</Link>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Registrations</h3>
              <p className="text-2xl font-black text-white mb-6">{t.registrations.current} <span className="text-sm text-slate-500 font-medium">/ {t.registrations.capacity} Teams</span></p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Approved</span>
                  <span className="text-white font-medium">{t.registrations.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-amber-400 font-medium">{t.registrations.pending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Waitlisted</span>
                  <span className="text-slate-300 font-medium">{t.registrations.waitlisted}</span>
                </div>
              </div>
            </div>

            {/* Schedule Summary */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <Link to={`/manage/${tournamentId}/schedule`} className="text-sm font-medium text-blue-400 hover:text-blue-300">Manage</Link>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Schedule Overview</h3>
              
              {t.schedule.configured ? (
                <div className="mt-auto">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Next Match</p>
                    <p className="text-sm font-bold text-white">{t.schedule.nextMatch}</p>
                    <p className="text-xs text-blue-400 mt-1 font-medium flex items-center gap-1.5"><Clock className="w-3 h-3" /> {t.schedule.nextMatchTime}</p>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{t.schedule.totalMatches} scheduled matches total</p>
                </div>
              ) : (
                <div className="mt-auto p-4 bg-slate-950 border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-slate-400 mb-3">Schedule has not been configured yet.</p>
                  <Link to={`/manage/${tournamentId}/schedule`} className="text-xs font-semibold text-blue-400">Configure Schedule</Link>
                </div>
              )}
            </div>
            
            {/* Prize Summary */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <Link to={`/manage/${tournamentId}/prizes`} className="text-sm font-medium text-blue-400 hover:text-blue-300">Manage</Link>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Prize Pool</h3>
              <p className="text-2xl font-black text-emerald-400 mb-6">{t.prizes.totalPool}</p>
              
              {t.prizes.configured ? (
                <div className="space-y-3 mt-auto">
                  {t.prizes.distribution.map((prize, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-950 rounded-lg border border-slate-800/50">
                      <span className="text-slate-400 font-medium">{prize.place} Place</span>
                      <span className="text-white font-bold">{prize.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-auto p-4 bg-slate-950 border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-slate-400 mb-3">Prize structure is incomplete.</p>
                  <Link to={`/manage/${tournamentId}/prizes`} className="text-xs font-semibold text-blue-400">Configure Prizes</Link>
                </div>
              )}
            </div>

            {/* Staff Summary */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <CheckSquare className="w-6 h-6 text-amber-400" />
                </div>
                <Link to={`/manage/${tournamentId}/staff`} className="text-sm font-medium text-blue-400 hover:text-blue-300">Manage</Link>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Assigned Staff</h3>
              <p className="text-2xl font-black text-white mb-6">{t.staff.total} <span className="text-sm text-slate-500 font-medium">Members</span></p>
              
              <div className="space-y-3 mt-auto">
                {t.staff.breakdown.map((role, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-400">{role.role}</span>
                    <span className="text-white font-medium">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link to={`/manage/${tournamentId}/registrations`} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-between group">
                Manage Registrations <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
              <Link to={`/manage/${tournamentId}/schedule`} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-between group">
                Build Schedule <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
              <Link to={`/command-center/${tournamentId}`} className="p-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-sm font-medium text-blue-400 transition-colors flex items-center justify-between group">
                Open Command Center <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Configuration</h2>
            <div className="space-y-3">
              {[
                { label: 'Tournament Rules', status: t.configuration.rules },
                { label: 'Match Format', status: t.configuration.matchFormat },
                { label: 'Scoring Format', status: t.configuration.scoringFormat },
                { label: 'Tie-breaker', status: t.configuration.tieBreaker },
                { label: 'Entry Requirements', status: t.configuration.entryRequirements },
                { label: 'Check-in Requirement', status: t.configuration.checkIn }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  {item.status === 'Configured' 
                    ? <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Configured</span>
                    : <span className="flex items-center gap-1.5 text-slate-500 font-medium text-xs"><Circle className="w-3.5 h-3.5" /> Not Configured</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[7px] before:w-px before:bg-slate-800">
              {t.deadlines.map(deadline => (
                <div key={deadline.id} className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-slate-900 ${
                    deadline.time.includes('In') || deadline.time.includes('Tomorrow') ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <p className="text-sm font-medium text-white">{deadline.label}</p>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{deadline.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {t.activity.map(act => (
                <div key={act.id} className="flex gap-3 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <ListChecks className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 leading-tight mb-1">{act.action}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{act.user} · {act.time}</p>
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

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
