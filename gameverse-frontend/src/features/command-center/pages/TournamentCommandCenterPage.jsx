import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertCircle, CheckCircle2, Clock, Target, Key, Users, Swords, Trophy,
  ChevronRight, Activity, Pause, Play, Zap, TrendingUp, AlertTriangle,
  CheckSquare, XCircle, Timer, ArrowUp
} from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';
import { mockCommandCenterData } from '../data/mockCommandCenter';

// ─── Status color map for match cards (FR-21-008) ─────────────────────────────
const matchStatusConfig = {
  'Completed': { bg: 'bg-emerald-900/30 border-emerald-700/40', badge: 'bg-emerald-600 text-white', dot: 'bg-emerald-400' },
  'In Progress': { bg: 'bg-blue-900/30 border-blue-700/40', badge: 'bg-blue-600 text-white', dot: 'bg-blue-400 animate-pulse' },
  'Lobby Open': { bg: 'bg-amber-900/20 border-amber-700/30', badge: 'bg-amber-600 text-white', dot: 'bg-amber-400 animate-pulse' },
  'Scheduled': { bg: 'bg-slate-800/40 border-slate-700/40', badge: 'bg-slate-700 text-slate-300', dot: 'bg-slate-500' },
  'Delayed': { bg: 'bg-red-900/20 border-red-700/30', badge: 'bg-red-600 text-white', dot: 'bg-red-400 animate-pulse' },
  'Voided': { bg: 'bg-slate-900/30 border-red-900/40', badge: 'bg-red-900 text-red-300', dot: 'bg-red-800' },
};

// ─── Pending Actions Widget (FR-21-007) ──────────────────────────────────────
function PendingActionsWidget({ tournamentId, data }) {
  const items = [
    ...(data.disputes.highPriority > 0 ? [{
      urgency: 'critical', color: 'text-red-400 bg-red-900/20 border-red-700/30',
      icon: AlertCircle, label: `${data.disputes.highPriority} critical dispute${data.disputes.highPriority > 1 ? 's' : ''} require attention`,
      link: `/command-center/${tournamentId}/disputes`
    }] : []),
    ...(data.scoring.awaitingVerification > 0 ? [{
      urgency: 'high', color: 'text-orange-400 bg-orange-900/20 border-orange-700/30',
      icon: Target, label: `${data.scoring.awaitingVerification} result${data.scoring.awaitingVerification > 1 ? 's' : ''} awaiting verification`,
      link: `/command-center/${tournamentId}/scoring`
    }] : []),
    ...(data.checkIn.totalTeams - data.checkIn.checkedInTeams > 0 ? [{
      urgency: 'medium', color: 'text-amber-400 bg-amber-900/20 border-amber-700/30',
      icon: CheckSquare, label: `${data.checkIn.totalTeams - data.checkIn.checkedInTeams} teams not yet checked in`,
      link: `/command-center/${tournamentId}/check-in`
    }] : []),
    {
      urgency: 'low', color: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
      icon: Key, label: 'Match 5 credentials not entered — starts in 12 min',
      link: `/command-center/${tournamentId}/credentials`
    },
    {
      urgency: 'low', color: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
      icon: Timer, label: 'Match 6 starting in < 15 minutes',
      link: `/command-center/${tournamentId}/matches`
    },
  ];

  return (
    <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="font-bold text-white text-base">Pending Actions</h3>
        <span className="ml-auto px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full">{items.length} items</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <Link key={i} to={item.link}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:brightness-110 group ${item.color}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium flex-1">{item.label}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
        {items.length === 0 && (
          <div className="flex items-center gap-3 px-4 py-4 bg-emerald-900/20 border border-emerald-700/30 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">All caught up — no pending actions!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Match Status Grid (FR-21-008) ───────────────────────────────────────────
function MatchStatusGrid({ tournamentId }) {
  const matches = [
    { id: 'm1', num: 1, round: 'R1', group: 'A', status: 'Completed', time: '18:30' },
    { id: 'm2', num: 2, round: 'R1', group: 'B', status: 'Completed', time: '18:30' },
    { id: 'm3', num: 3, round: 'R2', group: 'A', status: 'Completed', time: '19:15' },
    { id: 'm4', num: 4, round: 'R2', group: 'B', status: 'In Progress', time: '19:45' },
    { id: 'm5', num: 5, round: 'R2', group: 'C', status: 'Lobby Open', time: '20:15' },
    { id: 'm6', num: 6, round: 'R3', group: 'A', status: 'Scheduled', time: '21:00' },
    { id: 'm7', num: 7, round: 'R3', group: 'B', status: 'Scheduled', time: '21:45' },
    { id: 'm8', num: 8, round: 'Finals', group: '—', status: 'Scheduled', time: '22:30' },
  ];

  return (
    <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Swords className="w-4 h-4 text-blue-400" />
        <h3 className="font-bold text-white text-base">Match Status Grid</h3>
        <Link to={`/command-center/${tournamentId}/matches`} className="ml-auto text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {matches.map(m => {
          const cfg = matchStatusConfig[m.status] || matchStatusConfig.Scheduled;
          return (
            <Link key={m.id} to={`/command-center/${tournamentId}/matches/${m.id}`}
              className={`p-3 rounded-xl border transition-all hover:brightness-110 cursor-pointer ${cfg.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-white">M{m.num}</span>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              </div>
              <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${cfg.badge} mb-1`}>{m.status}</span>
              <p className="text-[10px] text-slate-500">{m.round} · {m.group}</p>
              <p className="text-[10px] text-slate-600 font-mono">{m.time}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tournament Health Panel (FR-21-009) ─────────────────────────────────────
function TournamentHealthPanel({ data }) {
  const metrics = [
    {
      label: 'Check-in Rate',
      value: `${data.checkIn.checkedInTeams} / ${data.checkIn.totalTeams}`,
      pct: (data.checkIn.checkedInTeams / data.checkIn.totalTeams) * 100,
      color: 'bg-emerald-500',
      icon: CheckSquare,
    },
    {
      label: 'Matches Completed',
      value: `${data.scoring.completedMatches} / ${data.tournament.totalMatches}`,
      pct: (data.scoring.completedMatches / data.tournament.totalMatches) * 100,
      color: 'bg-blue-500',
      icon: Swords,
    },
    {
      label: 'Schedule Delay',
      value: '+12 min',
      pct: 25,
      color: 'bg-amber-500',
      icon: Clock,
      isWarning: true,
    },
    {
      label: 'Pending Verifications',
      value: String(data.scoring.awaitingVerification),
      pct: 100,
      color: data.scoring.awaitingVerification > 0 ? 'bg-orange-500' : 'bg-emerald-500',
      icon: Target,
      isWarning: data.scoring.awaitingVerification > 0,
    },
    {
      label: 'Open Disputes',
      value: String(data.disputes.open),
      pct: 100,
      color: data.disputes.open > 0 ? 'bg-red-500' : 'bg-emerald-500',
      icon: AlertCircle,
      isWarning: data.disputes.open > 0,
    },
  ];

  return (
    <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-emerald-400" />
        <h3 className="font-bold text-white text-base">Tournament Health</h3>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <m.icon className={`w-3.5 h-3.5 ${m.isWarning ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs text-slate-400">{m.label}</span>
              </div>
              <span className={`text-sm font-bold ${m.isWarning ? 'text-amber-400' : 'text-white'}`}>{m.value}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className={`${m.color} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(m.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Current Match Card ───────────────────────────────────────────────────────
function CurrentMatchCard({ tournamentId, match }) {
  return (
    <div className="bg-gradient-to-br from-blue-900/40 via-[#0a1929] to-[#071426] border border-blue-800/40 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
        <Swords className="w-48 h-48 -mr-8 -mt-8" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Current Match
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">{match.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span className="px-2 py-1 bg-slate-800/80 rounded-lg text-slate-300">{match.round} · {match.group}</span>
              <span>{match.teams} Teams · {match.players} Players</span>
              <span className="text-slate-500">Map: {match.map}</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-sm font-bold text-red-400 uppercase tracking-widest">{match.status}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Started: {match.startedAt}</p>
            <Link to={`/command-center/${tournamentId}/matches/${match.id}`}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-colors"
            >
              Open Match Control
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Snapshot ─────────────────────────────────────────────────────
function LeaderboardSnapshot({ tournamentId, data }) {
  return (
    <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-base">Live Standings</h3>
        </div>
        <Link to={`/command-center/${tournamentId}/leaderboard`} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
          Full Board <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-1">
        {data.leaderboard.map((l, i) => (
          <div key={l.team} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/40 transition-colors">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
              l.rank === 1 ? 'bg-amber-500 text-amber-950' :
              l.rank === 2 ? 'bg-slate-300 text-slate-800' :
              l.rank === 3 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-400'
            }`}>{l.rank}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{l.team}</p>
              <p className="text-[10px] text-slate-500">{l.kills} kills · {l.placement} placement pts</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-emerald-400">{l.total}</p>
              <p className="text-[9px] text-slate-600">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Feed ─────────────────────────────────────────────────────────────
function ActivityFeed({ data }) {
  return (
    <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-slate-400" />
        <h3 className="font-bold text-white text-base">Live Activity</h3>
        <span className="flex h-2 w-2 ml-auto">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>
      <div className="space-y-4">
        {data.activities.map((act, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-xs text-slate-600 font-mono w-12 shrink-0 pt-0.5">{act.time}</span>
            <div className="flex-1">
              <div className="w-px bg-slate-800 absolute ml-[-1px] mt-3 h-full" />
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                <span className="text-sm text-slate-300">{act.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Overview Page ───────────────────────────────────────────────────────
export function TournamentCommandCenterPage() {
  const { tournamentId } = useParams();
  const { showToast } = useCommandCenterStore();
  const [data] = useState(mockCommandCenterData);

  // Simulate a demo toast on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast('Match 4 is now In Progress', 'info', 'Match 4 · Round 2 · Group B', 'Open Control', () => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Live tournament operations dashboard</p>
      </div>

      {/* ── KPI Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Teams', value: data.tournament.teams, sub: 'Registered', link: null, icon: Users, color: 'text-blue-400' },
          { label: 'Check-in', value: `${data.checkIn.checkedInTeams}/${data.checkIn.totalTeams}`, sub: `${data.checkIn.percentage}% checked in`, link: `/command-center/${tournamentId}/check-in`, icon: CheckSquare, color: 'text-emerald-400' },
          { label: 'Matches', value: `${data.scoring.completedMatches}/${data.tournament.totalMatches}`, sub: 'Completed', link: `/command-center/${tournamentId}/matches`, icon: Swords, color: 'text-blue-400' },
          { label: 'Pending', value: data.scoring.awaitingVerification, sub: 'Awaiting verification', link: `/command-center/${tournamentId}/scoring`, icon: Target, color: data.scoring.awaitingVerification > 0 ? 'text-amber-400' : 'text-slate-400' },
        ].map((kpi) => {
          const Card = kpi.link ? Link : 'div';
          return (
            <Card
              key={kpi.label}
              to={kpi.link || undefined}
              className="bg-[#0a1929] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* ── Current Match ─────────────────────────────────────────── */}
      <CurrentMatchCard tournamentId={tournamentId} match={data.currentMatch} />

      {/* ── Main 3-col Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1-2: Pending Actions + Match Grid */}
        <div className="lg:col-span-2 space-y-6">
          <PendingActionsWidget tournamentId={tournamentId} data={data} />
          <MatchStatusGrid tournamentId={tournamentId} />
          <ActivityFeed data={data} />
        </div>

        {/* Col 3: Health + Leaderboard */}
        <div className="space-y-6">
          <TournamentHealthPanel data={data} />
          <LeaderboardSnapshot tournamentId={tournamentId} data={data} />
        </div>
      </div>
    </div>
  );
}
