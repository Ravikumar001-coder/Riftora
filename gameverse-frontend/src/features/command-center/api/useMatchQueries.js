import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useAssignReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, matchId, refereeId }) => {
      const response = await api.put(`/v1/matches/${matchId}/referee`, null, {
        params: { refereeUserId: refereeId }
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate match detail query if one exists
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['matches', variables.tournamentId] });
    },
  });
};

export const useMatchCredential = (matchId) => {
  return useQuery({
    queryKey: ['match-credential', matchId],
    queryFn: async () => {
      const response = await api.get(`/v1/credentials/match/${matchId}`);
      return response.data.data;
    },
    enabled: !!matchId,
    retry: false, // Don't retry on 401/403
  });
};

export const useLogCredentialCopy = () => {
  return useMutation({
    mutationFn: async ({ matchId, field }) => {
      const response = await api.post(`/v1/credentials/match/${matchId}/log-copy`, null, {
        params: { fieldCopied: field }
      });
      return response.data;
    }
  });
};

export const useLinkVod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, vodUrl, vodTimestampSeconds }) => {
      const response = await api.put(`/v1/matches/${matchId}/vod`, {
        vodUrl,
        vodTimestampSeconds
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['admin-schedule'] });
    },
  });
};
