import React, { useState, useMemo } from 'react';
import { useTournamentLeaderboard } from '../../../../../features/tournaments/api/useTournamentDetails';
import { LeaderboardSummary } from './LeaderboardSummary';
import { LeaderboardPodium } from './LeaderboardPodium';
import { LeaderboardTable } from './LeaderboardTable';
import { LeaderboardFilters } from './LeaderboardFilters';
import { AlertTriangle, Search } from 'lucide-react';
import { Input } from '../../../../../components/ui/input';
import { useStompStore } from '../../../../../store/stompStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function TournamentLeaderboardView({ tournament }) {
  const { data: standings, isLoading, error } = useTournamentLeaderboard(tournament.slug);
  const queryClient = useQueryClient();
  const subscribe = useStompStore(state => state.subscribe);
  const unsubscribe = useStompStore(state => state.unsubscribe);

  useEffect(() => {
    // Determine tournament ID to subscribe to. If not available, use slug (though ID is better)
    let tournamentId = tournament.id || tournament.tournamentId || tournament.slug;
    if (tournamentId === 'bgmi-pro-championship' || tournamentId === 't1') {
      tournamentId = 'T-003';
    }
    const topic = `/topic/tournament.${tournamentId}.leaderboard`;
    
    subscribe(topic, (payload) => {
      if (payload.event === 'leaderboard_updated' && payload.leaderboard) {
        // Map backend DTO to frontend expected format
        const mappedLeaderboard = payload.leaderboard.map(entry => ({
          teamId: entry.teamId,
          teamSlug: entry.teamName ? entry.teamName.toLowerCase().replace(/\s+/g, '-') : entry.teamId,
          teamName: entry.teamName,
          team: entry.teamName,
          teamTag: entry.teamTag || '',
          logo: `https://ui-avatars.com/api/?name=${entry.teamName?.substring(0, 2) || 'TM'}&background=random&color=fff`,
          rank: entry.currentRank,
          prevRank: entry.previousRank,
          rankChange: entry.rankChange,
          matchesPlayed: entry.totalMatches,
          placementPoints: entry.totalPoints - entry.totalKills,
          eliminations: entry.totalKills,
          dinners: entry.chickenDinners,
          points: entry.totalPoints,
          isQualified: !entry.isEliminated,
          matchBreakdowns: entry.matchBreakdowns || []
        }));
        mappedLeaderboard.advancementSpots = payload.advancementSpots || 0;
        
        // Update the query cache with the new leaderboard array
        queryClient.setQueryData(['tournament', tournament.slug, 'leaderboard'], mappedLeaderboard);
      }
    });

    return () => {
      unsubscribe(topic);
    };
  }, [tournament, subscribe, unsubscribe, queryClient]);

  const [selectedStage, setSelectedStage] = useState('Overall');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Use roadmap stages if available, otherwise default to multi-stage roadmap
  const stages = tournament.roadmapStages 
    ? tournament.roadmapStages.map(s => s.name)
    : ['Qualifiers', 'Quarter Finals', 'Semi Finals', 'Grand Finals'];
  const groups = ['Group A', 'Group B'];
  const matches = [{ id: 'm1', number: 1 }, { id: 'm2', number: 2 }, { id: 'm3', number: 3 }, { id: 'm4', number: 4 }];

  // Filter Data
  const filteredStandings = useMemo(() => {
    if (!standings) return [];
    
    return standings.filter(team => {
      // Very basic text search filter
      if (searchQuery && team.teamName && !team.teamName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [standings, searchQuery]);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading live leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gameverse-card p-8 rounded-xl border border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to Load Leaderboard</h3>
        <p className="text-slate-400">Something went wrong while loading the official standings.</p>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="gameverse-card p-12 rounded-xl border border-white/5 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Leaderboard Coming Soon</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Official standings will appear when tournament matches begin.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wide">Live Leaderboard</h2>
            {tournament.status === 'LIVE' && (
              <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live
              </span>
            )}
            {tournament.isLeaderboardLocked ? (
              <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                Official Final Standings
              </span>
            ) : tournament.status === 'COMPLETED' ? (
              <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                Completed (Pending Official Review)
              </span>
            ) : null}
          </div>
          <p className="text-slate-400">Follow official tournament standings and live score updates.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search team..." 
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <LeaderboardSummary standings={filteredStandings} tournament={tournament} />

      {/* Podium (only show if no search filter is applied to keep it relevant to top 3) */}
      {!searchQuery && selectedStage === 'Overall' && (
        <LeaderboardPodium standings={filteredStandings} />
      )}

      <LeaderboardFilters 
        stages={stages}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        matches={matches}
        selectedMatch={selectedMatch}
        setSelectedMatch={setSelectedMatch}
      />

      {filteredStandings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No teams found matching your search.</p>
        </div>
      ) : (
        <LeaderboardTable standings={filteredStandings} config={tournament.leaderboardConfig || {}} />
      )}

    </div>
  );
}
