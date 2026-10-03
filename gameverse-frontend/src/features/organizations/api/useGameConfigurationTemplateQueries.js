import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useGameConfigurationTemplatesQuery = (orgId, gameId = null) => {
  return useQuery({
    queryKey: ['org', orgId, 'game-templates', gameId],
    queryFn: async () => {
      if (!orgId) return null;
      const params = gameId ? { gameId } : {};
      const { data } = await api.get(`/organizations/${orgId}/game-templates`, { params });
      return data;
    },
    enabled: !!orgId,
  });
};

export const useGameConfigurationTemplateQuery = (orgId, templateId) => {
  return useQuery({
    queryKey: ['org', orgId, 'game-templates', templateId],
    queryFn: async () => {
      if (!orgId || !templateId) return null;
      const { data } = await api.get(`/organizations/${orgId}/game-templates/${templateId}`);
      return data;
    },
    enabled: !!orgId && !!templateId,
  });
};
