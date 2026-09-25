import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const getHeaders = () => {
    const token = useAuthStore.getState().accessToken;
    return { Authorization: `Bearer ${token}` };
};

// ── Tournament Finance ────────────────────────────────────────────────────────

export const useTournamentFinancialSummary = (tournamentId) => {
    return useQuery({
        queryKey: ['finance', 'summary', tournamentId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/finance/summary`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!tournamentId,
    });
};

export const useTournamentFinancialSummaryDetailed = (tournamentId) => {
    return useQuery({
        queryKey: ['finance', 'summary-detailed', tournamentId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/finance/summary/detailed`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!tournamentId,
    });
};

export const useTournamentLedger = (tournamentId) => {
    return useQuery({
        queryKey: ['finance', 'ledger', tournamentId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/finance/ledger`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!tournamentId,
    });
};

// FR-16-005: Confirm winners
export const useConfirmWinners = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tournamentId) => {
            const r = await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/finance/confirm-winners`, {}, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, tournamentId) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'summary', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId] });
        },
    });
};

// FR-16-007: Winner verification status
export const useWinnerVerificationStatus = (tournamentId) => {
    return useQuery({
        queryKey: ['finance', 'winner-verification', tournamentId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/finance/winner-verification`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!tournamentId,
    });
};

// FR-16-010: Initiate ALL payouts
export const useInitiatePayouts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tournamentId) => {
            const r = await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/finance/payouts/initiate`, {}, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, tournamentId) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'summary', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['finance', 'ledger', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification', tournamentId] });
        },
    });
};

// FR-16-014: Initiate payout for a single position
export const useInitiatePositionPayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, posId }) => {
            const r = await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/finance/payouts/positions/${posId}/initiate`, {}, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { tournamentId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['finance', 'ledger', tournamentId] });
        },
    });
};

// FR-16-013: Retry failed payout
export const useRetryPayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, posId, payoutMethodId }) => {
            const r = await axios.post(
                `${API_BASE_URL}/tournaments/${tournamentId}/finance/payouts/positions/${posId}/retry`,
                payoutMethodId ? { payoutMethodId } : {},
                { headers: getHeaders() }
            );
            return r.data;
        },
        onSuccess: (_, { tournamentId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification', tournamentId] });
        },
    });
};

// FR-16-013: Mark as manual payout
export const useMarkManualPayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, posId, note }) => {
            const r = await axios.post(
                `${API_BASE_URL}/tournaments/${tournamentId}/finance/payouts/positions/${posId}/mark-manual`,
                { note },
                { headers: getHeaders() }
            );
            return r.data;
        },
        onSuccess: (_, { tournamentId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification', tournamentId] });
        },
    });
};

// ── Payout Methods ────────────────────────────────────────────────────────────

export const useTeamPayoutMethods = (teamId) => {
    return useQuery({
        queryKey: ['finance', 'payout-methods', 'team', teamId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/finance/teams/${teamId}/payout-methods`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!teamId,
    });
};

export const useAddTeamPayoutMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ teamId, data }) => {
            const r = await axios.post(`${API_BASE_URL}/finance/teams/${teamId}/payout-methods`, data, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'payout-methods', 'team', teamId] });
        },
    });
};

// FR-16-008: Validate UPI VPA
export const useValidateUpiVpa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const r = await axios.post(`${API_BASE_URL}/finance/upi/validate`, data, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { teamId }) => {
            if (teamId) queryClient.invalidateQueries({ queryKey: ['finance', 'payout-methods', 'team', teamId] });
        },
    });
};

// FR-16-007: Submit payout method for a prize position
export const useSubmitPayoutMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ posId, teamId, payoutMethodId }) => {
            const r = await axios.post(`${API_BASE_URL}/finance/prize-positions/${posId}/submit-payout-method`, { teamId, payoutMethodId }, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'winner-verification'] });
        },
    });
};

// ── KYC (FR-16-017) ───────────────────────────────────────────────────────────

export const useOrgKycDocuments = (orgId) => {
    return useQuery({
        queryKey: ['finance', 'kyc', orgId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/organizations/${orgId}/kyc/documents`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!orgId,
    });
};

export const useSubmitKycDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orgId, data }) => {
            const r = await axios.post(`${API_BASE_URL}/organizations/${orgId}/kyc/documents`, data, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { orgId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'kyc', orgId] });
        },
    });
};

// ── Org Financial Dashboard (FR-16-021) ──────────────────────────────────────

export const useOrgFinancialDashboard = (orgId) => {
    return useQuery({
        queryKey: ['finance', 'org-dashboard', orgId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/organizations/${orgId}/finance/dashboard`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!orgId,
    });
};

// ── Monthly Statements (FR-16-023) ───────────────────────────────────────────

export const useMonthlyStatements = (orgId) => {
    return useQuery({
        queryKey: ['finance', 'monthly-statements', orgId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/organizations/${orgId}/finance/statements`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!orgId,
    });
};

export const useGenerateMonthlyStatement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orgId, year, month }) => {
            const r = await axios.post(`${API_BASE_URL}/organizations/${orgId}/finance/statements/${year}/${month}`, {}, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { orgId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'monthly-statements', orgId] });
        },
    });
};

// ── Non-Cash Prizes (FR-16-019/020) ──────────────────────────────────────────

export const useNonCashPrizes = (tournamentId) => {
    return useQuery({
        queryKey: ['finance', 'non-cash-prizes', tournamentId],
        queryFn: async () => {
            const r = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/non-cash-prizes`, { headers: getHeaders() });
            return r.data;
        },
        enabled: !!tournamentId,
    });
};

export const useAddNonCashPrize = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tournamentId, posId, data }) => {
            const r = await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/prize-positions/${posId}/non-cash-prizes`, data, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { tournamentId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'non-cash-prizes', tournamentId] });
        },
    });
};

export const useUpdateNonCashDispatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ prizeId, data, tournamentId }) => {
            const r = await axios.put(`${API_BASE_URL}/non-cash-prizes/${prizeId}/dispatch`, data, { headers: getHeaders() });
            return r.data;
        },
        onSuccess: (_, { tournamentId }) => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'non-cash-prizes', tournamentId] });
        },
    });
};
