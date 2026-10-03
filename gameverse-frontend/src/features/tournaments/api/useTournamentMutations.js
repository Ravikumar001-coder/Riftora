import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const useCreateTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const snakeCaseData = {
                name: data.name,
                slug: data.slug,
                game_id: data.gameId,
                org_id: data.orgId,
                tournament_type: data.tournamentType,
                tournament_tier: data.tournamentTier,
                edition_number: data.editionNumber,
                description: data.description,
                logo_url: data.logoUrl,
                banner_url: data.bannerUrl,
                start_date: data.startDate,
                end_date: data.endDate
            };
            const response = await api.post('/tournaments', snakeCaseData);
            return response.data.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
        },
    });
};

export const useUpdateTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tournamentId, data }) => {
            const formatIsoDate = (localString) => {
                if (!localString) return null;
                return localString.length === 16 ? localString + ':00' : localString; 
            };

            const snakeCaseData = {
                name: data.name,
                slug: data.slug,
                theme_type: data.themeType,
                tournament_type: data.tournamentType,
                edition_number: data.editionNumber ? parseInt(data.editionNumber, 10) : null,
                tournament_tier: data.tournamentTier,
                description: data.description,
                logo_url: data.logoUrl,
                banner_url: data.bannerUrl,
                
                format_type: data.formatType,
                teams_per_match: data.teamsPerMatch !== undefined ? (data.teamsPerMatch === '' || isNaN(data.teamsPerMatch) ? 2 : data.teamsPerMatch) : undefined,
                total_team_slots: data.totalTeamSlots !== undefined ? data.totalTeamSlots : undefined,
                total_rounds: data.totalRounds !== undefined ? data.totalRounds : (data.numberOfRounds !== undefined ? data.numberOfRounds : undefined),
                matches_per_round: data.matchesPerRound !== undefined ? data.matchesPerRound : undefined,
                
                start_date: formatIsoDate(data.startDate),
                end_date: formatIsoDate(data.endDate),
                registration_open: formatIsoDate(data.registrationOpenDate),
                registration_close: formatIsoDate(data.registrationCloseDate),
                
                entry_fee: data.entryFee,
                min_team_size: data.teamSizeMin === '' || isNaN(data.teamSizeMin) ? 1 : data.teamSizeMin,
                max_team_size: data.teamSizeMax === '' || isNaN(data.teamSizeMax) ? 1 : data.teamSizeMax,
                max_substitutes: data.maxSubstitutes === '' || isNaN(data.maxSubstitutes) ? 0 : data.maxSubstitutes,
                approval_mode: data.approvalMode === 'auto-approve' ? 'auto' : 'manual',
                waitlist_enabled: data.waitlistEnabled,
                waitlist_capacity: data.waitlistCapacity,
                checkin_required: data.checkInRequired,
                
                prize_pool_total: data.prizePoolTotal,
                prize_currency: data.prizeType,
                
                prize_positions: data.prizePositions?.map(p => ({
                    position: p.position,
                    label: p.label,
                    amount: p.amount,
                    percentage: p.percentage,
                    category: p.category
                })),
                
                messages: data.messages?.map(m => ({
                    message_type: m.messageType === 'pre_tournament' ? 'pre_tournament' : (m.messageType || 'announcement'),
                    title: m.title,
                    body: m.body
                })),
                
                staff: data.staff?.map(s => ({
                    email: s.email,
                    staff_role: s.staffRole.toLowerCase()
                }))
            };
            
            const response = await api.put(`/tournaments/${tournamentId}`, snakeCaseData);
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['tournament', 'slug'] });
        },
    });
};

export const useSaveAsTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tournamentId) => {
            const response = await api.post(`/tournaments/${tournamentId}/save-as-template`, {});
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
        },
    });
};

export const useSyncBrandKit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tournamentId) => {
            const response = await api.post(`/tournaments/${tournamentId}/sync-brand-kit`, {});
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['tournament', variables] });
        },
    });
};

export const useChangeTournamentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tournamentId, status, cancellationReason }) => {
            const response = await api.put(`/tournaments/${tournamentId}/status`, {
                status,
                cancellation_reason: cancellationReason
            });
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
        },
    });
};

export const useRegenerateMasterCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tournamentId }) => {
            const response = await api.patch(`/tournaments/${tournamentId}/regenerate-master-code`);
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['tournament', variables.tournamentId], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    master_access_code: data.master_access_code
                };
            });
            queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
        },
    });
};
