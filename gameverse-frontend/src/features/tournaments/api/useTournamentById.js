import { useQuery } from '@tanstack/react-query';
import { exploreTournaments } from '../../../services/mockData';

export function useTournamentById(tournamentId) {
  return useQuery({
    queryKey: ['tournament', 'id', tournamentId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const tournament = exploreTournaments.find(
        (t) => t.id === tournamentId
      );
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      return tournament;
    },
    enabled: !!tournamentId,
    retry: false,
  });
}
