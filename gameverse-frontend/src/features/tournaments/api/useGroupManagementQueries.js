import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api/v1/tournaments';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const useGetTournamentGroups = (tournamentId) => {
  return useQuery({
    queryKey: ['tournamentGroups', tournamentId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/${tournamentId}/groups`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch groups');
      const json = await res.json();
      return json.data;
    },
    enabled: !!tournamentId,
  });
};

export const useUpdateAdvancementRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, rules }) => {
      const res = await fetch(`${API_BASE}/${tournamentId}/groups/advancement-rules`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(rules)
      });
      if (!res.ok) throw new Error('Failed to update rules');
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournamentGroups', variables.tournamentId] });
    },
  });
};

export const useGenerateFinals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId }) => {
      const res = await fetch(`${API_BASE}/${tournamentId}/groups/generate-finals`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to generate finals');
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournamentMatches', variables.tournamentId] });
    },
  });
};
