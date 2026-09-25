import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const useSponsorsByOrg = (orgId) => {
    return useQuery({
        queryKey: ['sponsors', 'org', orgId],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/organizations/${orgId}/sponsors`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!orgId
    });
};

export const useCreateSponsor = (orgId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sponsorData) => {
            const { data } = await axios.post(`${BASE_URL}/organizations/${orgId}/sponsors`, sponsorData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['sponsors', 'org', orgId]);
        }
    });
};

export const useTournamentSponsors = (tournamentId) => {
    return useQuery({
        queryKey: ['sponsors', 'tournament', tournamentId],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/tournaments/${tournamentId}/sponsors`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!tournamentId
    });
};

export const useAssignSponsor = (tournamentId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sponsorId, optOutGraphics, optOutStream }) => {
            const { data } = await axios.post(
                `${BASE_URL}/tournaments/${tournamentId}/sponsors/${sponsorId}?optOutGraphics=${optOutGraphics}&optOutStream=${optOutStream}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['sponsors', 'tournament', tournamentId]);
        }
    });
};

export const useSponsorReport = (tournamentId, sponsorId) => {
    return useQuery({
        queryKey: ['sponsors', 'report', tournamentId, sponsorId],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/tournaments/${tournamentId}/sponsors/${sponsorId}/report`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!tournamentId && !!sponsorId
    });
};
