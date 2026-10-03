export const mockAnalyticsData = {
  summary: {
    totalTournaments: {
      value: 24,
      trend: 4.2,
      trendType: 'up'
    },
    totalRegistrations: {
      value: 1842,
      trend: 18.7,
      trendType: 'up'
    },
    totalParticipants: {
      value: 1420,
      trend: 12.4,
      trendType: 'up'
    },
    activeTournaments: {
      value: 3,
      trend: 0,
      trendType: 'neutral'
    },
    completedTournaments: {
      value: 18,
      trend: 0,
      trendType: 'neutral'
    },
    avgRegistrations: {
      value: 76.8,
      trend: 5.1,
      trendType: 'up'
    }
  },
  registrationTrend: [
    { date: 'Sep 1', count: 12 },
    { date: 'Sep 5', count: 45 },
    { date: 'Sep 10', count: 86 },
    { date: 'Sep 15', count: 142 }, // Peak day
    { date: 'Sep 20', count: 98 },
    { date: 'Sep 25', count: 120 },
    { date: 'Sep 30', count: 65 }
  ],
  registrationStats: {
    total: 1842,
    avgPerDay: 61.4,
    peakDay: 142,
    growth: 18.7
  },
  tournamentPerformance: [
    {
      id: 'rift-clash-s1',
      name: 'Rift Clash Season 1',
      registrations: 420,
      participants: 350,
      engagement: 84,
      capacity: 500,
      status: 'Healthy'
    },
    {
      id: 'arena-masters',
      name: 'Arena Masters',
      registrations: 310,
      participants: 274,
      engagement: 88,
      capacity: 320,
      status: 'Nearly full'
    },
    {
      id: 'battle-royale-cup',
      name: 'Battle Royale Cup',
      registrations: 280,
      participants: 231,
      engagement: 82,
      capacity: 300,
      status: 'Healthy'
    },
    {
      id: 'free-fire-weekend',
      name: 'Free Fire Weekend Clash',
      registrations: 120,
      participants: 100,
      engagement: 83,
      capacity: 256,
      status: 'Under capacity'
    }
  ],
  gameDistribution: [
    { game: 'BGMI', percentage: 45, count: 12, registrations: 920, participants: 720 },
    { game: 'Free Fire MAX', percentage: 30, count: 7, registrations: 540, participants: 430 },
    { game: 'PUBG', percentage: 15, count: 3, registrations: 210, participants: 170 },
    { game: 'Valorant', percentage: 10, count: 2, registrations: 172, participants: 100 }
  ],
  participation: {
    uniqueParticipants: 1420,
    returningPercentage: 68,
    newPercentage: 32,
    teams: 355
  },
  activity: [
    {
      id: 'act-1',
      tournament: 'Rift Clash Season 1',
      action: 'Registration opened',
      time: '12 minutes ago',
      type: 'registration'
    },
    {
      id: 'act-2',
      tournament: 'Arena Masters',
      action: 'Tournament published',
      time: '2 hours ago',
      type: 'publish'
    },
    {
      id: 'act-3',
      tournament: 'Battle Royale Cup',
      action: 'Schedule updated',
      time: 'Yesterday',
      type: 'schedule'
    }
  ],
  insights: [
    {
      id: 'ins-1',
      title: 'Strong registration growth',
      description: 'Registrations increased 18.7% compared with the previous period.',
      type: 'positive'
    },
    {
      id: 'ins-2',
      title: 'BGMI is your most active game',
      description: 'BGMI accounts for 45% of tournament registrations.',
      type: 'neutral'
    },
    {
      id: 'ins-3',
      title: 'Capacity opportunity',
      description: 'Two upcoming tournaments are currently below 50% registration capacity.',
      type: 'warning'
    }
  ],
  attention: [
    {
      id: 'att-1',
      message: '1 tournament below 50% capacity',
      action: 'Review Tournament',
      link: '/organizations/orgSlug/manage/tournaments'
    },
    {
      id: 'att-2',
      message: 'Arena Masters starting within 24 hours',
      action: 'View Operations',
      link: '/organizations/orgSlug/manage/tournaments'
    }
  ]
};
