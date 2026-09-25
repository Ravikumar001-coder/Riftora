import { useQuery } from '@tanstack/react-query';
import { exploreTeams } from '../../../services/mockData';

const fetchTeam = async (slug) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const team = exploreTeams.find((t) => t.slug === slug);
  
  if (!team) {
    throw new Error('Team not found');
  }

  return team;
};

export function useTeam(slug) {
  return useQuery({
    queryKey: ['team', slug],
    queryFn: () => fetchTeam(slug),
    enabled: !!slug,
  });
}
