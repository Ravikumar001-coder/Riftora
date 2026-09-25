import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, Play, Pause, Square, 
  Clock, CheckCircle2, AlertCircle, AlertTriangle, Users,
  ListTodo, MoreVertical, X, LayoutGrid, List, AlignLeft, Lock
} from 'lucide-react';
import { mockMatchControlMatches } from '../data/mockMatches';
import { mockCommandCenterData } from '../data/mockCommandCenter';
import { BulkCredentialInputForm } from '../components/BulkCredentialInputForm';

export function TournamentMatchesPage() {
  const { tournamentId } = useParams();
  
  // State
  const [matches, setMatches] = useState(mockMatchControlMatches);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState('All');
  const [lobbyFilter, setLobbyFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: null, matchId: null });
  const [showBulkCredentials, setShowBulkCredentials] = useState(false);
  // FR-21-010: Board / List / Timeline view toggle
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board' | 'timeline'

  // Time ticker for Live matches
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Utility to parse simulated MM:SS duration
  const incrementDuration = (durationStr) => {
    if(!durationStr) return "00:00";
    if(!durationStr.includes(':')) return durationStr;
    const [mins, secs] = durationStr.split(':').map(Number);
    let totalSecs = mins * 60 + secs + 1;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setMatches(prev => prev.map(m => m.status === 'LIVE' ? { ...m, duration: incrementDuration(m.duration) } : m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = () => {
    const { type, matchId } = confirmationModal;
    const match = matches.find(m => m.id === matchId);
    
    let newStatus = '';
    let msg = '';
    let updates = {};

    if (type === 'start') {
      newStatus = 'LIVE';
      msg = 'Match started';
      updates = { startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), duration: '00:00' };
    } else if (type === 'pause') {
      newStatus = 'PAUSED';
      msg = 'Match paused';
    } else if (type === 'resume') {
      newStatus = 'LIVE';
      msg = 'Match resumed';
    } else if (type === 'end') {
      newStatus = 'COMPLETED';
      msg = 'Match completed';
      updates = { completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    }

    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus, ...updates } : m));
    setConfirmationModal({ isOpen: false, type: null, matchId: null });
    showToast(msg);
  };

  // Derived State
  const { filteredMatches, stats, currentLiveMatch, currentPausedMatch } = useMemo(() => {
    let live = 0, startingSoon = 0, ready = 0, waiting = 0, completed = 0;
    let liveMatch = null;
    let pausedMatch = null;

    matches.forEach(m => {
      if (m.status === 'LIVE') { live++; if(!liveMatch) liveMatch = m; }
      if (m.status === 'PAUSED') { if(!pausedMatch) pausedMatch = m; }
      if (m.status === 'READY' || m.status === 'CHECK-IN') {
         if (m.status === 'READY') ready++;
         startingSoon++; 
      }
      if (m.status === 'SCHEDULED') waiting++;
      if (m.status === 'COMPLETED') completed++;
    });

    let filtered = matches.filter(m => {
      const matchSearch = 
        m.displayNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.lobby.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.round.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchRound = roundFilter === 'All' || m.round === roundFilter;
      const matchLobby = lobbyFilter === 'All' || m.lobby === lobbyFilter;
      
      return matchSearch && matchStatus && matchRound && matchLobby;
    });

    // Custom Sort: LIVE > STARTING SOON / READY > CHECK-IN > SCHEDULED > PAUSED > COMPLETED > CANCELLED
    const sortOrder = { 'LIVE': 1, 'READY': 2, 'CHECK-IN': 3, 'SCHEDULED': 4, 'PAUSED': 5, 'COMPLETED': 6, 'CANCELLED': 7 };
    filtered.sort((a, b) => {
       if (sortOrder[a.status] !== sortOrder[b.status]) return sortOrder[a.status] - sortOrder[b.status];
       return a.displayNumber.localeCompare(b.displayNumber);
    });

    return {
      filteredMatches: filtered,
      stats: { live, startingSoon, ready, waiting, completed },
      currentLiveMatch: liveMatch,
      currentPausedMatch: pausedMatch
    };
  }, [matches, searchQuery, statusFilter, roundFilter, lobbyFilter]);

  const featuredMatch = currentLiveMatch || currentPausedMatch;

  const StatusBadge = ({ status }) => {
    const colors = {
      'LIVE': 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      'PAUSED': 'bg-amber-500 text-amber-950',
      'READY': 'bg-emerald-500 text-emerald-950',
      'CHECK-IN': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      'SCHEDULED': 'bg-slate-800 text-slate-400',
      'COMPLETED': 'bg-slate-800 text-slate-400',
      'CANCELLED': 'bg-red-950 text-red-500'
    };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${colors[status] || colors['SCHEDULED']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative pb-32">
      
      {/* Toasts */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`border shadow-xl rounded-lg px-4 py-3 flex items-center gap-3 ${toastMessage.isError ? 'bg-amber-950 border-amber-900' : 'bg-slate-800 border-slate-700'}`}>
            {toastMessage.isError ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <p className="text-white text-sm font-medium">{toastMessage.msg}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-slate-300">Matches</span>
          </nav>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Match Control</h1>
          <p className="text-slate-400">Monitor and control live operational matches.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulkCredentials(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-bold rounded-lg flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            Bulk Credentials
          </button>
        </div>
        {/* FR-21-010: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button onClick={() => setViewMode('list')} title="List View" className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('board')} title="Board View" className={`p-2 rounded-lg transition-colors ${viewMode === 'board' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('timeline')} title="Timeline View" className={`p-2 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><AlignLeft className="w-4 h-4" /></button>
        </div>
      </header>

      {/* Operational Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <button onClick={() => setStatusFilter(statusFilter === 'LIVE' ? 'All' : 'LIVE')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'LIVE' ? 'bg-red-950 border-red-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Now</p>
           <p className={`text-2xl font-black ${stats.live > 0 ? 'text-red-500' : 'text-slate-500'}`}>{stats.live}</p>
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'READY' ? 'All' : 'READY')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'READY' ? 'bg-emerald-950 border-emerald-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ready</p>
           <p className={`text-2xl font-black ${stats.ready > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>{stats.ready}</p>
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'CHECK-IN' ? 'All' : 'CHECK-IN')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'CHECK-IN' ? 'bg-blue-950 border-blue-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-in</p>
           <p className={`text-2xl font-black ${stats.startingSoon - stats.ready > 0 ? 'text-blue-500' : 'text-slate-500'}`}>{stats.startingSoon - stats.ready}</p>
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'SCHEDULED' ? 'All' : 'SCHEDULED')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'SCHEDULED' ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Waiting</p>
           <p className="text-2xl font-black text-slate-300">{stats.waiting}</p>
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'All' : 'COMPLETED')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'COMPLETED' ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
           <p className="text-2xl font-black text-slate-300">{stats.completed}</p>
        </button>
      </div>

      {/* Featured Current Match (if Live or Paused) */}
      {featuredMatch && statusFilter === 'All' && searchQuery === '' && (
        <div className={`mb-8 border rounded-xl overflow-hidden ${featuredMatch.status === 'LIVE' ? 'bg-gradient-to-r from-slate-900 to-red-950/20 border-red-900/50' : 'bg-gradient-to-r from-slate-900 to-amber-950/20 border-amber-900/50'}`}>
           <div className={`px-6 py-3 border-b text-xs font-bold uppercase tracking-widest ${featuredMatch.status === 'LIVE' ? 'bg-red-950/50 border-red-900/50 text-red-400' : 'bg-amber-950/50 border-amber-900/50 text-amber-400'}`}>
             Current Match Focus
           </div>
           <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-3xl font-black text-white">Match {featuredMatch.displayNumber}</h2>
                 <StatusBadge status={featuredMatch.status} />
               </div>
               <p className="text-slate-400 font-medium">{featuredMatch.round} · {featuredMatch.lobby} · {featuredMatch.game}</p>
               <div className="flex items-center gap-6 mt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-300"><Users className="w-4 h-4 text-slate-500" /> {featuredMatch.teams} / {featuredMatch.expectedTeams} Teams</div>
                 <div className="flex items-center gap-2 text-sm text-slate-300"><Clock className="w-4 h-4 text-slate-500" /> Started: {featuredMatch.startedAt}</div>
               </div>
             </div>
             
             <div className="flex flex-col items-end gap-4 w-full md:w-auto">
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Elapsed Time</p>
                 <p className={`text-4xl font-mono font-black tabular-nums tracking-tight ${featuredMatch.status === 'LIVE' ? 'text-white' : 'text-amber-500'}`}>{featuredMatch.duration}</p>
               </div>
               <div className="flex flex-wrap gap-2 w-full md:w-auto">
                 <Link to={`/command-center/${tournamentId}/matches/${featuredMatch.id}`} className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm font-bold rounded-lg text-center">
                   Open Match
                 </Link>
                 {featuredMatch.status === 'LIVE' ? (
                   <button onClick={() => setConfirmationModal({ isOpen: true, type: 'pause', matchId: featuredMatch.id })} className="flex-1 md:flex-none px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                     <Pause className="w-4 h-4 fill-current" /> Pause
                   </button>
                 ) : (
                   <button onClick={() => setConfirmationModal({ isOpen: true, type: 'resume', matchId: featuredMatch.id })} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                     <Play className="w-4 h-4 fill-current" /> Resume
                   </button>
                 )}
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end', matchId: featuredMatch.id })} className="flex-1 md:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                   <Square className="w-4 h-4 fill-current" /> End Match
                 </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search match, round, lobby..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="LIVE">Live</option>
              <option value="READY">Ready</option>
              <option value="CHECK-IN">Check-in</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={roundFilter}
              onChange={e => setRoundFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Rounds</option>
              <option value="Round 1">Round 1</option>
              <option value="Round 2">Round 2</option>
              <option value="Round 3">Round 3</option>
              <option value="Finale">Finale</option>
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={lobbyFilter}
              onChange={e => setLobbyFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Lobbies</option>
              <option value="Lobby A">Lobby A</option>
              <option value="Lobby B">Lobby B</option>
              <option value="Lobby C">Lobby C</option>
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── FR-21-010: Board View (Kanban columns by status) ───────────── */}
      {viewMode === 'board' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {[
              { key: 'LIVE', label: 'Live', color: 'border-red-500/50 bg-red-500/5', badge: 'bg-red-500 text-white' },
              { key: 'READY', label: 'Lobby Open', color: 'border-emerald-500/40 bg-emerald-500/5', badge: 'bg-emerald-600 text-white' },
              { key: 'CHECK-IN', label: 'Check-in', color: 'border-blue-500/40 bg-blue-500/5', badge: 'bg-blue-600 text-white' },
              { key: 'SCHEDULED', label: 'Scheduled', color: 'border-slate-700 bg-slate-900', badge: 'bg-slate-700 text-white' },
              { key: 'PAUSED', label: 'Paused', color: 'border-amber-500/40 bg-amber-500/5', badge: 'bg-amber-600 text-white' },
              { key: 'COMPLETED', label: 'Completed', color: 'border-slate-600 bg-slate-900/50', badge: 'bg-slate-600 text-white' },
            ].map(col => {
              const colMatches = filteredMatches.filter(m => m.status === col.key);
              return (
                <div key={col.key} className={`w-72 shrink-0 rounded-2xl border p-3 ${col.color}`}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>{colMatches.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colMatches.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-600 font-medium">No matches</div>
                    )}
                    {colMatches.map(m => (
                      <div key={m.id} className="bg-[#0a1929] border border-slate-800 rounded-xl p-3 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-white text-sm">{m.displayNumber}</span>
                          <span className="text-xs text-slate-400 font-mono">{m.status === 'LIVE' || m.status === 'PAUSED' ? m.duration : m.scheduledStart}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{m.round} · {m.lobby}</p>
                        {/* FR-21-014: Quick actions on match cards */}
                        <div className="flex gap-1.5">
                          <Link to={`/command-center/${tournamentId}/matches/${m.id}`} className="flex-1 text-center px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg">Open</Link>
                          {m.status === 'CHECK-IN' && <Link to={`/command-center/${tournamentId}/check-in`} className="flex-1 text-center px-2 py-1.5 bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[10px] font-bold rounded-lg">Check-in</Link>}
                          {m.status === 'READY' && <button onClick={() => setConfirmationModal({ isOpen: true, type: 'start', matchId: m.id })} className="flex-1 px-2 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">Open Lobby</button>}
                          {m.status === 'LIVE' && <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end', matchId: m.id })} className="flex-1 px-2 py-1.5 bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg">Enter Results</button>}
                          {m.status === 'COMPLETED' && <Link to={`/command-center/${tournamentId}/scoring`} className="flex-1 text-center px-2 py-1.5 bg-slate-700 text-white text-[10px] font-bold rounded-lg">Score</Link>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FR-21-013: Timeline View ────────────────────────────────────── */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline View — Scheduled vs. Actual</span>
            <span className="text-xs text-slate-500">Hover match blocks for details</span>
          </div>
          <div className="p-5 overflow-x-auto">
            {/* Current time marker */}
            <div className="relative">
              {filteredMatches.map((m, idx) => {
                const scheduledHour = parseInt(m.scheduledStart?.split(':')?.[0] || 18, 10);
                const leftPct = ((scheduledHour - 14) / 12) * 100;
                const widthPct = m.status === 'COMPLETED' ? 8 : m.status === 'LIVE' ? 6 : 4;
                const color = m.status === 'COMPLETED' ? 'bg-blue-600' : m.status === 'LIVE' ? 'bg-red-500 animate-pulse' : m.status === 'PAUSED' ? 'bg-amber-500' : 'bg-slate-600';
                return (
                  <div key={m.id} className="relative h-12 mb-2 flex items-center">
                    <div className="w-32 shrink-0 text-xs font-mono font-bold text-slate-400">{m.displayNumber}</div>
                    <div className="flex-1 relative bg-slate-800/50 rounded-lg h-8">
                      <div
                        className={`absolute top-1 h-6 rounded ${color} flex items-center justify-center text-[10px] font-bold text-white px-2 cursor-pointer group`}
                        style={{ left: `${Math.min(Math.max(leftPct, 0), 90)}%`, width: `${widthPct}%` }}
                        title={`${m.displayNumber} · ${m.round} · ${m.lobby} · ${m.status}`}
                      >
                        {m.round?.replace('Round ', 'R')}
                        <div className="absolute bottom-full left-0 mb-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <p className="font-bold text-white">{m.displayNumber} · {m.lobby}</p>
                          <p className="text-slate-400">{m.round} · Sched: {m.scheduledStart}</p>
                          <p className="text-slate-300 font-medium mt-1">{m.status}</p>
                        </div>
                      </div>
                      {/* Current time cursor */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-red-500/60" style={{ left: '42%' }} />
                    </div>
                  </div>
                );
              })}
              <div className="flex ml-32 mt-2">
                {['14:00','16:00','18:00','20:00','22:00'].map(t => (
                  <div key={t} className="flex-1 text-[10px] text-slate-600 font-mono">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── List View (default) ─────────────────────────────────────────── */}
      {viewMode === 'list' && (
      <>
      {/* Match List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
          <p className="text-slate-400 text-sm">Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-20">Match</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Context</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Teams</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Readiness</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Timing</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMatches.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-white">{m.displayNumber}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-slate-200">{m.round}</p>
                      <p className="text-xs text-slate-400">{m.lobby} · {m.game}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-300">
                      {m.teams} <span className="text-slate-500">/ {m.expectedTeams}</span>
                    </td>
                    <td className="px-4 py-4">
                      {m.status === 'LIVE' || m.status === 'COMPLETED' || m.status === 'PAUSED' ? (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">—</span>
                      ) : m.status === 'READY' ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>
                      ) : (
                        <div className="text-xs font-medium">
                          <p className="text-slate-300">{m.checkedIn} <span className="text-slate-500">Checked in</span></p>
                          <p className="text-amber-400">{m.ready} <span className="text-amber-500/50">Ready</span></p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-4 text-sm">
                      {m.status === 'LIVE' ? (
                        <div>
                           <p className="text-white font-mono font-bold">{m.duration}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Elapsed</p>
                        </div>
                      ) : m.status === 'PAUSED' ? (
                         <div>
                           <p className="text-amber-500 font-mono font-bold">{m.duration}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Paused at</p>
                        </div>
                      ) : m.status === 'COMPLETED' ? (
                         <div>
                           <p className="text-slate-300 font-mono">{m.duration}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Total duration</p>
                        </div>
                      ) : (
                         <div>
                           <p className="text-slate-300 font-mono">{m.scheduledStart}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Scheduled</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link to={`/command-center/${tournamentId}/matches/${m.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded">
                            Open
                          </Link>
                          
                          {/* Status specific actions */}
                          {m.status === 'READY' && (
                             <button onClick={() => setConfirmationModal({ isOpen: true, type: 'start', matchId: m.id })} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg">Start</button>
                          )}
                          {m.status === 'LIVE' && (
                             <button onClick={() => setConfirmationModal({ isOpen: true, type: 'pause', matchId: m.id })} className="px-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded shadow-lg"><Pause className="w-3.5 h-3.5 fill-current" /></button>
                          )}
                          {m.status === 'PAUSED' && (
                             <button onClick={() => setConfirmationModal({ isOpen: true, type: 'resume', matchId: m.id })} className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow-lg"><Play className="w-3.5 h-3.5 fill-current" /></button>
                          )}
                          {(m.status === 'LIVE' || m.status === 'PAUSED') && (
                             <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end', matchId: m.id })} className="px-2 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg"><Square className="w-3.5 h-3.5 fill-current" /></button>
                          )}
                          {(m.status === 'SCHEDULED' || m.status === 'CHECK-IN') && (
                             <Link to={`/command-center/${tournamentId}/check-in`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded">Check-in</Link>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-800">
             {filteredMatches.map(m => (
               <div key={m.id} className="p-4 bg-slate-900">
                 <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                     <span className="font-mono font-bold text-white">{m.displayNumber}</span>
                     <StatusBadge status={m.status} />
                   </div>
                   <span className="text-xs font-mono text-slate-400">{m.status === 'LIVE' ? m.duration : m.scheduledStart}</span>
                 </div>
                 <p className="text-sm font-bold text-slate-200 mb-1">{m.round} · {m.lobby}</p>
                 <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                   <span>{m.teams} / {m.expectedTeams} Teams</span>
                   {m.status === 'READY' && <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>}
                 </div>
                 <div className="flex gap-2">
                    <Link to={`/command-center/${tournamentId}/matches/${m.id}`} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded text-center">
                      Open
                    </Link>
                    {m.status === 'READY' && (
                       <button onClick={() => setConfirmationModal({ isOpen: true, type: 'start', matchId: m.id })} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded text-center shadow-lg">Start</button>
                    )}
                    {m.status === 'LIVE' && (
                       <button onClick={() => setConfirmationModal({ isOpen: true, type: 'pause', matchId: m.id })} className="py-2 px-4 bg-amber-600 text-white rounded shadow-lg"><Pause className="w-3 h-3 fill-current" /></button>
                    )}
                    {(m.status === 'LIVE' || m.status === 'PAUSED') && (
                       <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end', matchId: m.id })} className="py-2 px-4 bg-red-600 text-white rounded shadow-lg"><Square className="w-3 h-3 fill-current" /></button>
                    )}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
      </>
      )}

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmationModal({ isOpen: false, type: null, matchId: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {confirmationModal.type === 'start' ? 'Start Match?' : 
               confirmationModal.type === 'pause' ? 'Pause Match?' : 
               confirmationModal.type === 'resume' ? 'Resume Match?' : 
               'End Match?'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {confirmationModal.type === 'start' ? 'This match will be marked as LIVE and the timer will begin.' : 
               confirmationModal.type === 'pause' ? 'This match will be paused. Timer will stop.' : 
               confirmationModal.type === 'resume' ? 'This match will resume operation.' : 
               'This will mark the match as COMPLETED and move it to result processing.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmationModal({ isOpen: false, type: null, matchId: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={handleAction} className={`px-4 py-2 text-white rounded-lg font-bold flex-1 ${confirmationModal.type === 'end' ? 'bg-red-600 hover:bg-red-500' : confirmationModal.type === 'pause' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                {confirmationModal.type === 'end' ? 'End Match' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Credentials Modal */}
      {showBulkCredentials && (
        <BulkCredentialInputForm
          tournamentId={tournamentId}
          matches={matches.filter(m => m.status === 'SCHEDULED' || m.status === 'CHECK-IN' || m.status === 'READY')}
          onClose={() => setShowBulkCredentials(false)}
          onCredentialsSaved={(creds) => {
             setShowBulkCredentials(false);
             showToast(`Successfully saved ${creds.length} room credentials.`);
          }}
        />
      )}

    </div>
  );
}
