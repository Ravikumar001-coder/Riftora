import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const adminGameService = {
  async getGames() {
    const response = await api.get('/admin/games');
    return response.data.data;
  },

  async createGame(data) {
    const response = await api.post('/admin/games', data);
    return response.data.data;
  },

  async updateGame(gameId, data) {
    const response = await api.put(`/admin/games/${gameId}`, data);
    return response.data.data;
  },

  async toggleGameStatus(gameId) {
    const response = await api.patch(`/admin/games/${gameId}/toggle-status`);
    return response.data.data;
  }
};

export const useAdminGamesQuery = () => {
  return useQuery({
    queryKey: ['admin', 'games'],
    queryFn: () => adminGameService.getGames(),
  });
};

export const useAdminGameMutations = () => {
  const queryClient = useQueryClient();

  const createGame = useMutation({
    mutationFn: (data) => adminGameService.createGame(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
    },
  });

  const updateGame = useMutation({
    mutationFn: ({ gameId, data }) => adminGameService.updateGame(gameId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: (gameId) => adminGameService.toggleGameStatus(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
    },
  });

  return { createGame, updateGame, toggleStatus };
};
