import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

const fetchOrganizationTournaments = async (orgId) => {
  if (!orgId) return [];
  const { data } = await api.get('/v1/tournaments', {
    params: { org_id: orgId }
  });
  return data?.data || [];
};

export function useOrganizationTournaments(orgId) {
  return useQuery({
    queryKey: ['organizationTournaments', orgId],
    queryFn: () => fetchOrganizationTournaments(orgId),
    enabled: !!orgId,
  });
}
