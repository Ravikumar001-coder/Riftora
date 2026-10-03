import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api'; // Or standard axios instance
import { toast } from 'sonner';

export const useGetTeamRegistrations = (teamId) => {
  return useQuery({
    queryKey: ['team-registrations', teamId],
    queryFn: async () => {
      if (!teamId) return null;
      const response = await api.get(`/registrations/team/${teamId}`);
      return response.data.data;
    },
    enabled: !!teamId,
  });
};

export const useGetRegistrationById = (registrationId) => {
  return useQuery({
    queryKey: ['registration', registrationId],
    queryFn: async () => {
      if (!registrationId) return null;
      const response = await api.get(`/registrations/${registrationId}`);
      return response.data.data;
    },
    enabled: !!registrationId,
  });
};

export const useGetMyRegistrationForTournament = (tournamentId) => {
  return useQuery({
    queryKey: ['my-registration', tournamentId],
    queryFn: async () => {
      if (!tournamentId) return null;
      const response = await api.get(`/registrations/tournament/${tournamentId}/my-registration`);
      return response.data.data;
    },
    enabled: !!tournamentId,
  });
};

export const useGetRegistrationRoster = (registrationId) => {
  return useQuery({
    queryKey: ['registration-roster', registrationId],
    queryFn: async () => {
      if (!registrationId) return null;
      const response = await api.get(`/registrations/${registrationId}/roster`);
      return response.data.data;
    },
    enabled: !!registrationId,
  });
};

export const useRegisterTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/registrations', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team-registrations']);
      toast.success('Registration started successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to start registration');
    }
  });
};

export const useSubmitRules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registrationId) => {
      const response = await api.post(`/registrations/${registrationId}/rules`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team-registrations']);
    },
    onError: (error) => {
      toast.error('Failed to submit rules');
    }
  });
};

export const useProcessMockPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ registrationId, paymentMethod }) => {
      const response = await api.post(`/registrations/${registrationId}/payment/mock`, { paymentMethod });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team-registrations']);
    },
    onError: (error) => {
      toast.error('Payment simulation failed');
    }
  });
};

export const useConfirmRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registrationId) => {
      const response = await api.post(`/registrations/${registrationId}/confirm`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team-registrations']);
      toast.success('Registration confirmed!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to confirm registration');
    }
  });
};

export const useWithdrawRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registrationId) => {
      const response = await api.post(`/registrations/${registrationId}/withdraw`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team-registrations']);
      toast.success('Withdrawn from tournament');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to withdraw');
    }
  });
};
