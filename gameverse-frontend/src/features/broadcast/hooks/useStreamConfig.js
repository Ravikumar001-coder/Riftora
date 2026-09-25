import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { broadcastApi } from '../api/broadcastApi';

export const useStreamConfigs = (tournamentId) => {
  return useQuery({
    queryKey: ['streamConfigs', tournamentId],
    queryFn: () => broadcastApi.getTournamentStreams(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useCreateStreamConfig = (tournamentId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configData) => broadcastApi.createStreamConfig({ ...configData, tournamentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streamConfigs', tournamentId] });
    },
  });
};
