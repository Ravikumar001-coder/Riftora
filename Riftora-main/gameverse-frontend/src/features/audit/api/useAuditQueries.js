import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const useTournamentAuditLogs = (tournamentId, page = 0, size = 50) => {
    return useQuery({
        queryKey: ['audit-logs', 'tournament', tournamentId, page, size],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/tournaments/${tournamentId}/audit?page=${page}&size=${size}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!tournamentId
    });
};

export const exportTournamentAuditLog = (tournamentId) => {
    window.open(`${BASE_URL}/tournaments/${tournamentId}/audit/export`, '_blank');
};
