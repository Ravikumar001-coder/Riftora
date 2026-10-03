import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useAuditLogs = (tournamentId, page = 0, size = 50) => {
  return useQuery({
    queryKey: ['audit-logs', tournamentId, page, size],
    queryFn: async () => {
      const response = await api.get(`/v1/tournaments/${tournamentId}/audit-logs`, {
        params: { page, size }
      });
      return response.data; // Page<AuditLogDto>
    },
    enabled: !!tournamentId,
    keepPreviousData: true,
  });
};
