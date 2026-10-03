import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useGameConfigurationTemplateMutations = () => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async ({ orgId, data }) => {
      const response = await api.post(`/organizations/${orgId}/game-templates`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org', variables.orgId, 'game-templates'] });
    },
  });

  return {
    createTemplate,
  };
};
