import { mockCheckInTeams } from './mockCheckIn';

export const mockResultEntryMatch = {
  id: 'm_3',
  displayNumber: '#03',
  tournamentId: 't_123',
  game: 'BGMI',
  gameMode: 'Squad',
  round: 'Round 2',
  stage: 'Group Stage',
  lobbyName: 'Lobby A',
  expectedTeamCount: 16,
  status: 'AWAITING_RESULTS', // Draft state initially
  
  // Scoring rules for calculation
  scoringRules: {
    placementPoints: {
      1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 4, 7: 2, 8: 1, 9: 1, 10: 1,
      11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0
    },
    killMultiplier: 1,
    bonusPoints: 0
  },

  // Initialize empty results for all teams
  teams: mockCheckInTeams.map((t, index) => ({
    teamId: t.id,
    teamName: t.name,
    shortCode: t.name.substring(0, 3).toUpperCase(),
    captain: t.captain,
    slot: `Slot ${(index + 1).toString().padStart(2, '0')}`,
    placement: '',
    kills: '',
  }))
};
