import { useQuery } from '@tanstack/react-query';
import { exploreTournaments, explorePlayers } from '../../../services/mockData';

const fetchPlayerTournaments = async (username) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!username) return [];

  const player = explorePlayers.find(p => p.username === username);
  if (!player) return [];

  // Filter tournaments matching player's supported games
  const playerTournaments = exploreTournaments.filter(
    (t) => player.supportedGames.includes(t.game)
  );

  return playerTournaments;
};

export function usePlayerTournaments(username) {
  return useQuery({
    queryKey: ['playerTournaments', username],
    queryFn: () => fetchPlayerTournaments(username),
    enabled: !!username,
  });
}
