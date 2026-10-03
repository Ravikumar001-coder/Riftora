import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const useNotifications = (unreadOnly = false, page = 0, limit = 20) => {
  return useQuery({
    queryKey: ['notifications', unreadOnly, page, limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: getHeaders(),
        params: { unreadOnly, page, limit }
      });
      return response.data.data;
    }
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/notifications/unread-count`, {
        headers: getHeaders()
      });
      return response.data.data;
    },
    refetchInterval: 60000 // Refetch every minute as fallback
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
        headers: getHeaders()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.put(`${API_URL}/notifications/read-all`, {}, {
        headers: getHeaders()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        headers: getHeaders()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });
};
