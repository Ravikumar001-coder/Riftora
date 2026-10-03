import { useQuery } from '@tanstack/react-query';

export const usePublicScheduleQueries = (tournamentId) => {
  const getPublicSchedule = useQuery({
    queryKey: ['public', 'tournaments', tournamentId, 'schedule'],
    queryFn: async () => {
      const response = await fetch(`/api/v1/public/tournaments/${tournamentId}/matches`);
      if (!response.ok) throw new Error('Failed to fetch public schedule');
      const data = await response.json();
      return data.data;
    },
    enabled: !!tournamentId,
    retry: false, // Don't retry if it fails (e.g. 403 Forbidden because schedule not published)
  });

  return {
    getPublicSchedule,
  };
};
