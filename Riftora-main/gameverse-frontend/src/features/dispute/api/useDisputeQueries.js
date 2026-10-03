import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const useCreateDispute = (tournamentId, teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (disputeData) => {
            const { data } = await axios.post(`${BASE_URL}/tournaments/${tournamentId}/disputes/teams/${teamId}`, disputeData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disputes', tournamentId, teamId] });
        }
    });
};

export const useTournamentDisputes = (tournamentId, page = 0, size = 50) => {
    return useQuery({
        queryKey: ['disputes', 'tournament', tournamentId, page, size],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/tournaments/${tournamentId}/disputes?page=${page}&size=${size}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!tournamentId
    });
};

export const useDisputeDetails = (tournamentId, disputeId) => {
    return useQuery({
        queryKey: ['dispute', tournamentId, disputeId],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/tournaments/${tournamentId}/disputes/${disputeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!tournamentId && !!disputeId
    });
};

export const useUpdateDisputeStatus = (tournamentId, disputeId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updateData) => {
            const { data } = await axios.patch(`${BASE_URL}/tournaments/${tournamentId}/disputes/${disputeId}/status`, updateData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dispute', tournamentId, disputeId] });
            queryClient.invalidateQueries({ queryKey: ['disputes', 'tournament', tournamentId] });
        }
    });
};

export const useEscalateDispute = (tournamentId, disputeId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reason) => {
            const { data } = await axios.post(`${BASE_URL}/tournaments/${tournamentId}/disputes/${disputeId}/escalate`, { reason }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dispute', tournamentId, disputeId] });
            queryClient.invalidateQueries({ queryKey: ['disputes', 'tournament', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['disputes', 'escalated'] });
        }
    });
};

export const useEscalatedDisputes = () => {
    return useQuery({
        queryKey: ['disputes', 'escalated'],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/admin/disputes/escalated`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        }
    });
};

export const useAppealDispute = (tournamentId, disputeId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reason) => {
            const { data } = await axios.post(`${BASE_URL}/tournaments/${tournamentId}/disputes/${disputeId}/appeal`, { reason }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dispute', tournamentId, disputeId] });
            queryClient.invalidateQueries({ queryKey: ['disputes', 'tournament', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['disputes', 'escalated'] });
        }
    });
};

export const useResolveEscalatedDispute = (disputeId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axios.patch(`${BASE_URL}/admin/disputes/escalated/${disputeId}/resolve`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disputes', 'escalated'] });
            // Cannot reliably invalidate specific tournament dispute since tournamentId is not in args, but we can invalidate all disputes just in case
            queryClient.invalidateQueries({ queryKey: ['dispute'] });
        }
    });
};
