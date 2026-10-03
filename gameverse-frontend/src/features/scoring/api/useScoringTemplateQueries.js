import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

const TEMPLATES_KEYS = {
    all: (orgId) => ['scoring-templates', orgId],
    detail: (orgId, id) => [...TEMPLATES_KEYS.all(orgId), id]
};

export function useScoringTemplates(orgId) {
    return useQuery({
        queryKey: TEMPLATES_KEYS.all(orgId),
        queryFn: async () => {
            const { data } = await api.get(`/organizations/${orgId}/scoring-templates`);
            return data;
        },
        enabled: !!orgId
    });
}

export function useSimulateScoring(orgId, templateId) {
    return useMutation({
        mutationFn: async (simulationData) => {
            const { data } = await api.post(`/organizations/${orgId}/scoring-templates/${templateId}/simulate`, simulationData);
            return data;
        }
    });
}
