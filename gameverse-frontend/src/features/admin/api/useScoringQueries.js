import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

// Get scoring templates for an organization
export const useScoringTemplates = (orgId) => {
  return useQuery({
    queryKey: ['org', orgId, 'scoring-templates'],
    queryFn: async () => {
      if (!orgId) return [];
      const response = await api.get(`/organizations/${orgId}/scoring-templates`);
      return response.data;
    },
    enabled: !!orgId
  });
};

export const useScoringMutations = (orgId) => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (data) => {
      const snakeCaseData = {
        template_name: data.templateName,
        game_id: data.gameId,
        kill_cap: data.killCap,
        kill_pts_each: data.killPtsEach,
        placement_points: data.placementPoints
      };
      const response = await api.post(`/organizations/${orgId}/scoring-templates`, snakeCaseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org', orgId, 'scoring-templates'] });
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ templateId, data }) => {
      const snakeCaseData = {
        template_name: data.templateName,
        game_id: data.gameId,
        kill_cap: data.killCap,
        kill_pts_each: data.killPtsEach,
        placement_points: data.placementPoints
      };
      const response = await api.put(`/organizations/${orgId}/scoring-templates/${templateId}`, snakeCaseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org', orgId, 'scoring-templates'] });
    }
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId) => {
      const response = await api.delete(`/organizations/${orgId}/scoring-templates/${templateId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org', orgId, 'scoring-templates'] });
    }
  });

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
