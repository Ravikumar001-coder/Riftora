import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Play, Pause, Square, AlertCircle, Clock, 
  CheckCircle2, Users, AlertTriangle, MessageSquare, History, Search,
  ArrowLeft
} from 'lucide-react';
import { mockMatchDetail } from '../data/mockMatchDetail';
import { useAssignReferee } from '../api/useMatchQueries';
import { useTournamentStaff } from '../../tournaments/api/useStaffQueries';
import { CredentialInputForm } from '../components/CredentialInputForm';

export function TournamentMatchDetailPage() {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [match, setMatch] = useState(() => {
    // Override the mock match ID to match the URL just for realism
    return { ...mockMatchDetail, id: matchId };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: null });
  const [assignRefereeModal, setAssignRefereeModal] = useState(false);

  const { data: staffList = [] } = useTournamentStaff(tournamentId);
  const assignRefereeMutation = useAssignReferee();

  // Time ticker for Live matches
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (match.status === 'LIVE') {
      setMatch(prev => ({ ...prev, duration: incrementDuration(prev.duration) }));
    }
  }, [ticker, match.status]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = () => {
    const { type } = confirmationModal;
    let newStatus = '';
    let msg = '';
    let updates = {};
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (type === 'start') {
      newStatus = 'LIVE';
      msg = 'Match started';
      updates = { 
        startedAt: currentTime, 
        duration: '00:00',
        timeline: [...match.timeline, { id: Date.now(), time: currentTime, event: 'Match started' }] 
      };
    } else if (type === 'pause') {
      newStatus = 'PAUSED';
      msg = 'Match paused';
      updates = { 
        pausedAt: currentTime,
        timeline: [...match.timeline, { id: Date.now(), time: currentTime, event: 'Match paused' }] 
      };
    } else if (type === 'resume') {
      newStatus = 'LIVE';
      msg = 'Match resumed';
      updates = { 
        timeline: [...match.timeline, { id: Date.now(), time: currentTime, event: 'Match resumed' }] 
      };
    } else if (type === 'end') {
      newStatus = 'COMPLETED';
      msg = 'Match completed';
      updates = { 
        completedAt: currentTime,
        timeline: [...match.timeline, { id: Date.now(), time: currentTime, event: 'Match completed' }] 
      };
    }

    setMatch(prev => ({ ...prev, status: newStatus, ...updates }));
    setConfirmationModal({ isOpen: false, type: null });
    showToast(msg);
  };

  // Derived State
  const { filteredTeams, checkedInCount, readyCount } = useMemo(() => {
    let checkedIn = 0;
    let ready = 0;
    
    match.teams.forEach(t => {
      if (t.status === 'Checked In') checkedIn++;
      const isTeamReady = t.players.every(p => p.status === 'Ready');
      if (isTeamReady && t.status === 'Checked In') ready++;
    });

    const filtered = match.teams.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.captain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slot.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { filteredTeams: filtered, checkedInCount: checkedIn, readyCount: ready };
  }, [match.teams, searchQuery]);

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
      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${colors[status] || colors['SCHEDULED']}`}>
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

      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">
        <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <Link to={`/command-center/${tournamentId}/matches`} className="hover:text-blue-400 transition-colors">Matches</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-slate-300">Match {match.displayNumber}</span>
      </nav>

      {/* Primary Match Header */}
      <header className={`mb-8 p-6 lg:p-8 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6
        ${match.status === 'LIVE' ? 'bg-gradient-to-r from-slate-900 to-red-950/20 border-red-900/50' : 
          match.status === 'PAUSED' ? 'bg-gradient-to-r from-slate-900 to-amber-950/20 border-amber-900/50' : 
          match.status === 'COMPLETED' ? 'bg-slate-900 border-slate-800 opacity-90' :
          'bg-slate-900 border-slate-800'}`}>
        
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h1 className="text-4xl font-black text-white tracking-tight">Match {match.displayNumber}</h1>
            <StatusBadge status={match.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
            <span className="text-slate-300">{match.round}</span>
            <span>·</span>
            <span>{match.lobbyName}</span>
            <span>·</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{match.game} {match.gameMode}</span>
          </div>
          <div className="flex items-center gap-6 mt-4">
             {match.status === 'LIVE' || match.status === 'PAUSED' || match.status === 'COMPLETED' ? (
               <div className="flex items-center gap-2 text-slate-300">
                 <Clock className="w-4 h-4 text-slate-500" /> 
                 <span className="text-sm font-medium">Started {match.startedAt}</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-slate-300">
                 <Clock className="w-4 h-4 text-slate-500" /> 
                 <span className="text-sm font-medium">Scheduled {match.scheduledStart}</span>
               </div>
             )}
             {(match.status === 'COMPLETED') && (
               <div className="flex items-center gap-2 text-emerald-400">
                 <CheckCircle2 className="w-4 h-4" /> 
                 <span className="text-sm font-bold">Completed {match.completedAt}</span>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col lg:items-end w-full lg:w-auto gap-4 shrink-0">
           {match.status === 'LIVE' || match.status === 'PAUSED' || match.status === 'COMPLETED' ? (
             <div className="lg:text-right">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                 {match.status === 'COMPLETED' ? 'Total Duration' : 'Elapsed Time'}
               </p>
               <p className={`text-5xl font-mono font-black tabular-nums tracking-tight ${match.status === 'LIVE' ? 'text-white' : match.status === 'PAUSED' ? 'text-amber-500' : 'text-slate-400'}`}>
                 {match.duration}
               </p>
             </div>
           ) : (
             <div className="hidden lg:block h-[60px]"></div>
           )}

           <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {match.status === 'READY' && (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'start' })} className="flex-1 lg:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                   <Play className="w-4 h-4 fill-current" /> Start Match
                 </button>
              )}
              {match.status === 'LIVE' && (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'pause' })} className="flex-1 lg:flex-none px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                   <Pause className="w-4 h-4 fill-current" /> Pause
                 </button>
              )}
              {match.status === 'PAUSED' && (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'resume' })} className="flex-1 lg:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                   <Play className="w-4 h-4 fill-current" /> Resume
                 </button>
              )}
              {(match.status === 'LIVE' || match.status === 'PAUSED') && (
                 <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end' })} className="flex-1 lg:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                   <Square className="w-4 h-4 fill-current" /> End Match
                 </button>
              )}
              {match.status === 'COMPLETED' && (
                 <Link to={`/command-center/${tournamentId}/scoring/${match.id}`} className="flex-1 lg:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg text-center">
                   Enter Results
                 </Link>
              )}
           </div>
        </div>

      </header>

      {/* Warnings Banner */}
      {match.warnings.length > 0 && match.status !== 'COMPLETED' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-500">Attention Required</p>
              <p className="text-sm text-red-400/90">{match.warnings[0].text}</p>
            </div>
          </div>
          <Link to={`/command-center/${tournamentId}/check-in`} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shrink-0">
            Review Check-In
          </Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Lobby & Participants */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Lobby Overview Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2"><Users className="w-4 h-4" /> Lobby Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</p>
                <p className="text-2xl font-black text-white">{match.expectedTeamCount} <span className="text-sm text-slate-500 font-medium">Teams</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned</p>
                <p className="text-2xl font-black text-white">{match.teams.length} <span className="text-sm text-slate-500 font-medium">Teams</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Checked In</p>
                <p className="text-2xl font-black text-white">{checkedInCount} <span className="text-sm text-slate-500 font-medium">/ {match.expectedTeamCount}</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ready</p>
                <p className={`text-2xl font-black ${readyCount === match.expectedTeamCount ? 'text-emerald-400' : 'text-amber-400'}`}>{readyCount} <span className="text-sm text-slate-500 font-medium">/ {match.expectedTeamCount}</span></p>
              </div>
            </div>
            {readyCount === match.expectedTeamCount ? (
               <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-bold text-emerald-400 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> READY TO START
               </div>
            ) : match.status === 'COMPLETED' ? (
               <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-bold text-slate-400 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> MATCH CONCLUDED
               </div>
            ) : (
               <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-bold text-amber-500 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> WAITING FOR TEAMS
               </div>
            )}
          </div>

          {/* Participating Teams */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500">Participating Teams</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search teams or slot..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Slot</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Team</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Captain</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Check-in</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Ready</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredTeams.map(t => {
                    const isTeamReady = t.players.every(p => p.status === 'Ready');
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">{t.slot}</td>
                        <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{t.captain}</td>
                        <td className="px-6 py-4">
                          {t.status === 'Checked In' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        </td>
                        <td className="px-6 py-4">
                          {isTeamReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span className="text-sm font-bold text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${isTeamReady && t.status === 'Checked In' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isTeamReady && t.status === 'Checked In' ? 'Ready' : 'Waiting'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredTeams.length === 0 && (
                 <div className="p-8 text-center text-slate-500 text-sm">No teams found matching search.</div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-800">
               {filteredTeams.map(t => {
                  const isTeamReady = t.players.every(p => p.status === 'Ready');
                  return (
                    <div key={t.id} className="p-4 bg-slate-900">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.slot}</p>
                          <p className="font-bold text-white text-sm">{t.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Capt: {t.captain}</p>
                        </div>
                        <span className={`text-xs font-bold ${isTeamReady && t.status === 'Checked In' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isTeamReady && t.status === 'Checked In' ? 'Ready' : 'Waiting'}
                        </span>
                      </div>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>

        {/* Right Column: Timelines & Info */}
        <div className="space-y-6">
          
          {/* Room Credentials (FR-08-001) */}
          <CredentialInputForm 
            matchId={match.id} 
            tournamentId={tournamentId} 
            game={match.game}
            onCredentialSaved={(data) => {
              showToast("Credentials saved successfully");
              // Option to refresh data or trigger a timeline event
              setMatch(prev => ({
                ...prev,
                timeline: [...prev.timeline, { id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Room credentials updated' }]
              }));
            }} 
          />

          {/* Match Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2"><History className="w-4 h-4" /> Match Timeline</h3>
             <div className="space-y-6 relative">
               <div className="absolute top-2 bottom-0 left-[3px] w-px bg-slate-800"></div>
               {match.timeline.map((event, idx) => (
                 <div key={event.id} className="flex gap-4 text-sm relative z-10">
                   <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${idx === match.timeline.length - 1 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                   <div>
                     <p className="text-slate-300 font-bold text-xs leading-tight">{event.event}</p>
                     <p className="text-slate-500 font-mono text-[10px] mt-0.5">{event.time}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Staff Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-4">Match Operator</h3>
             {match.operator ? (
               <div>
                 <p className="text-sm font-bold text-white">{match.operator}</p>
                 <p className="text-xs text-slate-400">{match.operatorRole}</p>
                 <p className="text-[10px] text-slate-500 font-mono mt-2">Assigned {match.operatorAssignedAt}</p>
               </div>
             ) : (
               <div>
                 <p className="text-sm text-slate-400 mb-3">No operator assigned</p>
                 <button onClick={() => setAssignRefereeModal(true)} className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded inline-block hover:bg-blue-500/20">Assign Referee</button>
               </div>
             )}
          </div>

          {/* Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Operational Notes</h3>
               <button className="text-xs font-bold text-blue-400 hover:text-blue-300">Add Note</button>
             </div>
             {match.notes.length > 0 ? (
               <div className="space-y-3">
                 {match.notes.map(note => (
                   <div key={note.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                     <p className="text-sm text-slate-300 mb-2">{note.text}</p>
                     <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                       <span>{note.author}</span>
                       <span className="font-mono">{note.time}</span>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-slate-500">No operational notes recorded.</p>
             )}
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmationModal({ isOpen: false, type: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {confirmationModal.type === 'start' ? `Start Match ${match.displayNumber}?` : 
               confirmationModal.type === 'pause' ? 'Pause Match?' : 
               confirmationModal.type === 'resume' ? 'Resume Match?' : 
               `End Match ${match.displayNumber}?`}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {confirmationModal.type === 'start' ? 'All required teams are ready. Starting the match will begin the match timer.' : 
               confirmationModal.type === 'pause' ? 'This match will be paused. Timer will stop.' : 
               confirmationModal.type === 'resume' ? 'This match will resume operation.' : 
               'This will mark the match as completed and make it ready for result processing.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmationModal({ isOpen: false, type: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={handleAction} className={`px-4 py-2 text-white rounded-lg font-bold flex-1 ${confirmationModal.type === 'end' ? 'bg-red-600 hover:bg-red-500' : confirmationModal.type === 'pause' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                {confirmationModal.type === 'end' ? 'End Match' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Referee Modal */}
      {assignRefereeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setAssignRefereeModal(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Assign Referee</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-6 pr-2">
              {staffList.filter(s => s.staffRole === 'referee' && s.isActive).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No active referees found for this tournament.</p>
              ) : (
                staffList.filter(s => s.staffRole === 'referee' && s.isActive).map(staff => (
                  <button 
                    key={staff.staffId}
                    onClick={() => {
                      assignRefereeMutation.mutate({ tournamentId, matchId, refereeId: staff.userId }, {
                        onSuccess: () => {
                          showToast('Referee assigned successfully');
                          setAssignRefereeModal(false);
                          // For mock:
                          setMatch(prev => ({ ...prev, operator: staff.username || staff.userId, operatorRole: 'Referee', operatorAssignedAt: new Date().toLocaleTimeString() }));
                        }
                      });
                    }}
                    disabled={assignRefereeMutation.isPending}
                    className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-blue-500 hover:bg-slate-800 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {staff.avatar || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{staff.username || 'User'}</p>
                      <p className="text-xs text-slate-400">{staff.email || staff.userId}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setAssignRefereeModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Actions */}
      {(match.status === 'READY' || match.status === 'LIVE' || match.status === 'PAUSED') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 flex gap-2">
          {match.status === 'READY' && (
             <button onClick={() => setConfirmationModal({ isOpen: true, type: 'start' })} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg">Start</button>
          )}
          {match.status === 'LIVE' && (
             <>
               <button onClick={() => setConfirmationModal({ isOpen: true, type: 'pause' })} className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg">Pause</button>
               <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end' })} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg">End</button>
             </>
          )}
          {match.status === 'PAUSED' && (
             <>
               <button onClick={() => setConfirmationModal({ isOpen: true, type: 'resume' })} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg">Resume</button>
               <button onClick={() => setConfirmationModal({ isOpen: true, type: 'end' })} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg">End</button>
             </>
          )}
        </div>
      )}

    </div>
  );
}
