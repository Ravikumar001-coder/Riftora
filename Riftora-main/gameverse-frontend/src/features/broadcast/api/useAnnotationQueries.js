import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useGetAnnotations = (tournamentId) => {
  return useQuery({
    queryKey: ['annotations', tournamentId],
    queryFn: async () => {
      if (!tournamentId) return [];
      const response = await api.get(`/tournaments/${tournamentId}/broadcast/annotations`);
      return response.data;
    },
    enabled: !!tournamentId,
  });
};

export const useCreateAnnotation = (tournamentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (annotationData) => {
      const response = await api.post(`/tournaments/${tournamentId}/broadcast/annotations`, annotationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['annotations', tournamentId]);
    }
  });
};
