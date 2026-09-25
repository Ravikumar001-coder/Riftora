import { useQuery } from '@tanstack/react-query';
import { gameService } from '../api/game.service';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => gameService.getGames(),
  });
}

export function useSystemTemplates(gameId) {
  return useQuery({
    queryKey: ['games', gameId, 'templates'],
    queryFn: () => gameService.getSystemTemplates(gameId),
    enabled: !!gameId,
  });
}
