import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";

const API_BASE_URL = 'http://localhost:8080/api/v1/teams';

const getHeaders = () => {
    const token = useAuthStore.getState().accessToken;
    return {
        Authorization: `Bearer ${token}`
    };
};

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(API_BASE_URL, data, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useGetUserTeams = (page = 0, limit = 20) => {
    return useQuery({
        queryKey: ['teams', 'me', page, limit],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`, { headers: getHeaders() });
            return response.data.data;
        }
    });
};

export const useGetUserInvitations = () => {
    return useQuery({
        queryKey: ['teams', 'invites', 'me'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/invites/me`, { headers: getHeaders() });
            return response.data.data;
        }
    });
};

export const useGetTeam = (teamId) => {
    return useQuery({
        queryKey: ['team', teamId],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/${teamId}`, { headers: getHeaders() });
            return response.data.data;
        },
        enabled: !!teamId
    });
};

export const useGetTeamBySlug = (slug) => {
    return useQuery({
        queryKey: ['team', 'slug', slug],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/slug/${slug}`); // public
            return response.data.data;
        },
        enabled: !!slug
    });
};

export const useInvitePlayer = (teamId) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_BASE_URL}/${teamId}/invites`, data, { headers: getHeaders() });
            return response.data;
        }
    });
};

export const useAcceptInvitation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inviteId) => {
            const response = await axios.post(`${API_BASE_URL}/invites/${inviteId}/accept`, {}, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useDeclineInvitation = () => {
    return useMutation({
        mutationFn: async (inviteId) => {
            const response = await axios.post(`${API_BASE_URL}/invites/${inviteId}/decline`, {}, { headers: getHeaders() });
            return response.data;
        }
    });
};

export const useRemovePlayer = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (memberId) => {
            const response = await axios.delete(`${API_BASE_URL}/${teamId}/members/${memberId}`, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', teamId] });
        }
    });
};

export const useLeaveTeam = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${API_BASE_URL}/${teamId}/leave`, {}, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useUpdateTeam = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.put(`${API_BASE_URL}/${teamId}`, data, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['team', teamId] });
            queryClient.invalidateQueries({ queryKey: ['team', 'slug'] });
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useDisbandTeam = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axios.delete(`${API_BASE_URL}/${teamId}`, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useTransferCaptaincy = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (memberId) => {
            const response = await axios.put(`${API_BASE_URL}/${teamId}/captaincy/${memberId}`, {}, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', teamId] });
            queryClient.invalidateQueries({ queryKey: ['team', 'slug'] });
        }
    });
};

export const useUpdateMemberRole = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId, data }) => {
            const response = await axios.put(`${API_BASE_URL}/${teamId}/members/${memberId}/role`, data, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', teamId] });
            queryClient.invalidateQueries({ queryKey: ['team', 'slug'] });
        }
    });
};

export const useJoinTeamByCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inviteCode) => {
            const response = await axios.post(`${API_BASE_URL}/join-code/${inviteCode}`, {}, { headers: getHeaders() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
        }
    });
};

export const useRegenerateInviteCode = (teamId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${API_BASE_URL}/${teamId}/invite-code/regenerate`, {}, { headers: getHeaders() });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', teamId] });
        }
    });
};

export const useGetTeamTournaments = (teamId) => {
    return useQuery({
        queryKey: ['teamTournaments', teamId],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/${teamId}/tournaments`);
            return response.data.data;
        },
        enabled: !!teamId
    });
};

export const useGetRosterHistory = (teamId) => {
    return useQuery({
        queryKey: ['teamRosterHistory', teamId],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/${teamId}/roster-history`, { headers: getHeaders() });
            return response.data.data;
        },
        enabled: !!teamId
    });
};
