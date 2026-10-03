import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useTournamentById(tournamentId) {
  return useQuery({
    queryKey: ['tournament', 'id', tournamentId],
    queryFn: async () => {
      const response = await api.get(`/tournaments/${tournamentId}`);
      return response.data.data;
    },
    enabled: !!tournamentId,
  });
}
