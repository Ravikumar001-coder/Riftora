import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
export const useGetPublicTournaments = (gameId, page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['tournaments', 'game', gameId, { page, limit }],
        queryFn: async () => {
            if (!gameId) return null;
            const response = await api.get(`/tournaments/game/${gameId}`, {
                params: { page, limit }
            });
            return response.data.data;
        },
        enabled: !!gameId,
    });
};

export const useGetTournament = (tournamentId) => {
    return useQuery({
        queryKey: ['tournament', tournamentId],
        queryFn: async () => {
            if (!tournamentId) return null;
            const response = await api.get(`/tournaments/${tournamentId}`);
            return response.data.data;
        },
        enabled: !!tournamentId,
    });
};

export const useGetTournamentBySlug = (slug) => {
    return useQuery({
        queryKey: ['tournament', 'slug', slug],
        queryFn: async () => {
            if (!slug) return null;
            const response = await api.get(`/tournaments/slug/${slug}`);
            return response.data.data;
        },
        enabled: !!slug,
        retry: false
    });
};

export const useExploreTournaments = (filters = {}, page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['tournaments', 'explore', filters, { page, limit }],
        queryFn: async () => {
            const response = await api.post(`/tournaments/explore`, filters, {
                params: { page, limit }
            });
            return response.data;
        }
    });
};

export const useUpdateTournamentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, status, cancellationReason }) => {
            const response = await api.put(`/tournaments/${tournamentId}/status`, {
                status,
                cancellationReason
            });
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['tournament', 'slug'] });
        }
    });
};
