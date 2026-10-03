export const mockRegistrations = [
  {
    id: 'REG-00042',
    tournamentId: '42',
    type: 'Squad',
    status: 'Approved',
    submittedAt: '09 Sep 2026',
    team: {
      id: 'TM-001',
      name: 'Team Phoenix',
      tag: 'PHX',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TP&backgroundColor=ef4444'
    },
    captain: {
      name: 'Alex Johnson',
      username: 'AlexJ',
      email: 'alex.j@example.com'
    },
    members: [
      { name: 'Alex Johnson', role: 'Captain' },
      { name: 'Sarah Miller', role: 'Player 2' },
      { name: 'David Chen', role: 'Player 3' },
      { name: 'Emma Wilson', role: 'Player 4' }
    ],
    verification: {
      profileComplete: true,
      eligibilityMet: true,
      manualReviewRequired: false
    },
    checkIn: 'Checked In'
  },
  {
    id: 'REG-00043',
    tournamentId: '42',
    type: 'Squad',
    status: 'Pending',
    submittedAt: '10 Sep 2026',
    team: {
      id: 'TM-002',
      name: 'Cyber Ninjas',
      tag: 'CYN',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CN&backgroundColor=3b82f6'
    },
    captain: {
      name: 'Michael Chang',
      username: 'MikeC',
      email: 'mike.c@example.com'
    },
    members: [
      { name: 'Michael Chang', role: 'Captain' },
      { name: 'Lisa Ray', role: 'Player 2' },
      { name: 'Tom Hardy', role: 'Player 3' },
      { name: 'Zoe Kravitz', role: 'Player 4' }
    ],
    verification: {
      profileComplete: true,
      eligibilityMet: false,
      manualReviewRequired: true
    },
    checkIn: 'Not Checked In'
  },
  {
    id: 'REG-00044',
    tournamentId: '42',
    type: 'Squad',
    status: 'Waitlisted',
    submittedAt: '11 Sep 2026',
    team: {
      id: 'TM-003',
      name: 'Neon Dragons',
      tag: 'NDG',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ND&backgroundColor=10b981'
    },
    captain: {
      name: 'Chris Evans',
      username: 'Cap',
      email: 'chris.e@example.com'
    },
    members: [
      { name: 'Chris Evans', role: 'Captain' },
      { name: 'Scarlett J.', role: 'Player 2' },
      { name: 'Mark R.', role: 'Player 3' },
      { name: 'Jeremy R.', role: 'Player 4' }
    ],
    verification: {
      profileComplete: true,
      eligibilityMet: true,
      manualReviewRequired: false
    },
    checkIn: 'Not Checked In'
  },
  {
    id: 'REG-00045',
    tournamentId: '42',
    type: 'Squad',
    status: 'Rejected',
    submittedAt: '08 Sep 2026',
    team: {
      id: 'TM-004',
      name: 'Iron Wolves',
      tag: 'IRW',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IW&backgroundColor=64748b'
    },
    captain: {
      name: 'Tony Stark',
      username: 'IronMan',
      email: 'tony@example.com'
    },
    members: [
      { name: 'Tony Stark', role: 'Captain' },
      { name: 'Bruce Banner', role: 'Player 2' }
    ],
    verification: {
      profileComplete: false,
      eligibilityMet: false,
      manualReviewRequired: true
    },
    checkIn: 'Not Checked In',
    rejectionReason: 'Incomplete roster. Squad tournaments require exactly 4 players.'
  },
  {
    id: 'REG-00046',
    tournamentId: '42',
    type: 'Squad',
    status: 'Approved',
    submittedAt: '07 Sep 2026',
    team: {
      id: 'TM-005',
      name: 'Cosmic Rays',
      tag: 'CSR',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CR&backgroundColor=8b5cf6'
    },
    captain: {
      name: 'Reed Richards',
      username: 'MrFantastic',
      email: 'reed@example.com'
    },
    members: [
      { name: 'Reed Richards', role: 'Captain' },
      { name: 'Sue Storm', role: 'Player 2' },
      { name: 'Johnny Storm', role: 'Player 3' },
      { name: 'Ben Grimm', role: 'Player 4' }
    ],
    verification: {
      profileComplete: true,
      eligibilityMet: true,
      manualReviewRequired: false
    },
    checkIn: 'Checked In'
  },
  {
    id: 'REG-00047',
    tournamentId: '42',
    type: 'Squad',
    status: 'Pending',
    submittedAt: '12 Sep 2026',
    team: {
      id: 'TM-006',
      name: 'Quantum Force',
      tag: 'QTF',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=QF&backgroundColor=eab308'
    },
    captain: {
      name: 'Hank Pym',
      username: 'AntMan',
      email: 'hank@example.com'
    },
    members: [
      { name: 'Hank Pym', role: 'Captain' },
      { name: 'Janet V.D.', role: 'Player 2' },
      { name: 'Scott Lang', role: 'Player 3' },
      { name: 'Hope V.D.', role: 'Player 4' }
    ],
    verification: {
      profileComplete: true,
      eligibilityMet: true,
      manualReviewRequired: true
    },
    checkIn: 'Not Checked In'
  }
];
