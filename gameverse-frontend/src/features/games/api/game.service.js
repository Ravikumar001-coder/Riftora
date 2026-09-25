import { api } from '../../../services/api';

export const gameService = {
  async getGames() {
    const response = await api.get('/v1/games');
    return response.data.data;
  },
  
  async getSystemTemplates(gameId) {
    const response = await api.get(`/v1/games/${gameId}/templates`);
    return response.data.data;
  }
};
