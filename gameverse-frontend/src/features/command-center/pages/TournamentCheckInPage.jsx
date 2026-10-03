import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, CheckSquare, Search, Filter, AlertTriangle, 
  CheckCircle2, Clock, Users, XCircle, MoreVertical, RotateCw, Settings, Play,
  Bell, UserX, Download
} from 'lucide-react';
import { mockCommandCenterData } from '../data/mockCommandCenter';
import { mockCheckInMatches, mockCheckInTeams } from '../data/mockCheckIn';

export function TournamentCheckInPage() {
  const { tournamentId } = useParams();
  
  // State
  const [teams, setTeams] = useState(mockCheckInTeams);
  const [selectedMatchId, setSelectedMatchId] = useState('m_4');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lobbyFilter, setLobbyFilter] = useState('All');
  
  const [selectedTeams, setSelectedTeams] = useState([]);
  
  const [toastMessage, setToastMessage] = useState(null);
  
  // Modals/Drawers
  const [teamDrawer, setTeamDrawer] = useState({ isOpen: false, team: null });
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: null, target: null }); // type: 'checkIn' | 'notReady' | 'bulkCheckIn'

  const t = mockCommandCenterData.tournament;
  const currentMatch = mockCheckInMatches.find(m => m.id === selectedMatchId);

  // Actions
  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    showToast('Check-in status refreshed');
  };

  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const handleConfirmAction = () => {
    const { type, target } = confirmationModal;
    
    if (type === 'checkIn') {
      setTeams(prev => prev.map(team => 
        team.id === target ? { ...team, status: 'Checked In', players: team.players.map(p => ({ ...p, status: 'Ready' })) } : team
      ));
      if (teamDrawer.isOpen && teamDrawer.team?.id === target) {
         setTeamDrawer(prev => ({ ...prev, team: { ...prev.team, status: 'Checked In', players: prev.team.players.map(p => ({ ...p, status: 'Ready' })) } }));
      }
      showToast('Team marked as checked in');
    } else if (type === 'notReady') {
      setTeams(prev => prev.map(team => 
        team.id === target ? { ...team, status: 'Pending' } : team
      ));
      if (teamDrawer.isOpen && teamDrawer.team?.id === target) {
         setTeamDrawer(prev => ({ ...prev, team: { ...prev.team, status: 'Pending' } }));
      }
      showToast('Team marked as not ready');
    } else if (type === 'bulkCheckIn') {
      setTeams(prev => prev.map(team => 
        selectedTeams.includes(team.id) ? { ...team, status: 'Checked In', players: team.players.map(p => ({ ...p, status: 'Ready' })) } : team
      ));
      setSelectedTeams([]);
      showToast(`${selectedTeams.length} teams marked as checked in`);
    }

    setConfirmationModal({ isOpen: false, type: null, target: null });
  };

  // Derived State for Current Match
  const { 
    matchTeams, 
    checkedInCount, 
    pendingCount, 
    lateCount,
    readyPlayers,
    totalPlayers,
    filteredTeams 
  } = useMemo(() => {
    // Filter to current match
    const currentMatchTeams = teams.filter(team => team.matchId === selectedMatchId);
    
    let checkedIn = 0;
    let pending = 0;
    let late = 0;
    let rPlayers = 0;
    let tPlayers = currentMatchTeams.reduce((acc, team) => acc + team.players.length, 0);

    const lobbies = new Set();

    currentMatchTeams.forEach(team => {
      if (team.status === 'Checked In') checkedIn++;
      if (team.status === 'Pending') pending++;
      if (team.status === 'Late') late++;
      
      lobbies.add(team.lobby);
      rPlayers += team.players.filter(p => p.status === 'Ready').length;
    });

    const fTeams = currentMatchTeams.filter(team => {
      const matchSearch = 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        team.captain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || team.status === statusFilter;
      const matchLobby = lobbyFilter === 'All' || team.lobby === lobbyFilter;
      
      return matchSearch && matchStatus && matchLobby;
    });

    return {
      matchTeams: currentMatchTeams,
      checkedInCount: checkedIn,
      pendingCount: pending,
      lateCount: late,
      readyPlayers: rPlayers,
      totalPlayers: tPlayers,
      lobbies: Array.from(lobbies),
      filteredTeams: fTeams
    };
  }, [teams, selectedMatchId, searchQuery, statusFilter, lobbyFilter]);

  const isMatchReady = checkedInCount === currentMatch?.teams;
  const checkInPercentage = currentMatch?.teams > 0 ? (checkedInCount / currentMatch.teams) * 100 : 0;

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
            <span className="text-slate-300">Check-in</span>
          </nav>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Check-in</h1>
          <p className="text-slate-400">Track team and player readiness before tournament matches.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button onClick={handleRefresh} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm border border-slate-700">
             <RotateCw className="w-4 h-4" /> Refresh
           </button>
           <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm border border-slate-700">
             <Settings className="w-4 h-4" /> Settings
           </button>
        </div>
      </header>

      {/* ── FR-21-017: Bulk Actions Toolbar ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-[#0a1929] border border-slate-800 rounded-2xl">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bulk Actions</span>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            onClick={() => showToast('Reminder sent to all unchecked-in teams')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 text-xs font-bold rounded-xl transition-colors"
          >
            <Bell className="w-3.5 h-3.5" /> Remind All Unchecked
          </button>
          <button
            onClick={() => {
              if (window.confirm('Mark all unchecked-in teams as No-Show? This cannot be undone easily.')) {
                setTeams(prev => prev.map(t => t.status !== 'Checked In' ? { ...t, status: 'Late' } : t));
                showToast('All unchecked-in teams marked as No-Show', true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 text-xs font-bold rounded-xl transition-colors"
          >
            <UserX className="w-3.5 h-3.5" /> Mark All No-Show
          </button>
          <button
            onClick={() => {
              const csv = ['Team,Captain,Status,Lobby,Last Activity', ...teams.map(t => `${t.name},${t.captain},${t.status},${t.lobby},${t.lastActivity}`)].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'check-in-list.csv'; a.click();
              showToast('Check-in list exported as CSV');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider shrink-0">Select Match</label>
        <select 
          value={selectedMatchId}
          onChange={e => setSelectedMatchId(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-white text-sm font-bold rounded-lg p-2.5 w-full sm:w-auto min-w-[250px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {mockCheckInMatches.map(m => (
            <option key={m.id} value={m.id}>{m.title} · {m.round} · {m.group}</option>
          ))}
        </select>
        
        {currentMatch && (
          <div className="flex gap-4 sm:ml-auto text-sm">
            <div className="flex items-center gap-2 text-slate-300"><Users className="w-4 h-4 text-slate-500" /> {currentMatch.teams} Teams / {currentMatch.players} Players</div>
            <div className="flex items-center gap-2 text-amber-400"><Clock className="w-4 h-4" /> Deadline: {currentMatch.deadline}</div>
          </div>
        )}
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5" style={{ width: `${checkInPercentage}%` }}></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 relative z-10">Checked In</p>
          <div className="flex items-end gap-2 relative z-10">
            <p className="text-3xl font-black text-white">{checkedInCount}</p>
            <p className="text-sm text-slate-400 mb-1 font-medium">/ {currentMatch?.teams} Teams</p>
          </div>
          <p className="text-emerald-400 text-sm font-bold mt-2 relative z-10">{checkInPercentage.toFixed(1)}% Ready</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Players Ready</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-white">{readyPlayers}</p>
            <p className="text-sm text-slate-400 mb-1 font-medium">/ {totalPlayers} Players</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-3xl font-black text-amber-400">{pendingCount}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Late</p>
          <p className={`text-3xl font-black ${lateCount > 0 ? 'text-red-500' : 'text-slate-600'}`}>{lateCount}</p>
        </div>
      </div>

      {/* Readiness Banner */}
      {isMatchReady ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Lobby Ready</p>
              <p className="text-sm text-emerald-400/90 font-medium mt-0.5">All participating teams have completed check-in.</p>
            </div>
          </div>
          <Link to={`/command-center/${tournamentId}/matches/${selectedMatchId}`} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shrink-0 shadow-lg flex items-center gap-2">
            <Play className="w-4 h-4" /> Open Match
          </Link>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Lobby Not Ready</p>
            <p className="text-sm text-amber-400/90 font-medium mt-0.5">{pendingCount + lateCount} teams still require attention before {currentMatch?.title} can begin.</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left: Teams List */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search teams or captain..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Pending">Pending</option>
                  <option value="Late">Late</option>
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
                </select>
                <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredTeams.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
              <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No teams found</h3>
              <p className="text-slate-400 text-sm">Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">
                        <input 
                          type="checkbox" 
                          onChange={(e) => setSelectedTeams(e.target.checked ? filteredTeams.map(t => t.id) : [])}
                          checked={selectedTeams.length === filteredTeams.length && filteredTeams.length > 0}
                          className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Team</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Lobby</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Players Ready</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Last Activity</th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTeams.map((team) => {
                      const playersReady = team.players.filter(p => p.status === 'Ready').length;
                      const isReady = playersReady === team.players.length && team.status === 'Checked In';
                      
                      return (
                        <tr 
                          key={team.id} 
                          className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedTeams.includes(team.id) ? 'bg-blue-900/10' : ''}`}
                          onClick={(e) => {
                            // Don't open drawer if clicking checkbox or action menu
                            if (e.target.tagName !== 'INPUT' && !e.target.closest('button')) {
                              setTeamDrawer({ isOpen: true, team });
                            }
                          }}
                        >
                          <td className="px-4 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedTeams.includes(team.id)}
                              onChange={() => toggleTeamSelection(team.id)}
                              className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-bold text-white">{team.name}</p>
                            <p className="text-xs text-slate-400">Capt: {team.captain}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-bold text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">{team.lobby}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {isReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                              <span className="text-sm font-bold text-white">{playersReady} <span className="text-slate-500 text-xs font-medium">/ {team.players.length}</span></span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                              ${team.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400' : 
                                team.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                                'bg-red-500/10 text-red-400'}`}>
                              {team.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-mono text-slate-400">
                            {team.lastActivity}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="relative group/menu inline-block">
                              <button className="p-1.5 text-slate-400 hover:text-white rounded" onClick={e => e.stopPropagation()}>
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden text-left">
                                {team.status !== 'Checked In' && (
                                  <button onClick={() => setConfirmationModal({ isOpen: true, type: 'checkIn', target: team.id })} className="w-full text-left px-4 py-2 text-sm text-emerald-400 font-bold hover:bg-slate-700">Mark Checked In</button>
                                )}
                                {team.status === 'Checked In' && (
                                  <button onClick={() => setConfirmationModal({ isOpen: true, type: 'notReady', target: team.id })} className="w-full text-left px-4 py-2 text-sm text-amber-400 font-bold hover:bg-slate-700">Mark Not Ready</button>
                                )}
                                <button onClick={() => setTeamDrawer({ isOpen: true, team })} className="w-full text-left px-4 py-2 text-sm text-slate-300 font-medium hover:bg-slate-700">View Details</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-800">
                 {filteredTeams.map((team) => {
                    const playersReady = team.players.filter(p => p.status === 'Ready').length;
                    
                    return (
                      <div key={team.id} className="p-4 bg-slate-900 cursor-pointer hover:bg-slate-800/50" onClick={() => setTeamDrawer({ isOpen: true, team })}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedTeams.includes(team.id)}
                              onChange={(e) => { e.stopPropagation(); toggleTeamSelection(team.id); }}
                              className="w-4 h-4 bg-slate-950 border-slate-700 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{team.name}</p>
                              <p className="text-xs text-slate-400">Capt: {team.captain}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                              ${team.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400' : 
                                team.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                                'bg-red-500/10 text-red-400'}`}>
                            {team.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            {playersReady === team.players.length ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            <span className="text-sm font-bold text-white">{playersReady} <span className="text-slate-500 text-xs font-medium">/ {team.players.length} Ready</span></span>
                          </div>
                          <button className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded">View</button>
                        </div>
                      </div>
                    );
                 })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Activity & Readiness */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-4">Match {selectedMatchId.replace('m_','')} Readiness</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-400 font-medium">Teams</span>
                 <span className={`text-sm font-bold ${checkedInCount === currentMatch?.teams ? 'text-emerald-400' : 'text-amber-400'}`}>{checkedInCount} / {currentMatch?.teams}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-400 font-medium">Players</span>
                 <span className={`text-sm font-bold ${readyPlayers === totalPlayers ? 'text-emerald-400' : 'text-amber-400'}`}>{readyPlayers} / {totalPlayers}</span>
               </div>
               <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                 <span className="text-sm text-slate-400 font-medium">Issues</span>
                 <span className="text-sm font-bold text-red-400">{pendingCount + lateCount}</span>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Activity</h3>
             <div className="space-y-4 relative">
               <div className="absolute top-2 bottom-0 left-[3px] w-px bg-slate-800"></div>
               {/* Mock Activity Data based on teams */}
               <div className="flex gap-3 text-sm relative z-10">
                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-slate-300 font-medium text-xs leading-tight">Shadow Wolves checked in</p>
                   <p className="text-slate-500 font-mono text-[10px] mt-0.5">1 min ago</p>
                 </div>
               </div>
               <div className="flex gap-3 text-sm relative z-10">
                 <div className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-slate-300 font-medium text-xs leading-tight">Team Phoenix checked in</p>
                   <p className="text-slate-500 font-mono text-[10px] mt-0.5">2 mins ago</p>
                 </div>
               </div>
               <div className="flex gap-3 text-sm relative z-10">
                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-slate-300 font-medium text-xs leading-tight">Cyber Ninjas player Kabir marked Not Ready</p>
                   <p className="text-slate-500 font-mono text-[10px] mt-0.5">6 mins ago</p>
                 </div>
               </div>
               <div className="flex gap-3 text-sm relative z-10">
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-slate-300 font-medium text-xs leading-tight">Alpha Squad marked Late</p>
                   <p className="text-slate-500 font-mono text-[10px] mt-0.5">15 mins ago</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Bulk Action Footer */}
      {selectedTeams.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 flex flex-col sm:flex-row justify-center items-center gap-4 animate-in slide-in-from-bottom">
          <p className="text-sm font-bold text-white"><span className="text-blue-400">{selectedTeams.length}</span> teams selected</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmationModal({ isOpen: true, type: 'bulkCheckIn' })} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg">Mark Checked In</button>
            <button onClick={() => setSelectedTeams([])} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium border border-slate-700 rounded-lg">Clear Selection</button>
          </div>
        </div>
      )}

      {/* Team Details Drawer */}
      {teamDrawer.isOpen && teamDrawer.team && (
        <>
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={() => setTeamDrawer({ isOpen: false, team: null })} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">{teamDrawer.team.name}</h3>
                <p className="text-sm text-slate-400">Match {selectedMatchId.replace('m_','')} · {teamDrawer.team.lobby}</p>
              </div>
              <button onClick={() => setTeamDrawer({ isOpen: false, team: null })} className="text-slate-500 hover:text-white p-2">✕</button>
            </div>
            
            <div className="p-6 flex-1">
              
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Check-in Status</p>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                    ${teamDrawer.team.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400' : 
                      teamDrawer.team.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                      'bg-red-500/10 text-red-400'}`}>
                    {teamDrawer.team.status}
                  </span>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Activity</p>
                   <p className="text-sm font-mono text-white">{teamDrawer.team.lastActivity}</p>
                </div>
              </div>

              <div className="mb-6 flex justify-between items-center">
                 <h4 className="font-bold text-white text-lg">Players</h4>
                 <p className="text-sm font-bold text-emerald-400">{teamDrawer.team.players.filter(p => p.status === 'Ready').length} / {teamDrawer.team.players.length} Ready</p>
              </div>

              <div className="space-y-3">
                {teamDrawer.team.players.map(player => (
                  <div key={player.id} className="flex justify-between items-center p-3 border border-slate-800 rounded-lg bg-slate-900/50">
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {player.status === 'Ready' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {player.name}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1 ml-6">{player.role}</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-bold uppercase tracking-wider ${player.status === 'Ready' ? 'text-emerald-400' : 'text-amber-400'}`}>{player.status}</p>
                       {player.checkInTime && <p className="text-[10px] text-slate-500 font-mono mt-1">{player.checkInTime}</p>}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex gap-3">
               {teamDrawer.team.status !== 'Checked In' ? (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'checkIn', target: teamDrawer.team.id })} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Mark Checked In</button>
               ) : (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'notReady', target: teamDrawer.team.id })} className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg">Mark Not Ready</button>
               )}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmationModal({ isOpen: false, type: null, target: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {confirmationModal.type === 'checkIn' ? 'Mark Team Checked In?' : 
               confirmationModal.type === 'notReady' ? 'Mark Team Not Ready?' : 
               `Mark ${selectedTeams.length} Teams Checked In?`}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {confirmationModal.type === 'checkIn' ? 'This team will be marked as ready for the match.' : 
               confirmationModal.type === 'notReady' ? 'This team will no longer be considered ready.' : 
               'The selected teams will be marked as ready for the match.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmationModal({ isOpen: false, type: null, target: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={handleConfirmAction} className={`px-4 py-2 text-white rounded-lg font-bold flex-1 ${confirmationModal.type === 'notReady' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
