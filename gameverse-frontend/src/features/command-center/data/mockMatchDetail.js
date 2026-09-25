import { mockCheckInTeams } from './mockCheckIn';

export const mockMatchDetail = {
  id: 'm_4',
  displayNumber: '#04',
  tournamentId: 't_123',
  game: 'BGMI',
  gameMode: 'Squad',
  round: 'Round 2',
  stage: 'Group Stage',
  phase: 'Phase 1',
  lobbyName: 'Lobby A',
  expectedTeamCount: 16,
  status: 'READY',
  scheduledStart: '18:30',
  startedAt: null,
  pausedAt: null,
  completedAt: null,
  duration: '00:00',
  operator: 'Ravi Kumar',
  operatorRole: 'Match Operator',
  operatorAssignedAt: '18:10',
  
  // Re-use teams from mockCheckIn to maintain consistency in mock data
  teams: mockCheckInTeams.map((t, index) => ({
    ...t,
    slot: `Slot ${(index + 1).toString().padStart(2, '0')}`,
  })),

  timeline: [
    { id: 1, time: '18:20', event: 'Scheduled' },
    { id: 2, time: '18:25', event: 'Check-in opened' },
    { id: 3, time: '18:38', event: 'Lobby ready' }
  ],

  notes: [
    { id: 1, time: '18:28', author: 'Karan', text: 'Team Phoenix requested a 2 minute delay due to network issue. Approved.' }
  ],

  warnings: [
    { id: 1, type: 'critical', text: 'Alpha Squad has not completed readiness.' }
  ]
};
