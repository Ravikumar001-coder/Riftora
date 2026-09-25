export const mockTournamentData = {
  id: '42',
  name: 'Riftora Championship 2026',
  slug: 'riftora-championship-2026',
  game: 'BGMI',
  status: 'Upcoming', // Draft | Upcoming | Registration Open | Registration Closed | Live | Completed | Cancelled
  format: 'Squad',
  type: 'Online',
  region: 'India',
  platform: 'Mobile',
  dates: {
    start: '24 September 2026',
    end: '28 September 2026'
  },
  setupProgress: {
    completionPercentage: 75,
    completedSteps: 6,
    totalSteps: 8,
    steps: [
      { id: 'basic', label: 'Basic information', completed: true, link: '/manage/42/settings' },
      { id: 'game', label: 'Game configuration', completed: true, link: '/manage/42/settings' },
      { id: 'registration', label: 'Registration settings', completed: true, link: '/manage/42/registrations' },
      { id: 'prizes', label: 'Prize configuration', completed: true, link: '/manage/42/prizes' },
      { id: 'schedule', label: 'Schedule', completed: true, link: '/manage/42/schedule' },
      { id: 'staff', label: 'Staff assignment', completed: false, link: '/manage/42/staff' },
      { id: 'rules', label: 'Rules', completed: false, link: '/manage/42/rules' },
      { id: 'review', label: 'Final review', completed: true, link: '/manage/42/overview' }
    ]
  },
  registrations: {
    current: 48,
    capacity: 64,
    approved: 42,
    pending: 4,
    waitlisted: 2,
    rejected: 0
  },
  schedule: {
    configured: true,
    nextMatch: 'Round 2 — Match 05',
    nextMatchTime: 'Today · 7:30 PM',
    totalMatches: 24
  },
  prizes: {
    configured: true,
    totalPool: '₹1,00,000',
    distribution: [
      { place: '1st', amount: '₹50,000' },
      { place: '2nd', amount: '₹30,000' },
      { place: '3rd', amount: '₹20,000' }
    ]
  },
  staff: {
    total: 8,
    breakdown: [
      { role: 'Referees', count: 2 },
      { role: 'Moderators', count: 3 },
      { role: 'Production', count: 2 },
      { role: 'Admin', count: 1 }
    ]
  },
  configuration: {
    rules: 'Not Configured',
    matchFormat: 'Configured',
    scoringFormat: 'Configured',
    tieBreaker: 'Not Configured',
    entryRequirements: 'Configured',
    checkIn: 'Configured'
  },
  activity: [
    { id: 1, action: 'Schedule updated', user: 'Tournament Admin', time: '2 hours ago' },
    { id: 2, action: 'Prize configuration updated', user: 'Org Owner', time: 'Yesterday' },
    { id: 3, action: 'Registration settings updated', user: 'Tournament Admin', time: '2 days ago' },
    { id: 4, action: 'Tournament created', user: 'Org Owner', time: '1 week ago' }
  ],
  deadlines: [
    { id: 1, label: 'Registration closes', time: 'In 3 days', status: 'upcoming' },
    { id: 2, label: 'Check-in opens', time: 'In 4 days', status: 'upcoming' },
    { id: 3, label: 'First match', time: '24 September 2026', status: 'upcoming' }
  ],
  alerts: [
    { id: 1, type: 'warning', message: 'No staff members have been assigned.', cta: 'Assign Staff', link: '/manage/42/staff' },
    { id: 2, type: 'info', message: 'Tournament rules are incomplete.', cta: 'Add Rules', link: '/manage/42/rules' }
  ]
};
