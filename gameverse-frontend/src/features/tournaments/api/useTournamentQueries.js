import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/v1';

export const useGetPublicTournaments = (gameId, page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['tournaments', 'game', gameId, { page, limit }],
        queryFn: async () => {
            if (!gameId) return null;
            const response = await axios.get(`${API_URL}/tournaments/game/${gameId}`, {
                params: { page, limit },
                withCredentials: true
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
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_URL}/tournaments/${tournamentId}`, {
                headers,
                withCredentials: true
            });
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
            const response = await axios.get(`${API_URL}/tournaments/slug/${slug}`, {
                withCredentials: true
            });
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
            const response = await axios.post(`${API_URL}/tournaments/explore`, filters, {
                params: { page, limit },
                withCredentials: true
            });
            return response.data;
        }
    });
};
