import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, AlertTriangle, 
  CheckCircle2, ListTodo, Lock, Edit3, X, Calculator, ShieldAlert,
  Trophy
} from 'lucide-react';
import { mockScoringMatches, mockScoringRules } from '../data/mockScoring';

export function TournamentScoringPage() {
  const { tournamentId } = useParams();
  
  // State
  const [matches] = useState(mockScoringMatches);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState('All');

  // Derived State
  const { filteredMatches, stats } = useMemo(() => {
    let awaiting = 0, scoring = 0, review = 0, scored = 0, locked = 0;

    matches.forEach(m => {
      if (m.status === 'AWAITING_RESULTS') awaiting++;
      if (m.status === 'SCORING') scoring++;
      if (m.status === 'REVIEW_REQUIRED') review++;
      if (m.status === 'SCORED') scored++;
      if (m.status === 'LOCKED') locked++;
    });

    let filtered = matches.filter(m => {
      const matchSearch = 
        m.displayNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.lobby.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.round.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchRound = roundFilter === 'All' || m.round === roundFilter;
      
      return matchSearch && matchStatus && matchRound;
    });

    // Custom Sort: REVIEW_REQUIRED > AWAITING_RESULTS > SCORING > SCORED > LOCKED
    const sortOrder = { 'REVIEW_REQUIRED': 1, 'AWAITING_RESULTS': 2, 'SCORING': 3, 'SCORED': 4, 'LOCKED': 5 };
    filtered.sort((a, b) => {
       if (sortOrder[a.status] !== sortOrder[b.status]) return sortOrder[a.status] - sortOrder[b.status];
       return a.displayNumber.localeCompare(b.displayNumber);
    });

    return {
      filteredMatches: filtered,
      stats: { awaiting, scoring, review, scored, locked, completedMatches: matches.length }
    };
  }, [matches, searchQuery, statusFilter, roundFilter]);

  const StatusBadge = ({ status }) => {
    const colors = {
      'REVIEW_REQUIRED': 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
      'AWAITING_RESULTS': 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]',
      'SCORING': 'bg-amber-500 text-amber-950',
      'SCORED': 'bg-emerald-500 text-emerald-950',
      'LOCKED': 'bg-slate-800 text-slate-400'
    };
    
    const labels = {
      'REVIEW_REQUIRED': 'Review Required',
      'AWAITING_RESULTS': 'Awaiting Results',
      'SCORING': 'Scoring in Progress',
      'SCORED': 'Scored',
      'LOCKED': 'Locked'
    };

    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max ${colors[status]}`}>
        {status === 'LOCKED' && <Lock className="w-3 h-3" />}
        {status === 'REVIEW_REQUIRED' && <AlertTriangle className="w-3 h-3" />}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative pb-32">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-slate-300">Scoring</span>
          </nav>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Scoring Panel</h1>
          <p className="text-slate-400">Manage result entry and validate placements for completed matches.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
         <div className="xl:col-span-3">
           {/* Operational Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => setStatusFilter(statusFilter === 'AWAITING_RESULTS' ? 'All' : 'AWAITING_RESULTS')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'AWAITING_RESULTS' ? 'bg-blue-950 border-blue-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Awaiting Results</p>
                 <p className={`text-2xl font-black ${stats.awaiting > 0 ? 'text-blue-500' : 'text-slate-500'}`}>{stats.awaiting}</p>
              </button>
              <button onClick={() => setStatusFilter(statusFilter === 'REVIEW_REQUIRED' ? 'All' : 'REVIEW_REQUIRED')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'REVIEW_REQUIRED' ? 'bg-red-950 border-red-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Review Required</p>
                 <p className={`text-2xl font-black ${stats.review > 0 ? 'text-red-500' : 'text-slate-500'}`}>{stats.review}</p>
              </button>
              <button onClick={() => setStatusFilter(statusFilter === 'SCORING' ? 'All' : 'SCORING')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'SCORING' ? 'bg-amber-950 border-amber-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scoring</p>
                 <p className={`text-2xl font-black ${stats.scoring > 0 ? 'text-amber-500' : 'text-slate-500'}`}>{stats.scoring}</p>
              </button>
              <button onClick={() => setStatusFilter(statusFilter === 'SCORED' ? 'All' : 'SCORED')} className={`p-4 rounded-xl border text-left transition-colors ${statusFilter === 'SCORED' ? 'bg-emerald-950 border-emerald-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scored & Locked</p>
                 <p className="text-2xl font-black text-emerald-500">{stats.scored + stats.locked} <span className="text-sm text-slate-500">/ {stats.completedMatches}</span></p>
              </button>
            </div>
         </div>
         
         <div className="xl:col-span-1">
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full flex flex-col justify-center">
                 <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4" /> Scoring Rules</h3>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-400 font-medium">Placement:</span>
                       <span className="text-slate-300">{mockScoringRules.placementPoints}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-400 font-medium">Eliminations:</span>
                       <span className="text-slate-300">{mockScoringRules.killPoints}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-400 font-medium">Bonus:</span>
                       <span className="text-slate-300">{mockScoringRules.bonus}</span>
                    </div>
                 </div>
                 <Link to={`/manage/${tournamentId}/settings`} className="mt-4 text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">View Full Rules</Link>
             </div>
         </div>
      </div>

      {/* ── FR-21-022: Scoring Queue Health Indicator ─────────────────── */}
      {(stats.awaiting + stats.review + stats.scoring) >= 2 && (
        <div className="mb-6 bg-amber-900/20 border border-amber-700/30 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <p className="font-bold text-amber-300 text-sm">
              ⚠️ Scoring Queue Backlog Detected
            </p>
            <p className="text-amber-200/70 text-xs mt-1">
              {stats.awaiting + stats.review + stats.scoring} matches are simultaneously pending scoring or review. You may fall behind — prioritize REVIEW REQUIRED items first.
            </p>
          </div>
          <Link
            to={`/command-center/${tournamentId}/scoring`}
            onClick={() => setStatusFilter('REVIEW_REQUIRED')}
            className="ml-auto shrink-0 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Review Now
          </Link>
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
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="AWAITING_RESULTS">Awaiting Results</option>
              <option value="SCORING">Scoring</option>
              <option value="SCORED">Scored</option>
              <option value="LOCKED">Locked</option>
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
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Match Queue List */}
      <h2 className="text-xl font-bold text-white tracking-tight mb-4 flex items-center gap-2"><ListTodo className="w-5 h-5 text-blue-500" /> Scoring Queue</h2>
      
      {filteredMatches.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">All caught up</h3>
          <p className="text-slate-400 text-sm mb-4">There are no matches waiting for scoring.</p>
          <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); setRoundFilter('All'); }} className="text-sm font-bold text-blue-400">Clear Filters</button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Match</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Completeness</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Preview / Warnings</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMatches.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="font-mono font-bold text-white text-lg mb-1">{m.displayNumber}</p>
                      <p className="text-sm font-medium text-slate-300">{m.round} · {m.lobby}</p>
                      <p className="text-xs text-slate-500 mt-1">{m.expectedTeams} Teams</p>
                    </td>
                    <td className="px-6 py-5 align-top pt-6">
                      <StatusBadge status={m.status} />
                      <p className="text-[10px] text-slate-500 font-mono mt-2">Updated: {m.updatedAt}</p>
                    </td>
                    <td className="px-6 py-5 align-top pt-6">
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xl font-black ${m.resultCount === m.expectedTeams ? 'text-emerald-500' : m.resultCount > 0 ? 'text-amber-500' : 'text-slate-500'}`}>{m.resultCount}</span>
                          <span className="text-sm text-slate-500">/ {m.expectedTeams}</span>
                       </div>
                       <p className="text-xs font-medium text-slate-400">Results Entered</p>
                    </td>
                    <td className="px-6 py-5 align-top max-w-sm">
                       {m.warnings && m.warnings.length > 0 ? (
                          <div className="space-y-1 bg-red-950/30 p-2 rounded border border-red-900/50">
                             {m.warnings.map((w, idx) => (
                                <p key={idx} className="text-xs font-medium text-red-400 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> {w}</p>
                             ))}
                          </div>
                       ) : m.topTeams && m.topTeams.length > 0 ? (
                          <div className="space-y-1.5">
                             {m.topTeams.map(t => (
                                <div key={t.rank} className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-2">
                                     <span className={`font-mono font-bold ${t.rank === 1 ? 'text-yellow-500' : t.rank === 2 ? 'text-slate-300' : 'text-amber-600'}`}>#{t.rank}</span>
                                     <span className="text-white">{t.name}</span>
                                   </div>
                                   <span className="font-bold text-slate-400">{t.points} pts</span>
                                </div>
                             ))}
                          </div>
                       ) : (
                          <p className="text-xs font-medium text-slate-500 italic">No preview available</p>
                       )}
                    </td>
                    <td className="px-6 py-5 align-top text-right pt-6">
                       <Link to={`/command-center/${tournamentId}/scoring/${m.id}`} className={`px-4 py-2 text-sm font-bold rounded-lg shadow-lg inline-flex items-center gap-2 transition-colors
                         ${m.status === 'AWAITING_RESULTS' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 
                           m.status === 'REVIEW_REQUIRED' ? 'bg-red-600 hover:bg-red-500 text-white' : 
                           m.status === 'LOCKED' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' :
                           'bg-slate-700 hover:bg-slate-600 text-white'}`}>
                          {m.status === 'AWAITING_RESULTS' ? (
                            <>Enter Results <Edit3 className="w-4 h-4" /></>
                          ) : m.status === 'REVIEW_REQUIRED' ? (
                            <>Review Issues <AlertTriangle className="w-4 h-4" /></>
                          ) : m.status === 'LOCKED' || m.status === 'SCORED' ? (
                            <>View Results <ChevronRight className="w-4 h-4" /></>
                          ) : (
                            <>Continue Scoring <Edit3 className="w-4 h-4" /></>
                          )}
                       </Link>
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
                     <span className="font-mono font-bold text-white text-lg">{m.displayNumber}</span>
                   </div>
                   <StatusBadge status={m.status} />
                 </div>
                 <p className="text-sm font-medium text-slate-300 mb-4">{m.round} · {m.lobby}</p>
                 
                 {m.warnings && m.warnings.length > 0 && (
                    <div className="mb-4 space-y-1 bg-red-950/30 p-2 rounded border border-red-900/50">
                       {m.warnings.map((w, idx) => (
                          <p key={idx} className="text-xs font-medium text-red-400 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> {w}</p>
                       ))}
                    </div>
                 )}

                 <div className="flex gap-2">
                    <Link to={`/command-center/${tournamentId}/scoring/${m.id}`} className={`flex-1 py-3 text-center text-sm font-bold rounded-lg shadow-lg
                         ${m.status === 'AWAITING_RESULTS' ? 'bg-blue-600 text-white' : 
                           m.status === 'REVIEW_REQUIRED' ? 'bg-red-600 text-white' : 
                           m.status === 'LOCKED' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                           'bg-slate-700 text-white'}`}>
                          {m.status === 'AWAITING_RESULTS' ? 'Enter Results' : 
                           m.status === 'REVIEW_REQUIRED' ? 'Review Issues' : 
                           m.status === 'LOCKED' || m.status === 'SCORED' ? 'View Results' : 'Continue Scoring'}
                    </Link>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

    </div>
  );
}
