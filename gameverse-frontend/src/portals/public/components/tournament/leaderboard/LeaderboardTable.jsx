import React, { useState } from 'react';
import { Minus, ArrowUp, ArrowDown, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LeaderboardTable({ standings, leaderboard, config }) {
  let data = standings || leaderboard;

  const showKills = config?.showKills ?? true;
  const showChickenDinners = config?.showChickenDinners ?? true;
  const showMatchesPlayed = config?.showMatchesPlayed ?? true;
  const showDamage = config?.showDamage ?? false;
  const topNDisplayMode = config?.topNDisplayMode ?? 0;

  if (data && topNDisplayMode > 0) {
    data = data.slice(0, topNDisplayMode);
  }
  const [expandedRows, setExpandedRows] = useState(new Set());

  if (!data || data.length === 0) return null;

  const advancementSpots = data.advancementSpots || 0;

  const toggleRow = (teamId) => {
    const next = new Set(expandedRows);
    if (next.has(teamId)) {
      next.delete(teamId);
    } else {
      next.add(teamId);
    }
    setExpandedRows(next);
  };

  return (
    <div className="gameverse-card rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#0b1b36]/50 border-b border-white/5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <th className="p-4 w-12 text-center"></th>
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4 w-12 text-center">+/-</th>
              <th className="p-4">Team</th>
              {showMatchesPlayed && <th className="p-4 text-center">Matches</th>}
              <th className="p-4 text-center">Placement</th>
              {showKills && <th className="p-4 text-center">Elims</th>}
              {showChickenDinners && <th className="p-4 text-center">WWCD</th>}
              {showDamage && <th className="p-4 text-center">Damage</th>}
              <th className="p-4 text-right text-white">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((team, idx) => {
              const rankDiff = team.prevRank ? team.prevRank - team.rank : 0;
              const isTop3 = team.rank <= 3;
              const isExpanded = expandedRows.has(team.teamId);
              
              let rowStyle = '';
              let isQualified = team.isQualified;
              let isBubble = false;
              let isCutoff = false;
              
              if (advancementSpots > 0) {
                isQualified = team.rank <= advancementSpots;
                isBubble = team.rank > advancementSpots && team.rank <= advancementSpots + 3;
                isCutoff = team.rank === advancementSpots;
                
                if (isQualified) {
                  rowStyle = 'bg-emerald-900/10';
                } else if (isBubble) {
                  rowStyle = 'bg-yellow-900/10';
                }
              } else if (team.isQualified) {
                rowStyle = 'bg-emerald-900/10';
              }
              
              return (
                <React.Fragment key={team.teamSlug || team.teamId || idx}>
                  <tr 
                    className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${rowStyle} ${isCutoff ? 'border-b-2 border-b-emerald-500/50' : ''}`}
                    onClick={() => toggleRow(team.teamId)}
                  >
                    <td className="p-4 text-center text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-display font-bold text-lg ${isTop3 ? 'text-yellow-400' : 'text-slate-300'}`}>
                        #{team.rank}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {rankDiff > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
                          <ArrowUp className="w-3 h-3" /> {rankDiff}
                        </div>
                      ) : rankDiff < 0 ? (
                        <div className="flex items-center justify-center gap-1 text-red-400 text-xs font-bold">
                          <ArrowDown className="w-3 h-3" /> {Math.abs(rankDiff)}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-slate-500">
                          <Minus className="w-3 h-3" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded bg-white/10 overflow-hidden shrink-0 group-hover:ring-2 ring-blue-500 transition-all">
                          <img src={team.logo} alt={team.team} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            {team.teamTag && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
                                {team.teamTag}
                              </span>
                            )}
                            {team.teamSlug ? (
                              <Link to={`/teams/${team.teamSlug}`} className="font-bold text-white hover:text-blue-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                                {team.teamName || team.team}
                              </Link>
                            ) : (
                              <span className="font-bold text-white">{team.teamName || team.team}</span>
                            )}
                          </div>
                          {isQualified && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Qualified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {showMatchesPlayed && <td className="p-4 text-center text-slate-300 font-medium">{team.matchesPlayed}</td>}
                    <td className="p-4 text-center text-slate-300 font-medium">{team.placementPoints}</td>
                    {showKills && <td className="p-4 text-center text-slate-300 font-medium">{team.eliminations}</td>}
                    {showChickenDinners && <td className="p-4 text-center text-yellow-400 font-bold">{team.dinners > 0 ? team.dinners : '-'}</td>}
                    {showDamage && <td className="p-4 text-center text-slate-300 font-medium">{team.totalDamage || 0}</td>}
                    <td className="p-4 text-right">
                      <span className="font-display font-bold text-xl text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.3)]">
                        {team.points}
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={`bg-black/40 ${isCutoff ? 'border-b-2 border-b-emerald-500/50' : ''}`}>
                      <td colSpan={9} className="p-4 border-b border-white/5">
                        <div className="rounded-lg border border-white/10 bg-[#0f172a] p-4 mx-4">
                          <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Per-Match Breakdown</h4>
                          {team.matchBreakdowns && team.matchBreakdowns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                              {team.matchBreakdowns.map((match) => (
                                <div key={match.matchId} className="flex flex-col bg-white/5 rounded border border-white/5 p-3 hover:bg-white/10 transition-colors">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match {match.matchNumber}</span>
                                    <span className="text-xs font-bold text-blue-400">+{match.pointsEarned} pts</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Place: <span className="text-white font-bold">#{match.placement}</span></span>
                                    <span className="text-sm text-slate-300"><span className="text-white font-bold">{match.kills}</span> Elims</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No matches played yet.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {advancementSpots > 0 ? (
        <div className="p-3 bg-emerald-900/20 border-t border-emerald-500/20 text-xs text-emerald-400 text-center uppercase tracking-wider font-bold">
          Top {advancementSpots} Teams Qualify
        </div>
      ) : (
        <div className="p-3 bg-white/5 border-t border-white/5 text-xs text-slate-400 text-center uppercase tracking-wider font-semibold">
          Final Standings Pending Official Verification
        </div>
      )}
    </div>
  );
}
