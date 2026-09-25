import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/v1';

export const useGetTeamRegistrations = (teamId, page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['registrations', 'team', teamId, { page, limit }],
        queryFn: async () => {
            if (!teamId) return null;
            const response = await axios.get(`${API_URL}/registrations/team/${teamId}`, {
                params: { page, limit },
                withCredentials: true
            });
            return response.data.data;
        },
        enabled: !!teamId,
    });
};

export const useRegisterTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (registrationData) => {
            const response = await axios.post(`${API_URL}/registrations`, registrationData, {
                withCredentials: true
            });
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['registrations', 'team', variables.teamId] });
        }
    });
};
