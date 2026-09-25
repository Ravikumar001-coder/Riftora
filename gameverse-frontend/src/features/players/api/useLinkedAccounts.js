import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';

export function useLinkedAccounts() {
  const { user } = useAuthStore();
  const userId = user?.user_id || user?.userId;

  return useQuery({
    queryKey: ['linkedAccounts', userId],
    queryFn: async () => {
      const response = await api.get(`/v1/users/${userId}/linked-accounts`);
      return response.data?.data || [];
    },
    enabled: !!userId,
  });
}

export function useAddLinkedAccountMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id || user?.userId;

  return useMutation({
    mutationFn: async (accountData) => {
      const response = await api.post(`/v1/users/${userId}/linked-accounts`, accountData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', userId] });
    },
  });
}

export function useDeleteLinkedAccountMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id || user?.userId;

  return useMutation({
    mutationFn: async (linkedId) => {
      const response = await api.delete(`/v1/users/${userId}/linked-accounts/${linkedId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', userId] });
    },
  });
}

export function useGenerateChallengeMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id || user?.userId;

  return useMutation({
    mutationFn: async (linkedId) => {
      const response = await api.post(`/v1/users/${userId}/linked-accounts/${linkedId}/challenge`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', userId] });
    },
  });
}

export function useVerifyChallengeMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id || user?.userId;

  return useMutation({
    mutationFn: async (linkedId) => {
      const response = await api.post(`/v1/users/${userId}/linked-accounts/${linkedId}/verify-challenge`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', userId] });
    },
  });
}
