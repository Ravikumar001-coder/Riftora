import { useQuery } from '@tanstack/react-query';
import { exploreTournaments } from '../../../services/mockData';

const fetchOrganizationTournaments = async (orgName) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800)); // Slightly longer delay to show staged loading

  if (!orgName) return [];

  // In a real API, we'd query by org ID. Since our mock data uses org name string, we match that loosely.
  const nameLower = orgName.toLowerCase();
  
  // Filter tournaments belonging to this org
  const orgTournaments = exploreTournaments.filter(
    (t) => t.organization.toLowerCase() === nameLower
  );

  return orgTournaments;
};

export function useOrganizationTournaments(orgName) {
  return useQuery({
    queryKey: ['organizationTournaments', orgName],
    queryFn: () => fetchOrganizationTournaments(orgName),
    enabled: !!orgName,
  });
}
