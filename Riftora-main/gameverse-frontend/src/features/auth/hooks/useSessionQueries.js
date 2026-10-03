import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => authService.getSessions(),
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId) => authService.terminateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useTerminateOtherSessions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (currentSessionId) => authService.terminateOtherSessions(currentSessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
