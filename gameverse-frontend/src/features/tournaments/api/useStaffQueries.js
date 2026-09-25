import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useTournamentStaff = (tournamentId) => {
  return useQuery({
    queryKey: ['tournament-staff', tournamentId],
    queryFn: async () => {
      const response = await api.get(`/v1/tournaments/${tournamentId}/staff`);
      return response.data; // List<TournamentStaffDto>
    },
    enabled: !!tournamentId,
  });
};

export const useAssignStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, staffData }) => {
      const response = await api.post(`/v1/tournaments/${tournamentId}/staff`, staffData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament-staff', variables.tournamentId] });
    },
  });
};

export const useRemoveStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, staffId }) => {
      await api.delete(`/v1/tournaments/${tournamentId}/staff/${staffId}`);
      return { tournamentId, staffId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tournament-staff', data.tournamentId] });
    },
  });
};

export const useStaffActivityLog = (tournamentId, staffUserId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['staff-activity-log', tournamentId, staffUserId, page, size],
    queryFn: async () => {
      const response = await api.get(`/v1/tournaments/${tournamentId}/staff/${staffUserId}/logs`, {
        params: { page, size }
      });
      return response.data; // Page<StaffActivityLogDto>
    },
    enabled: !!tournamentId && !!staffUserId,
  });
};
