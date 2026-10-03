import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useOrgDashboardMetrics = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'dashboard', orgId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/dashboard`);
            return data.data;
        },
        enabled: !!orgId
    });
};

export const useOrgTimeSeriesCharts = (orgId, dateRange = 'all_time') => {
    return useQuery({
        queryKey: ['analytics', 'charts', orgId, dateRange],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/charts`, {
                params: { dateRange }
            });
            return data.data;
        },
        enabled: !!orgId
    });
};

export const useTournamentPerformance = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'performance', orgId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/tournaments/performance`);
            return data.data;
        },
        enabled: !!orgId
    });
};

export const useGameMixAnalysis = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'game-mix', orgId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/game-mix`);
            return data.data;
        },
        enabled: !!orgId
    });
};

export const usePlayerRetentionAnalysis = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'retention', orgId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/retention`);
            return data.data;
        },
        enabled: !!orgId
    });
};

export const useEntryFeeOptimization = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'optimization', 'entry-fee', orgId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/org/${orgId}/optimization/entry-fee`);
            return data.data;
        },
        enabled: !!orgId
    });
};

export const usePostTournamentReport = (tournamentId) => {
    return useQuery({
        queryKey: ['analytics', 'report', tournamentId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/tournaments/${tournamentId}/report`);
            return data.data;
        },
        enabled: !!tournamentId
    });
};

export const usePlayerCareerDashboard = (userId) => {
    return useQuery({
        queryKey: ['analytics', 'player-career', userId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/players/${userId}/career`);
            return data.data;
        },
        enabled: !!userId
    });
};

export const useTeamAnalyticsDashboard = (teamId) => {
    return useQuery({
        queryKey: ['analytics', 'team', teamId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/teams/${teamId}/analytics`);
            return data.data;
        },
        enabled: !!teamId
    });
};

export const useHeadToHeadComparison = (player1Id, player2Id) => {
    return useQuery({
        queryKey: ['analytics', 'h2h', player1Id, player2Id],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/players/compare`, {
                params: { player1Id, player2Id }
            });
            return data.data;
        },
        enabled: !!player1Id && !!player2Id
    });
};

export const useTournamentStreamAnalytics = (tournamentId) => {
    return useQuery({
        queryKey: ['analytics', 'stream', 'tournament', tournamentId],
        queryFn: async () => {
            const { data } = await api.get(`/analytics/tournaments/${tournamentId}/stream-analytics`);
            return data.data;
        },
        enabled: !!tournamentId
    });
};

export const useOrganizationStreamPerformance = (orgId) => {
    return useQuery({
        queryKey: ['analytics', 'stream', 'org', orgId],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/organizations/${orgId}/stream-performance`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        },
        enabled: !!orgId
    });
};

export const usePlatformHealth = () => {
    return useQuery({
        queryKey: ['analytics', 'platform', 'health'],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/platform/health`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        }
    });
};

export const useUserAcquisitionFunnel = () => {
    return useQuery({
        queryKey: ['analytics', 'platform', 'funnel'],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/platform/funnel`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        }
    });
};

export const usePlatformRevenue = () => {
    return useQuery({
        queryKey: ['analytics', 'platform', 'revenue'],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/platform/revenue`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return data.data;
        }
    });
};


