import { useQuery } from '@tanstack/react-query';
import { organizationService } from './organization.service';

export const useAuditLogsQuery = (orgId) => {
  return useQuery({
    queryKey: ['organizations', orgId, 'audit-logs'],
    queryFn: () => organizationService.getAuditLogs(orgId),
    enabled: !!orgId,
  });
};

export const useOrganizationQuery = (orgId) => {
  return useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => organizationService.getOrganization(orgId),
    enabled: !!orgId,
  });
};

export const useOrganizationBySlugQuery = (orgSlug) => {
  return useQuery({
    queryKey: ['organizations', 'slug', orgSlug],
    queryFn: () => organizationService.getOrganizationBySlug(orgSlug),
    enabled: !!orgSlug,
  });
};

export const useOrganizationBySubdomainQuery = (subdomain) => {
  return useQuery({
    queryKey: ['organizations', 'subdomain', subdomain],
    queryFn: () => organizationService.getOrganizationBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

export const useOrganizationMembersQuery = (orgId) => {
  return useQuery({
    queryKey: ['organizations', orgId, 'members'],
    queryFn: () => organizationService.getMembers(orgId),
    enabled: !!orgId,
  });
};

export const usePlansQuery = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => organizationService.getPlans(),
  });
};

export const useDashboardStatsQuery = (orgId) => {
  return useQuery({
    queryKey: ['organizations', orgId, 'dashboard-stats'],
    queryFn: () => organizationService.getDashboardStats(orgId),
    enabled: !!orgId,
  });
};

