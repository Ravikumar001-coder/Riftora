export const mockScoringMatches = [
  {
    id: 'm_1',
    displayNumber: '#01',
    round: 'Round 1',
    lobby: 'Lobby A',
    status: 'SCORED',
    expectedTeams: 16,
    resultCount: 16,
    updatedAt: '16:45 PM',
    topTeams: [
      { rank: 1, name: 'Team Phoenix', points: 23 },
      { rank: 2, name: 'Cyber Ninjas', points: 19 },
      { rank: 3, name: 'Alpha Wolves', points: 17 }
    ]
  },
  {
    id: 'm_2',
    displayNumber: '#02',
    round: 'Round 1',
    lobby: 'Lobby B',
    status: 'LOCKED',
    expectedTeams: 16,
    resultCount: 16,
    updatedAt: '17:35 PM',
    topTeams: [
      { rank: 1, name: 'Shadow Titans', points: 25 },
      { rank: 2, name: 'Velocity X', points: 18 },
      { rank: 3, name: 'Team Delta', points: 15 }
    ]
  },
  {
    id: 'm_3',
    displayNumber: '#03',
    round: 'Round 1',
    lobby: 'Lobby C',
    status: 'REVIEW_REQUIRED',
    expectedTeams: 16,
    resultCount: 16,
    updatedAt: '18:20 PM',
    warnings: ['Duplicate placement detected for Rank 4', 'Placement 5 is missing'],
    topTeams: []
  },
  {
    id: 'm_4',
    displayNumber: '#04',
    round: 'Round 2',
    lobby: 'Lobby A',
    status: 'SCORING',
    expectedTeams: 16,
    resultCount: 12,
    updatedAt: '19:15 PM',
    warnings: ['4 Results Missing'],
    topTeams: []
  },
  {
    id: 'm_5',
    displayNumber: '#05',
    round: 'Round 2',
    lobby: 'Lobby B',
    status: 'AWAITING_RESULTS',
    expectedTeams: 16,
    resultCount: 0,
    updatedAt: '20:10 PM',
    warnings: [],
    topTeams: []
  }
];

export const mockScoringRules = {
  placementPoints: "Configured (15, 12, 10...)",
  killPoints: "1 point / elimination",
  bonus: "None"
};
