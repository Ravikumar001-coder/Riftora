import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useAdminScheduleQueries = (tournamentId) => {
  const queryClient = useQueryClient();

  const getMatchesQuery = useQuery({
    queryKey: ['admin-matches', tournamentId],
    queryFn: async () => {
      if (!tournamentId) return [];
      const response = await api.get(`/admin/tournaments/${tournamentId}/matches`);
      return response.data.data;
    },
    enabled: !!tournamentId
  });

  const generateScheduleMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(`/admin/tournaments/${tournamentId}/matches/generate`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const updateMatchScheduleMutation = useMutation({
    mutationFn: async ({ matchId, scheduledStart }) => {
      const response = await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/schedule`, { scheduledStart });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const batchUpdateScheduleMutation = useMutation({
    mutationFn: async (matches) => {
      const response = await api.put(`/admin/tournaments/${tournamentId}/matches/batch-schedule`, { matches });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const updateMatchSlotsMutation = useMutation({
    mutationFn: async ({ matchId, slots }) => {
      const response = await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/slots`, { slots });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const publishScheduleMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/admin/tournaments/${tournamentId}/schedule/publish`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const delayMatchMutation = useMutation({
    mutationFn: async ({ matchId, delayMinutes }) => {
      const response = await api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/delay`, { delayMinutes });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  const handleNoShowMutation = useMutation({
    mutationFn: async ({ matchId, payload }) => {
      const response = await api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/no-show`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches', tournamentId] });
    }
  });

  return {
    matches: getMatchesQuery.data || [],
    isLoading: getMatchesQuery.isLoading,
    generateSchedule: generateScheduleMutation.mutateAsync,
    isGenerating: generateScheduleMutation.isPending,
    updateMatchSchedule: updateMatchScheduleMutation.mutateAsync,
    isUpdatingSchedule: updateMatchScheduleMutation.isPending,
    batchUpdateSchedule: batchUpdateScheduleMutation.mutateAsync,
    isBatchUpdating: batchUpdateScheduleMutation.isPending,
    updateMatchSlots: updateMatchSlotsMutation.mutateAsync,
    isUpdatingSlots: updateMatchSlotsMutation.isPending,
    publishSchedule: publishScheduleMutation.mutateAsync,
    isPublishing: publishScheduleMutation.isPending,
    delayMatch: delayMatchMutation.mutateAsync,
    isDelaying: delayMatchMutation.isPending,
    handleNoShow: handleNoShowMutation.mutateAsync,
    isHandlingNoShow: handleNoShowMutation.isPending
  };
};
