export const mockCommandCenterData = {
  tournament: {
    id: 't_123',
    name: 'BGMI Championship — Season 1',
    format: 'Battle Royale Squad',
    status: 'LIVE',
    teams: 16,
    players: 64,
    totalMatches: 8,
    startedAt: '18:30'
  },
  currentMatch: {
    id: 'm_4',
    title: 'Match 4',
    round: 'Round 2',
    group: 'Group A',
    status: 'In Progress',
    startedAt: '19:45',
    teams: 16,
    players: 64,
    map: 'Erangel'
  },
  upcomingMatches: [
    {
      id: 'm_5',
      title: 'Match 5',
      round: 'Round 2',
      group: 'Group B',
      time: '20:15',
      teams: 16,
      status: 'Scheduled',
      map: 'Miramar'
    },
    {
      id: 'm_6',
      title: 'Match 6',
      round: 'Round 3',
      group: 'Finals',
      time: '21:30',
      teams: 16,
      status: 'Pending',
      map: 'Sanhok'
    }
  ],
  checkIn: {
    checkedInTeams: 14,
    totalTeams: 16,
    percentage: 87.5,
    latestTeam: 'Team Phoenix',
    latestTime: '19:38'
  },
  scoring: {
    completedMatches: 3,
    verified: 2,
    awaitingVerification: 1,
    lastResultMatch: 'Match 3'
  },
  leaderboard: [
    { rank: 1, team: 'Team Phoenix', placement: 34, kills: 50, total: 84 },
    { rank: 2, team: 'Cyber Ninjas', placement: 40, kills: 36, total: 76 },
    { rank: 3, team: 'Shadow Wolves', placement: 28, kills: 43, total: 71 },
    { rank: 4, team: 'Titan Esports', placement: 32, kills: 32, total: 64 },
    { rank: 5, team: 'Alpha Squad', placement: 20, kills: 39, total: 59 }
  ],
  disputes: {
    open: 2,
    highPriority: 1,
    items: [
      { id: '#DSP-104', match: 'Match 3', reason: 'Score discrepancy', priority: 'High' },
      { id: '#DSP-103', match: 'Match 2', reason: 'Player eligibility question', priority: 'Medium' }
    ]
  },
  activities: [
    { time: '19:42', text: 'Match 3 result submitted' },
    { time: '19:38', text: 'Team Phoenix completed check-in' },
    { time: '19:31', text: 'Match 4 moved to Live' },
    { time: '19:25', text: 'Dispute #DSP-103 opened' },
    { time: '19:12', text: 'Match 3 started' }
  ],
  alerts: [
    { type: 'warning', text: '2 teams haven\'t checked in' },
    { type: 'critical', text: 'Match 3 result pending verification' },
    { type: 'info', text: '1 dispute requires organizer review' },
    { type: 'success', text: 'Match 2 verified' }
  ],
  progress: [
    { title: 'Round 1', status: 'completed' },
    { title: 'Round 2', status: 'live' },
    { title: 'Round 3', status: 'pending' },
    { title: 'Finale', status: 'pending' }
  ]
};
