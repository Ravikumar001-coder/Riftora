import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export const publicOrganizationService = {
  async getDirectory() {
    const response = await api.get('/public/organizations');
    return response.data.data;
  },

  async getProfile(slug) {
    const response = await api.get(`/public/organizations/${slug}`);
    return response.data.data;
  },

  async toggleFollow(orgId) {
    const response = await api.post(`/public/organizations/${orgId}/follow`);
    return response.data.data;
  },
  
  async getIsFollowing(orgId) {
    const response = await api.get(`/public/organizations/${orgId}/is-following`);
    return response.data.data;
  }
};

export const usePublicDirectoryQuery = () => {
  return useQuery({
    queryKey: ['public', 'organizations'],
    queryFn: () => publicOrganizationService.getDirectory(),
  });
};

export const usePublicProfileQuery = (slug) => {
  return useQuery({
    queryKey: ['public', 'organizations', slug],
    queryFn: () => publicOrganizationService.getProfile(slug),
    enabled: !!slug,
  });
};

export const useIsFollowingQuery = (orgId) => {
  return useQuery({
    queryKey: ['public', 'organizations', orgId, 'is-following'],
    queryFn: () => publicOrganizationService.getIsFollowing(orgId),
    enabled: !!orgId,
  });
};

export const useToggleFollowMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orgId) => publicOrganizationService.toggleFollow(orgId),
    onSuccess: (_, orgId) => {
      queryClient.invalidateQueries({ queryKey: ['public', 'organizations', orgId, 'is-following'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'organizations'] });
    },
  });
};
