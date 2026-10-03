import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { 
  exploreTournamentTeams, 
  exploreTournamentSchedule, 
  exploreTournamentRules,
  exploreTournamentPrizes,
  exploreTournamentResults
} from '../../../services/mockData';

export function useTournamentTeams(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'teams'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return exploreTournamentTeams[tournamentSlug] || [];
    },
    enabled: !!tournamentSlug
  });
}

export function useTournamentSchedule(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'schedule'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return exploreTournamentSchedule[tournamentSlug] || [];
    },
    enabled: !!tournamentSlug
  });
}

export function useTournamentLeaderboard(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'leaderboard'],
    queryFn: async () => {
      const id = tournamentSlug === 'bgmi-pro-championship' || tournamentSlug === 't1' ? 'T-003' : tournamentSlug;
      const response = await api.get(`/tournaments/${id}/leaderboard`);
      // The backend returns { status, data: { tournamentId, entries: [...] } }
      // The API response wrapper is handled by response.data.data.entries
      // Wait, let's just return response.data.data.entries if it exists, otherwise empty array.
      if (response.data && response.data.data && response.data.data.entries) {
        const arr = response.data.data.entries.map(entry => ({
          teamId: entry.teamId,
          teamSlug: entry.teamName ? entry.teamName.toLowerCase().replace(/\s+/g, '-') : entry.teamId,
          teamName: entry.teamName,
          team: entry.teamName, // legacy support
          teamTag: entry.teamTag || '',
          logo: `https://ui-avatars.com/api/?name=${entry.teamName?.substring(0, 2) || 'TM'}&background=random&color=fff`,
          rank: entry.currentRank,
          prevRank: entry.previousRank,
          rankChange: entry.rankChange,
          matchesPlayed: entry.totalMatches,
          placementPoints: entry.totalPoints - entry.totalKills, // Estimate if not provided
          eliminations: entry.totalKills,
          dinners: entry.chickenDinners,
          points: entry.totalPoints,
          isQualified: !entry.isEliminated, // Fallback
          matchBreakdowns: entry.matchBreakdowns || []
        }));
        arr.advancementSpots = response.data.data.advancementSpots || 0;
        return arr;
      }
      const empty = [];
      empty.advancementSpots = 0;
      return empty;
    },
    enabled: !!tournamentSlug,
    refetchOnWindowFocus: false, // Wait for WebSocket updates mainly
  });
}

export function useTournamentRules(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'rules'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return exploreTournamentRules[tournamentSlug] || [];
    },
    enabled: !!tournamentSlug
  });
}

export function useTournamentPrizes(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'prizes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return exploreTournamentPrizes[tournamentSlug] || [];
    },
    enabled: !!tournamentSlug
  });
}

export function useTournamentResults(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug, 'results'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return exploreTournamentResults[tournamentSlug] || null;
    },
    enabled: !!tournamentSlug
  });
}

export function useSimulateLeaderboard() {
  return useMutation({
    mutationFn: async ({ tournamentId, scores }) => {
      const response = await api.post(`/tournaments/${tournamentId}/leaderboard/simulate`, { scores });
      if (response.data && response.data.data && response.data.data.entries) {
        const arr = response.data.data.entries.map(entry => ({
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
        arr.advancementSpots = response.data.data.advancementSpots || 0;
        return arr;
      }
      const empty = [];
      empty.advancementSpots = 0;
      return empty;
    }
  });
}
