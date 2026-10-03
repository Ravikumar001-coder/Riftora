import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { broadcastApi } from '../api/broadcastApi';

export const useYoutubeIntegration = (orgId) => {
  return useQuery({
    queryKey: ['youtubeIntegration', orgId],
    queryFn: () => broadcastApi.getYoutubeIntegration(orgId),
    enabled: !!orgId,
  });
};

export const useConnectYoutube = (orgId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => broadcastApi.connectYoutube({ orgId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtubeIntegration', orgId] });
    },
  });
};

export const useDisconnectYoutube = (orgId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => broadcastApi.disconnectYoutube(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtubeIntegration', orgId] });
    },
  });
};
