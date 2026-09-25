import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useOverlays = (tournamentId) => {
    return useQuery({
        queryKey: ['overlays', tournamentId],
        queryFn: async () => {
            const { data } = await api.get(`/v1/tournaments/${tournamentId}/overlays`);
            return data.data;
        },
        enabled: !!tournamentId,
    });
};

export const useInitializeOverlays = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId }) => {
            const { data } = await api.post(`/v1/tournaments/${tournamentId}/overlays/init`);
            return data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['overlays', variables.tournamentId] });
        },
    });
};

export const useRegenerateOverlayToken = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, overlayId }) => {
            const { data } = await api.post(`/v1/tournaments/${tournamentId}/overlays/${overlayId}/regenerate-token`);
            return data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['overlays', variables.tournamentId] });
        },
    });
};

export const useUpdateOverlayConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, overlayId, configPayload }) => {
            const { data } = await api.put(`/v1/tournaments/${tournamentId}/overlays/${overlayId}/config`, configPayload);
            return data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['overlays', variables.tournamentId] });
        },
    });
};

export const usePublicOverlay = (tournamentId, overlayType, token) => {
    return useQuery({
        queryKey: ['public-overlay', tournamentId, overlayType, token],
        queryFn: async () => {
            // Note: we use api instance but this is a public endpoint, 
            // the api instance might attach the auth token if available, but it's fine.
            const { data } = await api.get(`/v1/public/tournaments/${tournamentId}/overlays/${overlayType}`, {
                params: { token }
            });
            return data.data;
        },
        enabled: !!tournamentId && !!overlayType && !!token,
        retry: false
    });
};
