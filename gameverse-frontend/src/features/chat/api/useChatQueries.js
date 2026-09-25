import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/v1';

export const useChatHistory = (tournamentId, channel) => {
  return useQuery({
    queryKey: ['chat', tournamentId, channel],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/tournaments/${tournamentId}/chat/${channel}`);
      return response.data.data;
    },
    enabled: !!tournamentId && !!channel,
    staleTime: 60000,
  });
};
