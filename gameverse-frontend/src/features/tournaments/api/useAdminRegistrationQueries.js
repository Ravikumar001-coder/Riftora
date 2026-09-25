import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useGetTournamentRegistrations = (tournamentId, page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['admin-registrations', tournamentId, { page, limit }],
        queryFn: async () => {
            if (!tournamentId) return null;
            const response = await api.get(`/admin/tournaments/${tournamentId}/registrations`, {
                params: { page, limit }
            });
            return response.data.data;
        },
        enabled: !!tournamentId,
    });
};

export const useGetRegistrationRoster = (registrationId) => {
    return useQuery({
        queryKey: ['admin-registration-roster', registrationId],
        queryFn: async () => {
            if (!registrationId) return null;
            const response = await api.get(`/registrations/${registrationId}/roster`);
            return response.data.data;
        },
        enabled: !!registrationId,
    });
};

export const useVerifyTournamentUids = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tournamentId) => {
            const response = await api.post(`/registrations/tournament/${tournamentId}/verify-uids`);
            return response.data.data;
        },
        onSuccess: (_, tournamentId) => {
            queryClient.invalidateQueries({ queryKey: ['admin-registrations', tournamentId] });
        }
    });
};

export const useUpdateRegistrationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, registrationId, status, notes }) => {
            let endpoint = '';
            let payload = {};
            
            if (status === 'approved') {
                endpoint = `/admin/tournaments/${tournamentId}/registrations/${registrationId}/approve`;
            } else if (status === 'rejected') {
                endpoint = `/admin/tournaments/${tournamentId}/registrations/${registrationId}/reject`;
                payload = { reason: notes };
            } else if (status === 'correction_requested') {
                endpoint = `/admin/tournaments/${tournamentId}/registrations/${registrationId}/correction`;
                payload = { notes: notes };
            } else if (status === 'waitlisted') {
                endpoint = `/admin/tournaments/${tournamentId}/registrations/${registrationId}/waitlist`;
            } else {
                throw new Error("Unsupported status update");
            }
            
            const response = await api.post(endpoint, payload);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
            queryClient.invalidateQueries({ queryKey: ['admin-registration-roster'] });
        }
    });
};
