export const mockBRSchedule = {
  format: 'BATTLE_ROYALE',
  game: 'BGMI',
  teamSize: 'Squad',
  capacity: 48,
  lobbyCapacity: 16,
  progression: 'Leaderboard Based',
  status: 'Draft',
  days: [
    {
      id: 'day_1',
      name: 'DAY 1 — QUALIFIERS',
      order: 1,
      date: '2026-09-24',
      isExpanded: true,
      matches: [
        {
          id: 'br_m_1',
          matchNumber: '01',
          scheduledAt: '2026-09-24T10:00:00',
          duration: '30-35m',
          map: 'Erangel',
          mode: 'TPP • SQUAD',
          status: 'Scheduled',
          groups: ['Group A', 'Group B'],
          lobby: {
            id: 'CUSTOM ROOM #01',
            roomId: '8849102',
            password: 'pass123', // masked in UI
            visibility: 'Hidden until 15 min before match',
            server: 'Asia',
            status: 'Ready'
          },
          slots: 16,
          filledSlots: 16,
          teams: [
            { id: 'T1', name: 'Storm Squad' },
            { id: 'T2', name: 'Hydra Esports' },
            { id: 'T3', name: 'Phoenix Rising' },
            { id: 'T4', name: 'Cyber Ninjas' },
            { id: 'T5', name: 'Neon Dragons' },
            { id: 'T6', name: 'Iron Wolves' },
            { id: 'T7', name: 'Cosmic Rays' },
            { id: 'T8', name: 'Quantum Force' },
            { id: 'T9', name: 'Alpha Warriors' },
            { id: 'T10', name: 'Team Velocity' }
          ]
        },
        {
          id: 'br_m_2',
          matchNumber: '02',
          scheduledAt: '2026-09-24T10:40:00',
          duration: '30-35m',
          map: 'Miramar',
          mode: 'TPP • SQUAD',
          status: 'Scheduled',
          groups: ['Group B', 'Group C'],
          lobby: {
            id: 'CUSTOM ROOM #02',
            roomId: '8849103',
            password: 'pass124',
            visibility: 'Hidden until 15 min before match',
            server: 'Asia',
            status: 'Pending Credentials'
          },
          slots: 16,
          filledSlots: 16,
          teams: []
        },
        {
          id: 'br_m_3',
          matchNumber: '03',
          scheduledAt: '2026-09-24T10:40:00', // Conflict example
          duration: '30-35m',
          map: 'Erangel',
          mode: 'TPP • SQUAD',
          status: 'Scheduled',
          groups: ['Group A', 'Group C'],
          lobby: {
            id: 'CUSTOM ROOM #02', // Conflict example: same lobby, same time
            roomId: '8849103',
            password: 'pass124',
            visibility: 'Hidden until 15 min before match',
            server: 'Asia',
            status: 'Pending Credentials'
          },
          slots: 16,
          filledSlots: 16,
          teams: []
        }
      ]
    },
    {
      id: 'day_2',
      name: 'DAY 2 — SEMI FINALS',
      order: 2,
      date: '2026-09-25',
      isExpanded: false,
      matches: []
    },
    {
      id: 'day_3',
      name: 'DAY 3 — GRAND FINAL',
      order: 3,
      date: '2026-09-26',
      isExpanded: false,
      matches: []
    }
  ],
  groups: [
    { name: 'Group A', teamsCount: 8, matchesCount: 3 },
    { name: 'Group B', teamsCount: 8, matchesCount: 3 },
    { name: 'Group C', teamsCount: 8, matchesCount: 3 },
    { name: 'Group D', teamsCount: 8, matchesCount: 3 },
    { name: 'Group E', teamsCount: 8, matchesCount: 3 },
    { name: 'Group F', teamsCount: 8, matchesCount: 3 }
  ],
  metrics: {
    tournamentDays: 3,
    rounds: 3,
    totalLobbies: 18,
    teams: 48,
    qualifiers: 'Top 8',
    matchDuration: '~30-35 min'
  }
};

export const mockSchedule = {
  // Original Head-to-Head structure preserved for backward compatibility
  status: 'Draft',
  totalRounds: 4,
  rounds: []
};
