import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const TEMPLATES_KEYS = {
    all: (orgId) => ['scoring-templates', orgId],
    detail: (orgId, id) => [...TEMPLATES_KEYS.all(orgId), id]
};

export function useScoringTemplates(orgId) {
    return useQuery({
        queryKey: TEMPLATES_KEYS.all(orgId),
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/scoring-templates`);
            return data;
        },
        enabled: !!orgId
    });
}

export function useSimulateScoring(orgId, templateId) {
    return useMutation({
        mutationFn: async (simulationData) => {
            const { data } = await axios.post(`http://localhost:8080/api/v1/organizations/${orgId}/scoring-templates/${templateId}/simulate`, simulationData);
            return data;
        }
    });
}
