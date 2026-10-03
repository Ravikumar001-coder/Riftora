export const organizerDashboardData = {
  organization: {
    name: 'Hydra Esports Events',
    slug: 'hydra-esports',
    role: 'Org Owner',
    totalTournaments: 12,
    staffCount: 8,
    totalParticipants: 1248
  },
  stats: {
    activeTournaments: 4,
    upcomingTournaments: 8,
    pendingRegistrations: 23,
    liveEvents: 1
  },
  nextTournament: {
    id: 't1',
    title: 'Riftora Championship',
    game: 'BGMI',
    format: 'Squad',
    maxTeams: 64,
    registeredTeams: 58,
    status: 'Registration Open',
    startAt: new Date(new Date().getTime() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000).toISOString(), // ~2.5 hrs from now
    isLive: false
  },
  actionRequired: [
    {
      id: 'ar1',
      type: 'registration',
      priority: 'high', // 'critical', 'high', 'medium', 'info'
      message: '23 registrations awaiting review',
      context: 'Riftora Championship',
      actionLabel: 'Review Registrations',
      link: '/manage/t1/registrations'
    },
    {
      id: 'ar2',
      type: 'schedule',
      priority: 'medium',
      message: 'Schedule not published',
      context: 'Battle Arena',
      actionLabel: 'Open Schedule',
      link: '/manage/t2/schedule'
    },
    {
      id: 'ar3',
      type: 'staff',
      priority: 'info',
      message: 'Staff assignment incomplete',
      context: 'Pro League',
      actionLabel: 'Assign Staff',
      link: '/manage/t3/staff'
    },
    {
      id: 'ar4',
      type: 'dispute',
      priority: 'critical',
      message: 'Dispute requires attention',
      context: 'Championship Round 2',
      actionLabel: 'Review',
      link: '/command-center/t4'
    }
  ],
  activeTournaments: [
    {
      id: 't1',
      name: 'Riftora Championship',
      status: 'LIVE',
      currentTeams: 64,
      maxTeams: 64,
      nextAction: 'Command Center',
      link: '/command-center/t1'
    },
    {
      id: 't2',
      name: 'Battle Arena',
      status: 'REGISTRATION',
      currentTeams: 48,
      maxTeams: 64,
      nextAction: 'Registrations',
      link: '/manage/t2/registrations'
    },
    {
      id: 't3',
      name: 'Pro League',
      status: 'SCHEDULED',
      currentTeams: 32,
      maxTeams: 64,
      nextAction: 'Schedule',
      link: '/manage/t3/schedule'
    },
    {
      id: 't4',
      name: 'Mobile Masters',
      status: 'DRAFT',
      currentTeams: 0,
      maxTeams: 128,
      nextAction: 'Configure',
      link: '/manage/t4/overview'
    }
  ],
  upcomingSchedule: [
    {
      id: 's1',
      date: 'Today',
      time: '07:30 PM',
      tournament: 'Riftora Championship',
      context: 'Round 3 • Match #12',
      details: '64 teams',
      link: '/command-center/t1'
    },
    {
      id: 's2',
      date: 'Today',
      time: '09:00 PM',
      tournament: 'Battle Arena',
      context: 'Registration closes',
      details: '',
      link: '/manage/t2/registrations'
    },
    {
      id: 's3',
      date: 'Tomorrow',
      time: '06:00 PM',
      tournament: 'Pro League',
      context: 'Quarter Finals',
      details: '',
      link: '/manage/t3/overview'
    },
    {
      id: 's4',
      date: 'Saturday',
      time: '08:30 PM',
      tournament: 'Mobile Masters',
      context: 'Grand Final',
      details: '',
      link: '/command-center/t4'
    }
  ],
  registrationOverview: {
    pending: 23,
    approved: 41,
    rejected: 4,
    waitlisted: 8
  },
  performance: {
    tournamentsCompleted: 28,
    totalParticipants: 1248,
    averageRegistration: 44,
    tournamentCompletion: 96
  },
  activity: [
    {
      id: 'act1',
      type: 'registration',
      title: 'Registration approved',
      context: 'Team Phoenix',
      time: '10 minutes ago',
      icon: 'check'
    },
    {
      id: 'act2',
      type: 'schedule',
      title: 'Tournament schedule updated',
      context: 'Riftora Championship',
      time: '32 minutes ago',
      icon: 'zap'
    },
    {
      id: 'act3',
      type: 'staff',
      title: 'New staff member assigned',
      context: 'Battle Arena',
      time: '1 hour ago',
      icon: 'user'
    },
    {
      id: 'act4',
      type: 'dispute',
      title: 'Dispute opened',
      context: 'Pro League • Match #8',
      time: '2 hours ago',
      icon: 'alert'
    }
  ]
};
