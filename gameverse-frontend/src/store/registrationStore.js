import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRegistrationStore = create(
  persist(
    (set, get) => ({
      registrations: [],

      addRegistration: (registration) => set((state) => {
        // Prevent duplicate registrations for the same tournament and team
        const exists = state.registrations.some(
          (r) => r.tournamentId === registration.tournamentId && r.teamId === registration.teamId
        );
        if (exists) return state;

        return {
          registrations: [...state.registrations, { ...registration, status: 'REGISTERED' }]
        };
      }),

      getRegistrationsByTournament: (tournamentId) => {
        return get().registrations.filter((r) => r.tournamentId === tournamentId);
      },

      getRegistration: (tournamentId, teamId) => {
        return get().registrations.find(
          (r) => r.tournamentId === tournamentId && r.teamId === teamId
        );
      },
    }),
    {
      name: 'riftora-registrations',
    }
  )
);
