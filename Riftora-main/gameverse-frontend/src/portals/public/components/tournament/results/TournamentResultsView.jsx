import React, { useState } from 'react';
import { useTournamentResults, useTournamentLeaderboard } from '../../../../../features/tournaments/api/useTournamentDetails';
import { MatchResultsList } from './MatchResultsList';
import { TournamentChampion } from './TournamentChampion';
import { LeaderboardPodium } from '../leaderboard/LeaderboardPodium';
import { LeaderboardTable } from '../leaderboard/LeaderboardTable';
import { LeaderboardFilters } from '../leaderboard/LeaderboardFilters';
import { Trophy, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';

export function TournamentResultsView({ tournament }) {
  const [filters, setFilters] = useState({
    stage: 'All Stages',
    group: 'All Groups',
    match: 'All Matches'
  });

  // Mock checking if tournament has final standings
  // For LIVE, we just show completed matches. For COMPLETED, we show the whole page.
  const isCompleted = tournament?.status === 'COMPLETED';
  const isUpcoming = tournament?.status === 'UPCOMING';

  const { data: results, isLoading: resultsLoading } = useTournamentResults(tournament?.slug);
  const { data: finalStandings, isLoading: standingsLoading } = useTournamentLeaderboard(tournament?.slug); // Reusing leaderboard hook for final standings in this mock

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isUpcoming) {
    return (
      <div className="w-full mx-auto py-8">
        <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center">
          <Trophy className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Results Coming Soon</h3>
          <p className="text-slate-400 max-w-md mb-6">
            Official match results will appear here after matches are completed. Check the schedule to see when the action begins.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={`/t/${tournament?.slug}/schedule`}>
              View Schedule
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (resultsLoading || standingsLoading) {
    return (
      <div className="w-full mx-auto py-8 space-y-8 animate-pulse">
        <div className="h-64 bg-slate-800/50 rounded-xl" />
        <div className="h-32 bg-slate-800/50 rounded-xl" />
        <div className="h-96 bg-slate-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8">
      
      {/* Live Warning */}
      {!isCompleted && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h4 className="text-red-400 font-bold text-sm tracking-wide">🔴 TOURNAMENT LIVE</h4>
              <p className="text-slate-300 text-sm">Results from completed matches are available below. Live standings may continue to change.</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0">
            <Link to={`/t/${tournament?.slug}/leaderboard`}>
              View Live Leaderboard
            </Link>
          </Button>
        </div>
      )}

      {/* Completed State Components */}
      {isCompleted && (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Tournament Complete</h2>
          </div>
          
          <TournamentChampion champion={results?.champion} />

          {finalStandings && finalStandings.length >= 3 && (
            <div className="mb-12">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Final Podium
              </h3>
              <LeaderboardPodium leaderboard={finalStandings} />
            </div>
          )}

          {finalStandings && (
            <div className="mb-12">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Final Standings
              </h3>
              <LeaderboardTable leaderboard={finalStandings} />
            </div>
          )}
        </>
      )}

      {/* Match Results Section (Shown for both LIVE and COMPLETED) */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
            Match Results
          </h3>
          <p className="text-slate-400 text-sm mt-1">Official historical results from completed matches.</p>
        </div>
        
        <LeaderboardFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <MatchResultsList matches={results?.matches} />

    </div>
  );
}
