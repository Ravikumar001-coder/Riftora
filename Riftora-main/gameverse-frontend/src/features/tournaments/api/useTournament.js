import { useQuery } from '@tanstack/react-query';
import { exploreTournaments } from '../../../services/mockData';

// Fetch tournament by slug
export function useTournament(tournamentSlug) {
  return useQuery({
    queryKey: ['tournament', tournamentSlug],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const tournament = exploreTournaments.find(
        (t) => t.slug === tournamentSlug || t.id === tournamentSlug
      );
      
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      
      return tournament;
    },
    enabled: !!tournamentSlug,
    retry: false, // Don't retry on 404s
  });
}
