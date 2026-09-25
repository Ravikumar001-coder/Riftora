import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

const fetchPlayer = async (username) => {
  try {
    const response = await api.get(`/v1/public/users/${username}/profile`);
    return response.data?.data || null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Player not found');
    }
    throw error;
  }
};

export function usePlayer(username) {
  return useQuery({
    queryKey: ['player', username],
    queryFn: () => fetchPlayer(username),
    enabled: !!username,
  });
}
