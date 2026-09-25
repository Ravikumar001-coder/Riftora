import { useQuery } from '@tanstack/react-query';
import { exploreTournaments, exploreTeams } from '../../../services/mockData';

const fetchTeamTournaments = async (slug) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!slug) return [];

  // In a real API, we'd query by team ID. Since our mock data uses org name string, we match that loosely.
  // Wait, the exploreTournaments doesn't have a team field. We will just return some random tournaments for the team.
  // We'll use the team's supported games to filter.
  
  const team = exploreTeams.find(t => t.slug === slug);
  if (!team) return [];

  // Filter tournaments matching team's supported games
  const teamTournaments = exploreTournaments.filter(
    (t) => team.supportedGames.includes(t.game)
  );

  return teamTournaments;
};

export function useTeamTournaments(slug) {
  return useQuery({
    queryKey: ['teamTournaments', slug],
    queryFn: () => fetchTeamTournaments(slug),
    enabled: !!slug,
  });
}
