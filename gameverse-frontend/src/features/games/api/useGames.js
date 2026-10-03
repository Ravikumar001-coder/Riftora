import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await api.get('/v1/games');
      return response.data?.data || [];
    },
  });
}
