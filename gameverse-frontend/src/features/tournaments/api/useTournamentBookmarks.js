import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useTournamentBookmarks = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['bookmarks', page, size],
    queryFn: async () => {
      const response = await api.get('/v1/tournaments/bookmarks', {
        params: { page, size }
      });
      return response.data; // Page<TournamentDto>
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, isBookmarked }) => {
      if (isBookmarked) {
        // Remove bookmark
        await api.delete(`/v1/tournaments/${tournamentId}/bookmark`);
      } else {
        // Add bookmark
        await api.post(`/v1/tournaments/${tournamentId}/bookmark`);
      }
      return { tournamentId, isBookmarked: !isBookmarked };
    },
    onSuccess: (data) => {
      // Invalidate both bookmarks list and tournaments list
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', data.tournamentId] });
      // In a real app we'd also optimistically update the UI, but this is simpler for now
    },
  });
};
