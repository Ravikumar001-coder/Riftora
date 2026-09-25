import { useQuery } from '@tanstack/react-query';

export const usePlayerScheduleQueries = (tournamentId) => {
  const getPlayerSchedule = useQuery({
    queryKey: ['player', 'tournaments', tournamentId, 'schedule'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/player/tournaments/${tournamentId}/matches/my-team`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch player schedule');
      const data = await response.json();
      return data.data;
    },
    enabled: !!tournamentId,
    retry: false, // Don't retry if it fails (e.g. 403 Forbidden because schedule not published)
  });

  return {
    getPlayerSchedule,
  };
};
