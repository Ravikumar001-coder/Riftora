import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, Users, Calendar, ArrowRight, Settings, 
  CheckCircle2, Circle, AlertTriangle, LayoutDashboard,
  Clock, CheckSquare, ShieldAlert, MonitorPlay, ListChecks, Loader2, ChevronRight, FileText
} from 'lucide-react';
import { useGetTournament, useUpdateTournamentStatus } from '../api/useTournamentQueries';
import { useTournamentStaff } from '../api/useStaffQueries';
import { useGetTournamentRegistrations } from '../api/useAdminRegistrationQueries';
import { useGames } from '../../games/hooks/useGameQueries';
import { api } from '../../../services/api';

export function TournamentOverviewPage() {
  const { tournamentId } = useParams();
  
  const { data: t, isLoading: isTournamentLoading } = useGetTournament(tournamentId);
  const { data: staffList, isLoading: isStaffLoading } = useTournamentStaff(tournamentId);
  const { data: registrationsPage } = useGetTournamentRegistrations(tournamentId, 0, 500);
  const { data: games = [] } = useGames();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTournamentStatus();
  
  const [isExporting, setIsExporting] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handlePublish = () => {
    updateStatus({ tournamentId, status: 'PUBLISHED' }, {
      onSuccess: () => {
        setShowPublishModal(false);
        setToastMessage('Tournament published successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      },
      onError: (err) => {
        alert('Failed to publish tournament');
        setShowPublishModal(false);
      }
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get(`/tournaments/${tournamentId}/export/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tournament-report-${tournamentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF', error);
      alert('Failed to generate report.');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to get game name
  const getGameName = (gameId) => {
    if (!gameId) return 'TBD';
    const game = games.find(g => g.game_id === gameId || g.id === gameId);
    return game ? (game.game_name || game.name) : gameId;
  };

  // Render Status Badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'ONGOING': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'PUBLISHED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REGISTRATION_OPEN': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (isTournamentLoading || isStaffLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!t) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Tournament Not Found</h2>
        <p>The requested tournament could not be loaded.</p>
      </div>
    );
  }

  const staffCount = staffList ? staffList.length : 0;
  
  let setupSteps = 0;
  let completedStepsCount = 0;
  const steps = [];
  
  const checkStep = (label, isComplete, link) => {
    setupSteps++;
    if (isComplete) completedStepsCount++;
    steps.push({ id: setupSteps, label, completed: isComplete, link });
  };

  checkStep('Basic Information', !!t.name && !!(t.game_id || t.gameId), `/manage/${tournamentId}/edit?step=1`);
  checkStep('Format & Schedule', !!(t.format_type || t.formatType) && !!(t.start_date || t.startDate), `/manage/${tournamentId}/edit?step=2`);
  checkStep('Registration Settings', !!(t.registration_open || t.registrationOpen), `/manage/${tournamentId}/edit?step=3`);
  checkStep('Prize Pool', (t.prize_pool_total || t.prizePoolTotal || 0) > 0, `/manage/${tournamentId}/edit?step=4`);
  checkStep('Rules & Communication', !!t.description, `/manage/${tournamentId}/edit?step=5`);
  checkStep('Staff & Access', staffCount > 0, `/manage/${tournamentId}/staff`);
  checkStep('Publish Tournament', t.status !== 'draft' && t.status !== 'DRAFT', `/manage/${tournamentId}/edit?step=7`);

  const completionPercentage = Math.round((completedStepsCount / setupSteps) * 100);

  const alerts = [];
  if (staffCount === 0) {
    alerts.push({ id: 1, type: 'warning', message: 'No staff members have been assigned.', cta: 'Assign Staff', link: `/manage/${tournamentId}/staff` });
  }
  if (!t.description) {
    alerts.push({ id: 2, type: 'info', message: 'Tournament rules are incomplete.', cta: 'Add Rules', link: `/manage/${tournamentId}/settings` });
  }

  const registrations = registrationsPage?.content || [];
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const pendingCount = registrations.filter(r => r.status === 'under_review').length;
  const waitlistedCount = registrations.filter(r => r.status === 'waitlisted').length;

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-white text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
      
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
            <span className="flex items-center gap-1.5"><MonitorPlay className="w-4 h-4" /> {getGameName(t.game_id || t.gameId)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {(t.start_date || t.startDate) ? new Date(t.start_date || t.startDate).toLocaleDateString() : 'TBD'}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {completionPercentage === 100 && t.status !== 'PUBLISHED' && t.status !== 'COMPLETED' && (
            <button 
              onClick={() => setShowPublishModal(true)}
              disabled={isUpdatingStatus}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-emerald-500 disabled:opacity-50"
            >
              {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Publish to Public
            </button>
          )}
          <button 
            onClick={handleExport} 
            disabled={isExporting}
            className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Export Report'}
          </button>
          <Link to={`/manage/${tournamentId}/edit`} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Edit Tournament
          </Link>
          {t.status === 'PUBLISHED' ? (
            <Link to={`/t/${t.slug}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
              <LayoutDashboard className="w-4 h-4" /> View Public Page
            </Link>
          ) : (
            <Link to={`/t/${t.slug}`} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
              <LayoutDashboard className="w-4 h-4" /> Preview
            </Link>
          )}
          <Link to={`/command-center/${tournamentId}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
            Open Command Center
          </Link>
        </div>
      </header>

      {/* Organizer Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map(alert => (
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
              <span className="text-sm font-bold text-blue-400">{completionPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{completedStepsCount} of {setupSteps} setup steps completed</p>
          </div>
          
          {completionPercentage < 100 && (
            <Link to={steps.find(s => !s.completed)?.link || '#'} className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm shrink-0">
              Continue Setup <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(step => (
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
                <p className="text-sm font-semibold text-white">{getGameName(t.game_id || t.gameId)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Format</p>
                <p className="text-sm font-semibold text-white">{(t.format_type || t.formatType) || 'TBD'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tournament Type</p>
                <p className="text-sm font-semibold text-white">{(t.tournament_type || t.tournamentType) || 'Online'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-white">{t.status || 'DRAFT'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Platform</p>
                <p className="text-sm font-semibold text-white">Any</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Teams Capacity</p>
                <p className="text-sm font-semibold text-white">{(t.total_team_slots || t.totalTeamSlots) || 0} Teams</p>
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
              <p className="text-2xl font-black text-white mb-6">{(t.slots_taken || t.slotsTaken) || 0} <span className="text-sm text-slate-500 font-medium">/ {(t.total_team_slots || t.totalTeamSlots) || 0} Teams</span></p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Approved</span>
                  <span className="text-white font-medium">{approvedCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-amber-400 font-medium">{pendingCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Waitlisted</span>
                  <span className="text-slate-300 font-medium">{waitlistedCount}</span>
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
              
              {(t.start_date || t.startDate) ? (
                <div className="mt-auto">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Start Date</p>
                    <p className="text-sm font-bold text-white">{new Date(t.start_date || t.startDate).toLocaleDateString()}</p>
                    <p className="text-xs text-blue-400 mt-1 font-medium flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(t.start_date || t.startDate).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{(t.total_rounds || t.totalRounds) || 0} rounds total</p>
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
              <p className="text-2xl font-black text-emerald-400 mb-6">{(t.prize_currency || t.prizeCurrency) || '$'}{(t.prize_pool_total || t.prizePoolTotal) || 0}</p>
              
              {(t.prize_pool_total || t.prizePoolTotal) > 0 ? (
                <div className="space-y-3 mt-auto">
                  {(t.prize_positions || t.prizePositions) && (t.prize_positions || t.prizePositions).map((prize, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-950 rounded-lg border border-slate-800/50">
                      <span className="text-slate-400 font-medium">{prize.position} Place</span>
                      <span className="text-white font-bold">{(t.prize_currency || t.prizeCurrency) || '$'}{prize.amount}</span>
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
              <p className="text-2xl font-black text-white mb-6">{staffCount} <span className="text-sm text-slate-500 font-medium">Members</span></p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Staff</span>
                  <span className="text-white font-medium">{staffCount}</span>
                </div>
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
                Manage Registrations <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
              <Link to={`/manage/${tournamentId}/schedule`} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-between group">
                Build Schedule <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
              <button onClick={handleExport} disabled={isExporting} className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed">
                <span>Export PDF Report</span>
                {isExporting ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin" /> : <FileText className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />}
              </button>
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
                { label: 'Tournament Rules', status: t.description ? 'Configured' : 'Not Configured' },
                { label: 'Match Format', status: t.formatType ? 'Configured' : 'Not Configured' },
                { label: 'Waitlist', status: t.waitlistEnabled ? 'Configured' : 'Not Configured' },
                { label: 'Entry Requirements', status: t.entryFee ? 'Configured' : 'Not Configured' },
                { label: 'Check-in Requirement', status: t.checkinRequired ? 'Configured' : 'Not Configured' }
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
              {t.registrationClose && (
                <div className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-slate-900 ${
                    new Date(t.registrationClose) < new Date() ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <p className="text-sm font-medium text-white">Registration closes</p>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{new Date(t.registrationClose).toLocaleDateString()}</p>
                </div>
              )}
              {t.startDate && (
                <div className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-slate-900 ${
                    new Date(t.startDate) < new Date() ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <p className="text-sm font-medium text-white">First match</p>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{new Date(t.startDate).toLocaleDateString()}</p>
                </div>
              )}
              {!t.registrationClose && !t.startDate && (
                <p className="text-sm text-slate-500 italic pl-6">No deadlines configured yet.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 italic">No recent activity to show.</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPublishModal(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md relative z-10 p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-full shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Publish Tournament</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to publish this tournament? It will immediately become visible to players on the public explore page and they will be able to register.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowPublishModal(false)}
                disabled={isUpdatingStatus}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                disabled={isUpdatingStatus}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
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
