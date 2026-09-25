import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api/v1/admin/tournaments';

export const useAdminScheduleQueries = (tournamentId) => {
  const queryClient = useQueryClient();

  const getMatchesQuery = useQuery({
    queryKey: ['admin', 'tournaments', tournamentId, 'matches'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/${tournamentId}/matches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch schedule');
      return res.json();
    },
    enabled: !!tournamentId
  });

  const generateScheduleMutation = useMutation({
    mutationFn: async (payload) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/${tournamentId}/matches/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to generate schedule');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'tournaments', tournamentId, 'matches']);
    }
  });

  const updateMatchScheduleMutation = useMutation({
    mutationFn: async ({ matchId, scheduledStart }) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/v1/matches/${matchId}/schedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matchId, scheduledStart })
      });
      if (!res.ok) throw new Error('Failed to update schedule');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'tournaments', tournamentId, 'matches']);
    }
  });

  const batchUpdateScheduleMutation = useMutation({
    mutationFn: async (matches) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/v1/matches/batch-schedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matches })
      });
      if (!res.ok) throw new Error('Failed to batch update schedule');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments', tournamentId, 'matches'] });
    }
  });

  const updateMatchSlotsMutation = useMutation({
    mutationFn: async ({ matchId, slots }) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/${tournamentId}/matches/${matchId}/slots`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slots })
      });
      if (!res.ok) throw new Error('Failed to update match slots');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments', tournamentId, 'matches'] });
    }
  });

  const publishScheduleMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/${tournamentId}/schedule/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to publish schedule');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments', tournamentId, 'matches'] });
    }
  });

  const delayMatchMutation = useMutation({
    mutationFn: async ({ matchId, delayMinutes }) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/v1/matches/${matchId}/delay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ delayMinutes })
      });
      if (!res.ok) throw new Error('Failed to delay match');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments', tournamentId, 'matches'] });
    }
  });

  const handleNoShowMutation = useMutation({
    mutationFn: async ({ matchId, payload }) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/v1/matches/${matchId}/no-show`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload) // { teamId, action, targetMatchId }
      });
      if (!res.ok) throw new Error('Failed to handle no-show');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments', tournamentId, 'matches'] });
    }
  });

  return {
    matches: getMatchesQuery.data?.data || [],
    isLoading: getMatchesQuery.isLoading,
    generateSchedule: generateScheduleMutation.mutateAsync,
    isGenerating: generateScheduleMutation.isPending,
    updateMatchSchedule: updateMatchScheduleMutation.mutateAsync,
    isUpdatingSchedule: updateMatchScheduleMutation.isPending,
    batchUpdateSchedule: batchUpdateScheduleMutation.mutateAsync,
    isBatchUpdating: batchUpdateScheduleMutation.isPending,
    updateMatchSlots: updateMatchSlotsMutation.mutateAsync,
    isUpdatingSlots: updateMatchSlotsMutation.isPending,
    publishSchedule: publishScheduleMutation.mutateAsync,
    isPublishing: publishScheduleMutation.isPending,
    delayMatch: delayMatchMutation.mutateAsync,
    isDelaying: delayMatchMutation.isPending,
    handleNoShow: handleNoShowMutation.mutateAsync,
    isHandlingNoShow: handleNoShowMutation.isPending
  };
};
