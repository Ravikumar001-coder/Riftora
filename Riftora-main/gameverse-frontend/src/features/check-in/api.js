import api from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCheckInStats = (tournamentId) => {
  return useQuery({
    queryKey: ['check-ins', 'stats', tournamentId],
    queryFn: async () => {
      const response = await api.get(`/admin/tournaments/${tournamentId}/check-ins/stats`);
      return response.data.data;
    },
    enabled: !!tournamentId,
  });
};

export const useManualCheckIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tournamentId, registrationId }) => {
      const response = await api.post(`/admin/tournaments/${tournamentId}/check-ins/manual`, {
        registrationId
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['check-ins', 'stats', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId, 'registrations'] });
    },
  });
};

export const useSelfCheckIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tournamentId, registrationId }) => {
      const response = await api.post(`/player/tournaments/${tournamentId}/check-ins`, {
        registrationId
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['check-ins', 'stats', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.registrationId] });
    },
  });
};
