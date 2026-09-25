import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const useTournamentsAnnouncements = (tournamentId) => {
  return useQuery({
    queryKey: ['announcements', tournamentId],
    queryFn: async () => {
      if (!tournamentId) return [];
      const response = await axios.get(`${API_URL}/admin/tournaments/${tournamentId}/announcements`, {
        headers: getHeaders()
      });
      return response.data.data;
    },
    enabled: !!tournamentId
  });
};

export const useCreateAnnouncement = (tournamentId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_URL}/admin/tournaments/${tournamentId}/announcements`, data, {
        headers: getHeaders()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements', tournamentId]);
    }
  });
};
