const nextMatchTime = new Date(new Date().getTime() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000 + 12 * 1000);

export const playerDashboardData = {
  player: {
    level: 12,
    status: 'Active Player',
    game: 'BGMI',
    region: 'India',
    team: 'Team Phoenix',
    tournaments: 12,
    matches: 48,
    wins: 7,
    points: 2840,
  },
  stats: {
    upcomingMatches: 3,
    registeredTournaments: 8,
    matchesThisSeason: 24,
    regionalRanking: 128,
  },
  nextMatch: {
    id: 'm123',
    tournamentId: 't1',
    tournamentName: 'Riftora Championship',
    game: 'BGMI',
    matchType: 'BATTLE_ROYALE',
    stage: 'Semi-Finals • Day 2',
    matchNumber: 3,
    groupInfo: 'Group A vs Group B',
    mapName: 'Erangel',
    mode: 'TPP Squad',
    myTeam: 'Team Phoenix',
    date: nextMatchTime.toISOString(),
    lobby: 4,
    yourSlot: 14,
    totalSlots: 16,
    status: 'Scheduled',
    checkInRequired: true,
    checkInOpen: true,
    checkedIn: false
  },
  myTeam: {
    id: 'team-phoenix',
    name: 'Team Phoenix',
    game: 'BGMI',
    members: [
      { id: 'p1', username: 'Ravi', role: 'Captain' },
      { id: 'p2', username: 'Arjun', role: 'Player' },
      { id: 'p3', username: 'Aman', role: 'Player' },
      { id: 'p4', username: 'Karan', role: 'Player' },
      { id: 'p5', username: 'Rahul', role: 'Substitute' },
    ],
    maxMembers: 5
  },
  upcomingMatches: [
    {
      id: 'm123',
      date: 'Today',
      time: nextMatchTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      tournament: 'Riftora Championship',
      round: 'Round 3 • Match #12',
      team: 'Team Phoenix',
      status: 'Scheduled'
    },
    {
      id: 'm124',
      date: 'Tomorrow',
      time: '6:00 PM',
      tournament: 'Battle Arena',
      round: 'Quarter Final',
      team: 'Team Phoenix',
      status: 'Scheduled'
    },
    {
      id: 'm125',
      date: 'Sep 12',
      time: '8:30 PM',
      tournament: 'Pro League',
      round: 'Match #18',
      team: 'Team Phoenix',
      status: 'Scheduled'
    }
  ],
  myTournaments: [
    {
      id: 't1',
      title: 'Riftora Championship',
      game: 'BGMI',
      format: 'Squad',
      status: 'Registered',
      nextMatch: 'Today, 7:30 PM',
      progress: 80,
    }
  ],
  recentResults: [
    {
      id: 'r1',
      tournament: 'Riftora Championship',
      match: 'Match #2',
      placement: '1st',
      points: 120
    },
    {
      id: 'r2',
      tournament: 'Battle Arena',
      match: 'Match #8',
      placement: '4th',
      points: 76
    },
    {
      id: 'r3',
      tournament: 'Pro League',
      match: 'Match #3',
      placement: '7th',
      points: 42
    }
  ],
  performance: {
    averagePlacement: 4.8,
    averageKills: 6.2,
    winRate: '14.6%',
    averagePoints: 82,
    bestPlacement: '#1',
    chartData: [
      { name: 'M1', value: 65 },
      { name: 'M2', value: 80 },
      { name: 'M3', value: 95 },
      { name: 'M4', value: 85 },
      { name: 'M5', value: 90 },
      { name: 'M6', value: 77 },
    ]
  },
  recommendations: [
    {
      id: 'rec1',
      game: 'BGMI',
      title: 'Championship',
      prize: '₹50,000',
      teams: 128,
      action: 'Register'
    },
    {
      id: 'rec2',
      game: 'FREE FIRE MAX',
      title: 'Battle Arena',
      prize: '₹25,000',
      teams: 64,
      action: 'Register'
    },
    {
      id: 'rec3',
      game: 'BGMI',
      title: 'Pro League',
      prize: '₹1,00,000',
      teams: 256,
      action: 'View'
    }
  ],
  activity: [
    {
      id: 'act1',
      icon: 'bell',
      title: 'Match check-in opens in 30 minutes',
      time: '10 minutes ago'
    },
    {
      id: 'act2',
      icon: 'trophy',
      title: 'You qualified for Round 3',
      time: '2 hours ago'
    },
    {
      id: 'act3',
      icon: 'users',
      title: 'Arjun joined Team Phoenix',
      time: 'Yesterday'
    },
    {
      id: 'act4',
      icon: 'megaphone',
      title: 'Tournament schedule updated',
      time: 'Yesterday'
    }
  ]
};
