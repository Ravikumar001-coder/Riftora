import { useQuery } from '@tanstack/react-query';
import { exploreOrganizations } from '../../../services/mockData';

const fetchOrganization = async (slug) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const org = exploreOrganizations.find((o) => o.slug === slug);
  
  if (!org) {
    throw new Error('Organization not found');
  }

  return org;
};

export function useOrganization(slug) {
  return useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
    enabled: !!slug,
  });
}
