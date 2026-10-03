import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePublicLeaderboard = (tournamentId, options = {}) => {
  return useQuery({
    queryKey: ['publicLeaderboard', tournamentId],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/public/tournaments/${tournamentId}/leaderboard`);
      return response.data.data;
    },
    enabled: !!tournamentId && options.enabled !== false,
    refetchInterval: options.refetchInterval || false,
  });
};
