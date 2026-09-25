import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus during development
      retry: 1, // Only retry once by default
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    },
  },
});