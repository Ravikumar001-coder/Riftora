import { useQuery } from '@tanstack/react-query';
import { exploreTeamRosters } from '../../../services/mockData';

const fetchTeamRoster = async (slug) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const roster = exploreTeamRosters[slug];
  
  if (!roster) {
    return []; // Return empty if no public roster is available
  }

  return roster;
};

export function useTeamRoster(slug) {
  return useQuery({
    queryKey: ['teamRoster', slug],
    queryFn: () => fetchTeamRoster(slug),
    enabled: !!slug,
  });
}
