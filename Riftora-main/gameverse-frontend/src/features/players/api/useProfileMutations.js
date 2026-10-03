import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useAvatarUploadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/v1/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries if necessary, or just rely on Zustand store update
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
