import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, AlertTriangle, 
  CheckCircle2, Edit3, ShieldAlert, Trophy, Target, Clock, AlertCircle, ChevronDown, ChevronUp, Lock, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTournamentConfig } from '../data/mockLeaderboard';
import { LeaderboardSimulatorPanel } from '../components/LeaderboardSimulatorPanel';
import { useTournamentLeaderboard } from '../../tournaments/api/useTournamentDetails';

export function TournamentLeaderboardPage() {
  const { tournamentId } = useParams();
  const { data: realEntries = [], isLoading } = useTournamentLeaderboard(tournamentId);
  
  // State
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (realEntries.length > 0) {
      setEntries(realEntries);
    }
  }, [realEntries]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState('All');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isLocked, setIsLocked] = useState(false);
  
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedData, setSimulatedData] = useState(null);

  // Derived State
  const { filteredEntries, stats } = useMemo(() => {
    const dataToUse = simulatedData || entries;
    let filtered = dataToUse.filter(e => {
      const matchSearch = 
        e.teamName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.teamTag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Advancing' ? e.isAdvancing :
        statusFilter === 'Eliminated' ? e.isEliminated :
        statusFilter === 'Disqualified' ? e.isDisqualified :
        statusFilter === 'Disputed' ? e.disputeFlag :
        statusFilter === 'Corrected' ? e.manualCorrectionFlag : true;
        
      const matchGroup = groupFilter === 'All' ? true : e.group === groupFilter;
      
      return matchSearch && matchStatus && matchGroup;
    });

    if (roundFilter !== 'All') {
      filtered = filtered.map(e => ({
        ...e,
        matchBreakdown: e.matchBreakdown ? e.matchBreakdown.filter(m => m.round === roundFilter) : []
      }));
    }

    // Sort by rank ascending. DQs at the bottom.
    filtered.sort((a, b) => {
      if (a.isDisqualified && !b.isDisqualified) return 1;
      if (!a.isDisqualified && b.isDisqualified) return -1;
      return a.rank - b.rank;
    });

    const activeDisputes = dataToUse.filter(e => e.disputeFlag).length;
    const leader = dataToUse.find(e => e.rank === 1)?.teamName || 'N/A';
    const maxScore = dataToUse.length > 0 ? Math.max(...dataToUse.map(e => e.totalPoints)) : 0;
    
    return {
      filteredEntries: filtered,
      stats: {
        teams: dataToUse.length,
        disputes: activeDisputes,
        leader,
        maxScore
      }
    };
  }, [entries, simulatedData, searchQuery, statusFilter, groupFilter]);

  const simulateUpdate = () => {
    // DEV: Randomly swap top 2 teams and update points
    const newEntries = [...entries];
    if (newEntries.length >= 2) {
      const t1 = newEntries.find(e => e.rank === 1);
      const t2 = newEntries.find(e => e.rank === 2);
      
      if (t1 && t2) {
        t1.previousRank = 1;
        t2.previousRank = 2;
        
        // Swap
        t1.rank = 2;
        t2.rank = 1;
        t2.totalPoints += 5;
        
        t1.movement = t1.previousRank - t1.rank;
        t2.movement = t2.previousRank - t2.rank;
      }
    }
    setEntries(newEntries);
    setLastUpdated(newEntries.length % 2 === 0 ? new Date().toLocaleTimeString() : new Date().toLocaleTimeString()); // Trigger render
  };

  const MovementIndicator = ({ movement }) => {
    if (movement > 0) return <span className="text-emerald-500 font-bold flex items-center text-sm" aria-label={`Moved up ${movement} positions`}><ChevronUp className="w-4 h-4 mr-0.5" />{movement}</span>;
    if (movement < 0) return <span className="text-red-500 font-bold flex items-center text-sm" aria-label={`Moved down ${Math.abs(movement)} positions`}><ChevronDown className="w-4 h-4 mr-0.5" />{Math.abs(movement)}</span>;
    return <span className="text-slate-500 font-bold flex items-center text-sm px-1.5" aria-label="No movement">—</span>;
  };

  const StatusFlags = ({ entry }) => {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        {entry.isDisqualified && (
           <span className="px-2 py-1 rounded bg-red-950 border border-red-900 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-3 h-3" /> DQ</span>
        )}
        {entry.disputeFlag && (
           <span className="px-2 py-1 rounded bg-amber-950 border border-amber-900 text-amber-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Dispute</span>
        )}
        {entry.manualCorrectionFlag && (
           <span className="px-2 py-1 rounded bg-blue-950 border border-blue-900 text-blue-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" title="This team's score contains a manual correction."><Edit3 className="w-3 h-3" /> Corrected</span>
        )}
        {entry.isAdvancing && !entry.isDisqualified && (
           <span className="px-2 py-1 rounded bg-emerald-950/50 border border-emerald-900/50 text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Advancing</span>
        )}
        {entry.isEliminated && !entry.isDisqualified && (
           <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Eliminated</span>
        )}
      </div>
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
            <span className="text-slate-300">Leaderboard</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white tracking-tight">{mockTournamentConfig.name}</h1>
            {simulatedData && (
              <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                Simulation Mode
              </span>
            )}
          </div>
          <p className="text-slate-400">Live Tournament Standings · {mockTournamentConfig.stage} · {mockTournamentConfig.currentRound}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           {isLocked ? (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold text-sm">
                <Lock className="w-4 h-4" />
                Leaderboard Locked
             </div>
           ) : (
             <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-red-500 tracking-widest text-sm uppercase">Live</span>
             </div>
           )}
           <p className="text-xs text-slate-400 font-mono">Last updated: {lastUpdated} <span className="opacity-50">(Just now)</span></p>
           
           <div className="flex gap-2 mt-2">
             <button 
               onClick={() => setShowSimulator(!showSimulator)} 
               className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded transition-colors ${showSimulator ? 'bg-indigo-600 text-white' : 'text-indigo-400 border border-indigo-900/50 bg-indigo-950/20 hover:bg-indigo-900/50'}`}
             >
               <Play className="w-3.5 h-3.5" />
               Simulator
             </button>
             {!isLocked && (
               <button onClick={simulateUpdate} className="text-[10px] font-bold text-blue-400 border border-blue-900/50 bg-blue-950/20 px-2 py-1.5 rounded hover:bg-blue-900/50 transition-colors">
                 [DEV] Update
               </button>
             )}
           </div>
        </div>
      </header>

      <AnimatePresence>
        {showSimulator && (
          <LeaderboardSimulatorPanel 
            tournamentId={tournamentId}
            teams={entries}
            onSimulate={(data) => setSimulatedData(data)}
            isSimulating={!!simulatedData}
            onClose={() => {
              setShowSimulator(false);
              setSimulatedData(null);
            }}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Teams</p>
           <p className="text-2xl font-black text-white">{stats.teams}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Matches</p>
           <p className="text-2xl font-black text-white">4 <span className="text-sm text-slate-500">/ 12</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Leader</p>
           <p className="text-lg font-black text-emerald-400 truncate">{stats.leader}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Top Score</p>
           <p className="text-2xl font-black text-white">{stats.maxScore} pts</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Disputes</p>
           <p className={`text-2xl font-black ${stats.disputes > 0 ? 'text-amber-500' : 'text-slate-500'}`}>{stats.disputes}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search team name or tag..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select 
              value={groupFilter}
              onChange={e => setGroupFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Groups</option>
              {mockTournamentConfig.groups.map(g => <option key={g} value={g}>{g}</option>)}
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
              {mockTournamentConfig.rounds.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Advancing">Advancing</option>
              <option value="Eliminated">Eliminated</option>
              <option value="Disqualified">Disqualified</option>
              <option value="Disputed">Disputed</option>
              <option value="Corrected">Manual Correction</option>
            </select>
            <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      {filteredEntries.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No leaderboard data found</h3>
          <p className="text-slate-400 text-sm mb-4">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 border-b border-slate-800 sticky top-0 z-20">
                <tr>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-16 text-center">Rank</th>
                  <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-16 text-center">Move</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase min-w-[150px] sm:min-w-[200px]">Team</th>
                  <th className="hidden md:table-cell px-4 py-4 text-xs font-bold text-slate-500 uppercase text-right w-24">Matches</th>
                  <th className="hidden lg:table-cell px-4 py-4 text-xs font-bold text-slate-500 uppercase text-right w-24">Chicken</th>
                  <th className="hidden md:table-cell px-4 py-4 text-xs font-bold text-slate-500 uppercase text-right w-24">Kills</th>
                  <th className="px-4 py-4 text-xs font-bold text-white uppercase text-right w-24">Points</th>
                  <th className="hidden sm:table-cell px-4 py-4 text-xs font-bold text-slate-500 uppercase min-w-[150px] lg:min-w-[200px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 relative">
                <AnimatePresence>
                  {filteredEntries.map((entry, index) => {
                    const isCutoff = index === mockTournamentConfig.advancementCutoff - 1;
                    const isExpanded = expandedTeamId === entry.teamId;
                    
                    return (
                      <React.Fragment key={entry.teamId}>
                        <motion.tr 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setExpandedTeamId(isExpanded ? null : entry.teamId)}
                          className={`group cursor-pointer transition-colors hover:bg-slate-800/60 ${isExpanded ? 'bg-slate-800/30' : ''} ${entry.isDisqualified ? 'opacity-60' : ''}`}
                        >
                          <td className="px-4 py-4 text-center">
                            {entry.isDisqualified ? (
                              <span className="text-slate-600 font-bold text-sm">—</span>
                            ) : (
                              <span className={`font-mono font-bold text-lg ${entry.rank <= 3 ? 'text-white' : 'text-slate-400'}`}>
                                #{entry.rank}
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-4 text-center">
                            <MovementIndicator movement={entry.movement} />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                               {entry.logo ? (
                                  <img src={entry.logo} alt={entry.teamName} className="w-8 h-8 rounded bg-slate-800" />
                               ) : (
                                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                     {entry.teamTag}
                                  </div>
                               )}
                               <div>
                                  <p className={`font-bold ${entry.isDisqualified ? 'text-slate-400 line-through' : 'text-white'} flex items-center gap-2`}>
                                     {entry.teamName}
                                  </p>
                                  <p className="text-xs text-slate-500">{entry.teamTag} · {entry.group}</p>
                               </div>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-4 py-4 text-right font-medium text-slate-300">
                            {entry.matchesPlayed === 0 ? <span className="text-slate-600">0</span> : entry.matchesPlayed}
                          </td>
                          <td className="hidden lg:table-cell px-4 py-4 text-right font-medium text-amber-500/70">
                            {entry.chickenDinners > 0 ? entry.chickenDinners : <span className="text-slate-700">-</span>}
                          </td>
                          <td className="hidden md:table-cell px-4 py-4 text-right font-medium text-slate-300">
                            {entry.totalKills}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {entry.matchesPlayed === 0 ? (
                              <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded">Upcoming</span>
                            ) : (
                              <span className={`font-mono font-bold text-lg ${entry.isDisqualified ? 'text-slate-500' : 'text-blue-400'}`}>
                                {entry.totalPoints}
                              </span>
                            )}
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4">
                             <StatusFlags entry={entry} />
                          </td>
                        </motion.tr>
                        
                        {/* Expanded Match Breakdown Inline */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-slate-950 border-b-2 border-slate-800 overflow-hidden"
                            >
                              <td colSpan={8} className="p-0">
                                <div className="px-8 py-6 border-l-2 border-blue-500 ml-4 my-2 rounded-r-xl bg-slate-900/50">
                                   <div className="flex justify-between items-center mb-4">
                                      <h4 className="font-bold text-white flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" /> Match Breakdown</h4>
                                      <button onClick={() => setExpandedTeamId(null)} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider">Close</button>
                                   </div>
                                   
                                   {entry.matchBreakdown.length > 0 ? (
                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {entry.matchBreakdown.map((mb, idx) => (
                                           <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                                              <div className="flex justify-between items-start mb-2">
                                                 <p className="text-xs font-bold text-slate-400 uppercase">{mb.round}</p>
                                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${mb.placement === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-300'}`}>
                                                   #{mb.placement}
                                                 </span>
                                              </div>
                                              <div className="flex justify-between items-end mt-4">
                                                 <div>
                                                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Kills</p>
                                                   <p className="font-bold text-slate-300">{mb.kills}</p>
                                                 </div>
                                                 <div className="text-right">
                                                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Points</p>
                                                   <p className="font-black text-blue-400 text-lg leading-none">{mb.points}</p>
                                                 </div>
                                              </div>
                                           </div>
                                        ))}
                                     </div>
                                   ) : (
                                     <p className="text-sm text-slate-500 italic">No matches played yet.</p>
                                   )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>

                        {/* Advancement Line Indicator */}
                        {isCutoff && statusFilter === 'All' && !searchQuery && (
                          <motion.tr layout className="bg-blue-950/10">
                            <td colSpan={8} className="p-0">
                               <div className="flex items-center w-full relative h-6 my-1">
                                  <div className="absolute inset-0 flex items-center">
                                     <div className="w-full border-t border-blue-500/30 border-dashed"></div>
                                  </div>
                                  <div className="relative flex justify-center w-full">
                                     <span className="bg-slate-900 px-3 text-[10px] font-bold text-blue-400 uppercase tracking-widest border border-blue-900/50 rounded-full">
                                        Advancement Cutoff — Top {mockTournamentConfig.advancementCutoff} Advance
                                     </span>
                                  </div>
                               </div>
                            </td>
                          </motion.tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
