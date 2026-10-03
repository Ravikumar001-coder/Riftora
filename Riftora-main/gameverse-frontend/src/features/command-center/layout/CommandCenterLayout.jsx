import React, { useEffect, useCallback } from 'react';
import { Outlet, NavLink, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Swords, Target, Trophy, AlertCircle,
  IndianRupee, FileText, ArrowLeft, Radio, Bell, Key, Megaphone,
  Wifi, WifiOff, Command, Tv2, Clock, Shield
} from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';
import { CommandPalette } from '../components/CommandPalette';
import { ToastContainer } from '../components/ToastContainer';
import { NotificationTray } from '../components/NotificationTray';

// ─── Live Clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = React.useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-sm text-slate-300 tabular-nums">
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    LIVE: 'bg-red-500/15 border-red-500/30 text-red-400',
    CHECK_IN: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    SCHEDULED: 'bg-slate-700/50 border-slate-600 text-slate-400',
    COMPLETED: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    PAUSED: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
  };
  const cls = config[status] || config.SCHEDULED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold uppercase tracking-wider ${cls}`}>
      {status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {status}
    </span>
  );
}

// ─── Main Layout ───────────────────────────────────────────────────────────────
export function CommandCenterLayout() {
  const { tournamentId } = useParams();
  const {
    wsConnected, setWsConnected,
    isPaletteOpen, setPaletteOpen,
    isTrayOpen, setTrayOpen,
    allNotifications,
    badgeCounts,
    isRefereeMode,
    criticalDisputeAlert, dismissCriticalAlert,
  } = useCommandCenterStore();

  // Simulate WebSocket connection (FR-21-002)
  useEffect(() => {
    const timer = setTimeout(() => setWsConnected(true), 1200);
    return () => clearTimeout(timer);
  }, [setWsConnected]);

  // Global keyboard shortcuts (FR-21-044, FR-21-045)
  const handleKeyDown = useCallback((e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && e.key === 'k') {
      e.preventDefault();
      setPaletteOpen(!isPaletteOpen);
      return;
    }
    // Close palette on Escape (handled inside palette too)
    if (e.key === 'Escape' && isPaletteOpen) {
      setPaletteOpen(false);
    }
  }, [isPaletteOpen, setPaletteOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Nav items with live badge counts (FR-21-004)
  const allNavItems = [
    { name: 'Overview', path: `/command-center/${tournamentId}`, icon: LayoutDashboard, exact: true },
    { name: 'Check-in', path: `/command-center/${tournamentId}/check-in`, icon: CheckSquare, badge: badgeCounts.checkin },
    { name: 'Matches', path: `/command-center/${tournamentId}/matches`, icon: Swords },
    { name: 'Scoring', path: `/command-center/${tournamentId}/scoring`, icon: Target, badge: badgeCounts.scoring },
    { name: 'Leaderboard', path: `/command-center/${tournamentId}/leaderboard`, icon: Trophy },
    { name: 'Credentials', path: `/command-center/${tournamentId}/credentials`, icon: Key, badge: badgeCounts.credentials },
    { name: 'Disputes', path: `/command-center/${tournamentId}/disputes`, icon: AlertCircle, badge: badgeCounts.disputes, badgeCritical: badgeCounts.disputes > 0 },
    { name: 'Announcements', path: `/command-center/${tournamentId}/announcements`, icon: Megaphone },
    { name: 'Broadcast', path: `/command-center/${tournamentId}/broadcast`, icon: Tv2 },
    { name: 'Finance', path: `/command-center/${tournamentId}/finance`, icon: IndianRupee },
    { name: 'Audit', path: `/command-center/${tournamentId}/audit`, icon: FileText },
  ];

  // Referee Mode: only show limited sections (FR-21-005)
  const navItems = isRefereeMode
    ? allNavItems.filter(n => ['Matches', 'Scoring', 'Announcements'].includes(n.name))
    : allNavItems;

  const unreadCount = allNotifications.filter(n => !n.dismissed).length;

  return (
    <div className="h-screen overflow-hidden bg-transparent flex flex-col">

      {/* ── PERSISTENT STATUS BAR (FR-21-003) ──────────────────────────────── */}
      <header className="h-14 bg-[#0a1929] border-b border-slate-800/80 flex items-center px-4 gap-4 z-[100] shrink-0">
        {/* Back */}
        <Link to={`/manage/${tournamentId}/overview`} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium hidden md:block">Back</span>
        </Link>

        <div className="w-px h-5 bg-slate-800 mx-1" />

        {/* Tournament name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm truncate max-w-[200px]">
            BGMI Championship — S1
          </span>
          <StatusBadge status="LIVE" />
        </div>

        <div className="flex-1" />

        {/* Clock (FR-21-003) */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <LiveClock />
        </div>

        <div className="w-px h-5 bg-slate-800 mx-2" />

        {/* Referee Mode badge */}
        {isRefereeMode && (
          <div className="px-2.5 py-1 bg-purple-600/20 border border-purple-500/30 rounded-md">
            <span className="text-xs font-bold text-purple-400">Referee Mode</span>
          </div>
        )}

        {/* Command Palette trigger (FR-21-045) */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors text-xs"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Command</span>
          <kbd className="px-1 py-0.5 bg-slate-700 border border-slate-600 rounded text-[9px] font-mono">⌘K</kbd>
        </button>

        {/* Notification Tray trigger (FR-21-043) */}
        <button
          onClick={() => setTrayOpen(!isTrayOpen)}
          className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* WebSocket connection indicator (FR-21-003) */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          {wsConnected ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-500 font-medium hidden md:block">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-red-500 font-medium hidden md:block">Reconnecting...</span>
            </>
          )}
        </div>
      </header>

      {/* ── CRITICAL DISPUTE ALERT (FR-21-033) ─────────────────────────────── */}
      {criticalDisputeAlert && (
        <div className="bg-red-900/30 border-b border-red-700/50 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
            <p className="text-sm font-bold text-red-200">⚠️ New Critical Dispute: {criticalDisputeAlert}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/command-center/${tournamentId}/disputes`}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Review Now
            </Link>
            <button
              onClick={dismissCriticalAlert}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* ── SIDEBAR NAV (FR-21-004) ─────────────────────────────────────────── */}
        <aside className="w-60 shrink-0 bg-[#0a1929] border-r border-slate-800/80 flex flex-col overflow-y-auto">
          {/* Section header */}
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Command Center</span>
            </div>
            {isRefereeMode && (
              <p className="text-[10px] text-purple-400 mt-1">Referee View — Limited Access</p>
            )}
          </div>

          <nav className="flex-1 px-3 pb-4 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex justify-between items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    item.badgeCritical ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Keyboard shortcut hint (FR-21-044) */}
          <div className="p-3 mx-3 mb-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1">
              {[
                ['⌘K', 'Command Palette'],
                ['G+O', 'Overview'],
                ['G+C', 'Check-in'],
                ['G+M', 'Matches'],
                ['G+S', 'Scoring'],
                ['G+D', 'Disputes'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono text-slate-400 shrink-0">{key}</kbd>
                  <span className="text-[9px] text-slate-600 truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── OVERLAYS ─────────────────────────────────────────────────────────── */}
      <CommandPalette />
      <ToastContainer />
      <NotificationTray />
    </div>
  );
}
