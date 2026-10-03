import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, AlertTriangle, CheckCircle2, ShieldAlert,
  Save, Eye, Check, Lock, RefreshCcw, ArrowLeft,
  Trophy, Hash, Target, Search, X
} from 'lucide-react';
import { mockResultEntryMatch } from '../data/mockResultEntry';

export function TournamentResultEntryPage() {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [matchData, setMatchData] = useState(() => ({ ...mockResultEntryMatch, id: matchId }));
  const [results, setResults] = useState(matchData.teams);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: null });

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validation & Calculation Engine
  const { calculatedResults, validation, summary } = useMemo(() => {
    const calc = results.map(r => {
      // Parse inputs
      const placementStr = String(r.placement).trim();
      const killsStr = String(r.kills).trim();
      
      const placementNum = placementStr === '' ? null : Number(placementStr);
      const killsNum = killsStr === '' ? null : Number(killsStr);

      // Validate cell level
      const isPlacementValid = placementNum !== null && Number.isInteger(placementNum) && placementNum >= 1 && placementNum <= matchData.expectedTeamCount;
      const isKillsValid = killsNum !== null && Number.isInteger(killsNum) && killsNum >= 0;

      // Calculate Points
      let placementPoints = 0;
      let killPoints = 0;
      let totalPoints = 0;

      if (isPlacementValid) {
        placementPoints = matchData.scoringRules.placementPoints[placementNum] || 0;
      }
      if (isKillsValid) {
        killPoints = killsNum * matchData.scoringRules.killMultiplier;
      }

      if (isPlacementValid && isKillsValid) {
        totalPoints = placementPoints + killPoints + matchData.scoringRules.bonusPoints;
      }

      return {
        ...r,
        placementNum,
        killsNum,
        isPlacementValid,
        isKillsValid,
        isComplete: placementStr !== '' && killsStr !== '',
        placementPoints,
        killPoints,
        bonusPoints: matchData.scoringRules.bonusPoints,
        totalPoints
      };
    });

    // Global Validation
    const errors = [];
    let completeCount = 0;
    const placementCounts = {};

    calc.forEach(r => {
      if (r.isComplete) completeCount++;
      if (r.placementNum !== null) {
         placementCounts[r.placementNum] = (placementCounts[r.placementNum] || 0) + 1;
      }
    });

    const duplicates = Object.entries(placementCounts).filter(([_, count]) => count > 1).map(([p]) => p);
    if (duplicates.length > 0) {
      errors.push(`Duplicate placement detected: #${duplicates.join(', #')}`);
    }

    const missingPlacements = [];
    if (completeCount === matchData.expectedTeamCount && duplicates.length === 0) {
       for(let i=1; i<=matchData.expectedTeamCount; i++) {
          if (!placementCounts[i]) missingPlacements.push(i);
       }
    }
    if (missingPlacements.length > 0) {
      errors.push(`Missing placements: #${missingPlacements.join(', #')}`);
    }

    const hasInvalidInputs = calc.some(r => (r.placement !== '' && !r.isPlacementValid) || (r.kills !== '' && !r.isKillsValid));
    if (hasInvalidInputs) {
      errors.push(`Some inputs contain invalid numbers or negative values.`);
    }

    const isValid = completeCount === matchData.expectedTeamCount && errors.length === 0;

    // Sorting & Ranking (Only sort if valid and complete, else sort by Slot to keep input stable)
    if (isValid || matchData.status === 'LOCKED' || matchData.status === 'FINALIZED') {
      calc.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (a.placementNum !== b.placementNum) return (a.placementNum || 99) - (b.placementNum || 99);
        return (b.killsNum || 0) - (a.killsNum || 0);
      });
    } else {
      calc.sort((a, b) => a.slot.localeCompare(b.slot)); // Stable slot sort during draft editing
    }

    // Apply Display Rank
    let currentRank = 1;
    calc.forEach((r, idx) => {
      if (idx > 0) {
        const prev = calc[idx - 1];
        if (r.totalPoints === prev.totalPoints && r.placementNum === prev.placementNum && r.killsNum === prev.killsNum) {
          r.displayRank = `T-${currentRank}`;
        } else {
          currentRank = idx + 1;
          r.displayRank = currentRank;
        }
      } else {
        r.displayRank = 1;
      }
    });

    // Summary Stats
    const totalPointsAwarded = calc.reduce((acc, r) => acc + r.totalPoints, 0);
    const highestKills = [...calc].sort((a, b) => (b.killsNum || 0) - (a.killsNum || 0))[0];

    return { 
      calculatedResults: calc, 
      validation: { errors, completeCount, isValid, completionPercentage: (completeCount / matchData.expectedTeamCount) * 100 },
      summary: { winner: calc[0], highestKills, totalPointsAwarded }
    };

  }, [results, matchData]);

  // Handle Input Changes
  const handleInputChange = (teamId, field, value) => {
    if (matchData.status === 'LOCKED' || matchData.status === 'FINALIZED') return;
    setResults(prev => prev.map(r => r.teamId === teamId ? { ...r, [field]: value } : r));
    // If status was REVIEW_REQUIRED or REVIEWED, drop it back to DRAFT since edits were made
    if (matchData.status === 'REVIEW_REQUIRED' || matchData.status === 'REVIEWED') {
      setMatchData(prev => ({ ...prev, status: 'DRAFT' }));
    }
  };

  const handleAction = () => {
    const { type } = confirmationModal;
    
    if (type === 'reset') {
      setResults(matchData.teams); // Reset to initial empty state
      setMatchData(prev => ({ ...prev, status: 'DRAFT' }));
      showToast('Results reset to initial state');
    } else if (type === 'review') {
      setMatchData(prev => ({ ...prev, status: 'REVIEWED' }));
      showToast('Results marked as Reviewed');
    } else if (type === 'finalize') {
      setMatchData(prev => ({ ...prev, status: 'FINALIZED' }));
      showToast('Match Results Finalized');
    }

    setConfirmationModal({ isOpen: false, type: null });
  };

  const saveDraft = () => {
    setMatchData(prev => ({ ...prev, status: 'DRAFT' }));
    showToast('Draft saved successfully');
  };

  const StatusBadge = ({ status }) => {
    const config = {
      'AWAITING_RESULTS': { c: 'bg-blue-500 text-white', l: 'Draft' }, // Initial state treated as draft
      'DRAFT': { c: 'bg-blue-500 text-white', l: 'Draft' },
      'REVIEW_REQUIRED': { c: 'bg-amber-500 text-amber-950', l: 'Review Required' },
      'REVIEWED': { c: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50', l: 'Reviewed' },
      'FINALIZED': { c: 'bg-emerald-500 text-emerald-950', l: 'Finalized' },
      'LOCKED': { c: 'bg-slate-800 text-slate-400', l: 'Locked' }
    };
    const { c, l } = config[status] || config['DRAFT'];
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max ${c}`}>
        {status === 'LOCKED' && <Lock className="w-3 h-3" />}
        {l}
      </span>
    );
  };

  const isReadOnly = matchData.status === 'FINALIZED' || matchData.status === 'LOCKED';

  // Filtering for UI Search
  const displayResults = calculatedResults.filter(r => 
    r.teamName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.captain.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Link to={`/command-center/${tournamentId}/scoring`} className="hover:text-blue-400 transition-colors">Scoring</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-slate-300">Match {matchData.displayNumber}</span>
      </nav>

      {/* Primary Header */}
      <header className="mb-6 p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h1 className="text-4xl font-black text-white tracking-tight">Match {matchData.displayNumber}</h1>
            <StatusBadge status={matchData.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
            <span className="text-slate-300">{matchData.round}</span>
            <span>·</span>
            <span>{matchData.lobbyName}</span>
            <span>·</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{matchData.game} {matchData.gameMode}</span>
          </div>
        </div>
        <div className="lg:text-right">
           <p className="text-sm font-medium text-slate-400 mb-1">Result Completion</p>
           <p className="text-2xl font-black text-white">{validation.completeCount} <span className="text-slate-500 text-lg">/ {matchData.expectedTeamCount} Teams</span></p>
        </div>
      </header>

      {/* Completion & Validation Banner */}
      <div className="mb-8">
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
           <div 
             className={`h-full transition-all duration-500 ${validation.isValid ? 'bg-emerald-500' : 'bg-blue-500'}`} 
             style={{ width: `${validation.completionPercentage}%` }}>
           </div>
        </div>
        
        {validation.errors.length > 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-500 mb-1">Validation Errors</p>
              <ul className="list-disc list-inside text-sm text-red-400/90 space-y-1">
                {validation.errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          </div>
        ) : validation.completeCount < matchData.expectedTeamCount ? (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-500 mb-1">{matchData.expectedTeamCount - validation.completeCount} Results Missing</p>
              <p className="text-sm text-amber-400/90">Please enter placement and kill data for all teams.</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-500 mb-1">Results Complete & Valid</p>
              <p className="text-sm text-emerald-400/90">Ready for review and finalization.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left: Main Table */}
        <div className="xl:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
               <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500">Team Results</h3>
               <div className="relative w-full sm:w-64 hidden sm:block">
                  <Search className="absolute left-3 top-2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search teams..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500" 
                  />
               </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase w-16 text-center">Rank</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Team</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase w-24">Placement</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase w-24">Kills</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase w-20 text-center">Place Pts</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase w-20 text-center">Kill Pts</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-blue-400 uppercase w-24 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayResults.map(r => (
                    <tr key={r.teamId} className={`hover:bg-slate-800/50 transition-colors ${(r.placement !== '' && !r.isPlacementValid) || (r.kills !== '' && !r.isKillsValid) ? 'bg-red-950/10' : ''}`}>
                      <td className="px-4 py-3 text-center">
                         {validation.isValid || isReadOnly ? (
                            <span className={`font-mono font-black ${r.displayRank === 1 ? 'text-yellow-500 text-lg' : r.displayRank === 2 ? 'text-slate-300 text-lg' : r.displayRank === 3 ? 'text-amber-600 text-lg' : 'text-slate-500'}`}>
                              {r.displayRank}
                            </span>
                         ) : (
                            <span className="text-slate-600 font-mono text-xs">—</span>
                         )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-white text-sm leading-tight">{r.teamName}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{r.slot}</p>
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number"
                          min="1"
                          max={matchData.expectedTeamCount}
                          value={r.placement}
                          onChange={(e) => handleInputChange(r.teamId, 'placement', e.target.value)}
                          disabled={isReadOnly}
                          className={`w-full px-3 py-1.5 bg-slate-950 border rounded text-white font-mono text-sm text-center focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:border-slate-800
                            ${r.placement !== '' && !r.isPlacementValid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'}`}
                          placeholder="—"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number"
                          min="0"
                          value={r.kills}
                          onChange={(e) => handleInputChange(r.teamId, 'kills', e.target.value)}
                          disabled={isReadOnly}
                          className={`w-full px-3 py-1.5 bg-slate-950 border rounded text-white font-mono text-sm text-center focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:border-slate-800
                            ${r.kills !== '' && !r.isKillsValid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'}`}
                          placeholder="—"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-mono text-slate-400">{r.isComplete && r.isPlacementValid ? r.placementPoints : '—'}</td>
                      <td className="px-4 py-3 text-center text-sm font-mono text-slate-400">{r.isComplete && r.isKillsValid ? r.killPoints : '—'}</td>
                      <td className="px-4 py-3 text-center">
                         <span className={`font-mono font-black text-lg ${r.isComplete && r.isPlacementValid && r.isKillsValid ? 'text-blue-400' : 'text-slate-600'}`}>
                           {r.isComplete && r.isPlacementValid && r.isKillsValid ? r.totalPoints : '—'}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-800">
               {displayResults.map(r => (
                 <div key={r.teamId} className="p-4 bg-slate-900">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-white text-base leading-tight">{r.teamName}</p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{r.slot}</p>
                      </div>
                      {(validation.isValid || isReadOnly) && (
                         <span className={`font-mono font-black text-2xl ${r.displayRank === 1 ? 'text-yellow-500' : r.displayRank === 2 ? 'text-slate-300' : r.displayRank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                           #{r.displayRank}
                         </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Placement</label>
                        <input 
                          type="number" min="1" max={matchData.expectedTeamCount} value={r.placement}
                          onChange={(e) => handleInputChange(r.teamId, 'placement', e.target.value)}
                          disabled={isReadOnly}
                          className={`w-full px-3 py-2 bg-slate-950 border rounded text-white font-mono text-center disabled:opacity-50 ${r.placement !== '' && !r.isPlacementValid ? 'border-red-500' : 'border-slate-700'}`}
                          placeholder="—"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kills</label>
                        <input 
                          type="number" min="0" value={r.kills}
                          onChange={(e) => handleInputChange(r.teamId, 'kills', e.target.value)}
                          disabled={isReadOnly}
                          className={`w-full px-3 py-2 bg-slate-950 border rounded text-white font-mono text-center disabled:opacity-50 ${r.kills !== '' && !r.isKillsValid ? 'border-red-500' : 'border-slate-700'}`}
                          placeholder="—"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-slate-800">
                       <div className="flex gap-4">
                         <div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase">Place Pts</p>
                           <p className="text-sm font-mono text-slate-300">{r.isComplete && r.isPlacementValid ? r.placementPoints : '—'}</p>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase">Kill Pts</p>
                           <p className="text-sm font-mono text-slate-300">{r.isComplete && r.isKillsValid ? r.killPoints : '—'}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Total</p>
                         <p className={`font-mono font-black text-2xl leading-none ${r.isComplete && r.isPlacementValid && r.isKillsValid ? 'text-blue-400' : 'text-slate-600'}`}>
                           {r.isComplete && r.isPlacementValid && r.isKillsValid ? r.totalPoints : '—'}
                         </p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Summaries & Rules */}
        <div className="space-y-6">
          
          {/* Match Summary Panel */}
          {validation.isValid && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-6">Match Summary</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1"><Trophy className="w-3 h-3 text-yellow-500" /> Winner</p>
                  <p className="text-lg font-bold text-white">{summary.winner?.teamName}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{summary.winner?.totalPoints} Total Points</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1"><Target className="w-3 h-3 text-red-500" /> Highest Kills</p>
                  <p className="text-sm font-bold text-white">{summary.highestKills?.teamName} <span className="text-red-400 font-mono ml-2">{summary.highestKills?.killsNum} Kills</span></p>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Points Awarded</p>
                  <p className="text-2xl font-mono font-black text-blue-400">{summary.totalPointsAwarded}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scoring Rules Context */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-500 mb-4">Scoring Rules</h3>
             <div className="space-y-4">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Placement Points</p>
                 <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950 p-2 border border-slate-800 rounded text-slate-300">1st: 15pts</div>
                    <div className="bg-slate-950 p-2 border border-slate-800 rounded text-slate-300">2nd: 12pts</div>
                    <div className="bg-slate-950 p-2 border border-slate-800 rounded text-slate-300">3rd: 10pts</div>
                    <div className="bg-slate-950 p-2 border border-slate-800 rounded text-slate-300">4th: 8pts</div>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2 italic">See full rules in tournament settings.</p>
               </div>
               <div className="pt-4 border-t border-slate-800">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Elimination Points</p>
                 <p className="text-sm text-white font-medium">{matchData.scoringRules.killMultiplier} point / elimination</p>
               </div>
               <div className="pt-4 border-t border-slate-800">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bonus Points</p>
                 <p className="text-sm text-slate-400">{matchData.scoringRules.bonusPoints === 0 ? 'None' : matchData.scoringRules.bonusPoints}</p>
               </div>
             </div>
          </div>
        </div>

      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
             <Link to={`/command-center/${tournamentId}/scoring`} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
               <ArrowLeft className="w-4 h-4" /> Back
             </Link>
             {!isReadOnly && (
               <button onClick={() => setConfirmationModal({ isOpen: true, type: 'reset' })} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                 <RefreshCcw className="w-4 h-4" /> Reset
               </button>
             )}
           </div>

           <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
             {isReadOnly ? (
               <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                 <span className="text-sm font-bold text-slate-400 flex items-center gap-2 mr-4"><Lock className="w-4 h-4" /> Results Locked</span>
                 <Link to={`/command-center/${tournamentId}/leaderboard`} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex-1 sm:flex-none text-center">
                   View Leaderboard
                 </Link>
               </div>
             ) : (
               <>
                 <button onClick={saveDraft} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors">
                   <Save className="w-4 h-4" /> Save Draft
                 </button>
                 
                 {matchData.status === 'DRAFT' || matchData.status === 'AWAITING_RESULTS' ? (
                   <button 
                     onClick={() => setConfirmationModal({ isOpen: true, type: 'review' })} 
                     disabled={!validation.isValid}
                     className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
                   >
                     <Eye className="w-4 h-4" /> Ready for Review
                   </button>
                 ) : (
                   <button 
                     onClick={() => setConfirmationModal({ isOpen: true, type: 'finalize' })} 
                     disabled={!validation.isValid}
                     className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
                   >
                     <Check className="w-4 h-4" /> Finalize Result
                   </button>
                 )}
               </>
             )}
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmationModal({ isOpen: false, type: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            
            {confirmationModal.type === 'reset' && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Reset match results?</h3>
                <p className="text-sm text-slate-400 mb-6">All current edits on this screen will be discarded and reset to blank.</p>
              </>
            )}

            {confirmationModal.type === 'review' && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Ready for Review?</h3>
                <p className="text-sm text-slate-400 mb-6">All results are complete and valid. This marks the match for final review by administrators.</p>
              </>
            )}

            {confirmationModal.type === 'finalize' && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Finalize Match Result?</h3>
                <p className="text-sm text-slate-400 mb-4">This will mark the current result as final and lock the match.</p>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-left mb-6">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Winner</p>
                  <p className="text-sm font-bold text-white mb-3">{summary.winner?.teamName}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Points</p>
                  <p className="text-sm font-bold text-white">{summary.totalPointsAwarded}</p>
                </div>
              </>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmationModal({ isOpen: false, type: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={handleAction} className={`px-4 py-2 text-white rounded-lg font-bold flex-1 ${confirmationModal.type === 'reset' ? 'bg-red-600 hover:bg-red-500' : confirmationModal.type === 'finalize' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {confirmationModal.type === 'reset' ? 'Reset Results' : confirmationModal.type === 'finalize' ? 'Finalize Result' : 'Mark Ready'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
