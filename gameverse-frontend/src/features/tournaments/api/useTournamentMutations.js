import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/v1';

export const useCreateTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/tournaments`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['tournaments']);
        },
    });
};

export const useUpdateTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tournamentId, data }) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/tournaments/${tournamentId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['tournaments']);
            queryClient.invalidateQueries(['tournament', variables.tournamentId]);
        },
    });
};

export const useSaveAsTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tournamentId) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/tournaments/${tournamentId}/save-as-template`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tournaments']);
        },
    });
};

export const useSyncBrandKit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tournamentId) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/tournaments/${tournamentId}/sync-brand-kit`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['tournaments']);
            queryClient.invalidateQueries(['tournament', variables]);
        },
    });
};
