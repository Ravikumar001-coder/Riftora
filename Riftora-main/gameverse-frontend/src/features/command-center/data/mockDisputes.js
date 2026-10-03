export const mockDisputeStatuses = [
  'Open',
  'Under Review',
  'Pending Evidence',
  'Resolved',
  'Dismissed'
];

export const mockDisputePriorities = [
  'Critical',
  'High',
  'Normal'
];

export const mockDisputeTypes = [
  'Incorrect Kill Count',
  'Incorrect Placement',
  'Room Credential Issue',
  'Unauthorized Player in Lobby',
  'Technical Issue Not Addressed',
  'Disqualification Appeal',
  'Code of Conduct Violation',
  'Organizer Conduct Complaint',
  'Other'
];

export const mockDisputes = [
  {
    disputeId: 'DSP-BGMI-0042',
    referenceNumber: 'DSP-BGMI-0042',
    teamId: 't1',
    teamName: 'Hydra Esports',
    teamTag: 'HYD',
    teamLogo: 'https://ui-avatars.com/api/?name=HYD&background=2563EB&color=fff',
    disputeType: 'Incorrect Kill Count',
    description: 'Our team had 9 kills. The screenshot shows "9K"\nin the results screen. The system currently\nshows 7 kills.\n\nPlease review the attached evidence.',
    submittedAt: new Date(Date.now() - 42 * 60000).toISOString(), // 42 mins ago
    submittedBy: 'Team Captain (HYD_Apex)',
    priority: 'High',
    status: 'Under Review',
    matchId: 'm3',
    matchName: 'Match 3',
    round: 'Round 1',
    evidence: [
      { id: 'ev1', url: 'https://picsum.photos/id/1/800/600', type: 'image', uploadedBy: 'Team Captain', uploadedAt: new Date(Date.now() - 41 * 60000).toISOString() },
      { id: 'ev2', url: 'https://picsum.photos/id/2/800/600', type: 'image', uploadedBy: 'Team Captain', uploadedAt: new Date(Date.now() - 41 * 60000).toISOString() },
      { id: 'ev3', url: 'https://picsum.photos/id/3/800/600', type: 'image', uploadedBy: 'Team Captain', uploadedAt: new Date(Date.now() - 40 * 60000).toISOString() }
    ],
    requestedResolution: 'The team requests that the kill count be corrected\nfrom 7 to 9 and the leaderboard recalculated.',
    leaderboardImpact: true,
    currentMatchImpact: true,
    assignedTo: null,
    resolutionOutcome: null,
    resolutionNote: null,
    // Detailed Result Comparison
    claimedValues: {
      kills: 9,
      placement: 2,
      points: 21
    },
    recordedValues: {
      kills: 7,
      placement: 2,
      points: 19
    },
    leaderboardDetails: {
      currentPosition: 4,
      potentialPosition: 2,
      pointDifference: 2
    },
    // Audit timeline
    auditEvents: [
      { id: 'a4', timestamp: new Date(Date.now() - 40 * 60000).toISOString(), actor: 'Tournament Director', action: 'DISPUTE_OPENED', summary: 'Tournament Director opened dispute' },
      { id: 'a3', timestamp: new Date(Date.now() - 42 * 60000).toISOString(), actor: 'Hydra Esports', action: 'DISPUTE_CREATED', summary: 'Hydra Esports submitted a dispute for Match 3 regarding the recorded kill count.', hasTechnicalDetails: true, technicalDetails: '{"disputeId": "DSP-BGMI-0042", "type": "Incorrect Kill Count"}' },
      { id: 'a2', timestamp: new Date(Date.now() - 50 * 60000).toISOString(), actor: 'System', action: 'RESULT_PUBLISHED', summary: 'Result published' },
      { id: 'a1', timestamp: new Date(Date.now() - 52 * 60000).toISOString(), actor: 'Referee', action: 'RESULT_SUBMITTED', summary: 'Referee submitted Match 3 result' }
    ],
    relatedDisputes: [
      { id: 'DSP-BGMI-0038', type: 'Incorrect Placement', status: 'Resolved — No Change' },
      { id: 'DSP-BGMI-0041', type: 'Incorrect Kill Count', status: 'Under Review' }
    ]
  },
  {
    disputeId: 'DSP-BGMI-0041',
    referenceNumber: 'DSP-BGMI-0041',
    teamId: 't2',
    teamName: 'Team Phoenix',
    teamTag: 'PHX',
    teamLogo: 'https://ui-avatars.com/api/?name=PHX&background=EF4444&color=fff',
    disputeType: 'Room Credential Issue',
    description: 'We were unable to join the lobby due to invalid password provided in the portal.',
    submittedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    submittedBy: 'Team Manager',
    priority: 'High',
    status: 'Under Review',
    matchId: 'm4',
    matchName: 'Match 4',
    round: 'Round 2',
    evidence: [],
    requestedResolution: 'Restart match or allow late entry',
    leaderboardImpact: false,
    currentMatchImpact: false,
    assignedTo: 'Priya Nair',
    resolutionOutcome: null,
    resolutionNote: null
  },
  {
    disputeId: 'DSP-BGMI-0039',
    referenceNumber: 'DSP-BGMI-0039',
    teamId: 't7',
    teamName: 'Team Storm',
    teamTag: 'STM',
    teamLogo: 'https://ui-avatars.com/api/?name=STM&background=374151&color=fff',
    disputeType: 'Disqualification Appeal',
    description: 'We were DQed for using a substitute, but the sub was registered on our official roster before the roster lock.',
    submittedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    submittedBy: 'Coach',
    priority: 'Critical',
    status: 'Pending Evidence',
    matchId: null,
    matchName: null,
    round: null,
    evidence: [],
    requestedResolution: 'Revert DQ status',
    leaderboardImpact: true,
    currentMatchImpact: true,
    assignedTo: 'Super Admin',
    resolutionOutcome: null,
    resolutionNote: 'Waiting on team to provide roster registration confirmation email.'
  },
  {
    disputeId: 'DSP-BGMI-0035',
    referenceNumber: 'DSP-BGMI-0035',
    teamId: 't4',
    teamName: 'Team Velocity',
    teamTag: 'TV',
    teamLogo: 'https://ui-avatars.com/api/?name=TV&background=F59E0B&color=fff',
    disputeType: 'Incorrect Placement',
    description: 'We placed 3rd but were given 4th place points.',
    submittedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    submittedBy: 'Player',
    priority: 'Normal',
    status: 'Resolved',
    matchId: 'm1',
    matchName: 'Match 1',
    round: 'Round 1',
    evidence: [{ id: 'ev3', url: '/placeholder.jpg', type: 'image' }],
    requestedResolution: 'Fix placement points',
    leaderboardImpact: true,
    currentMatchImpact: false,
    assignedTo: 'John Doe',
    resolutionOutcome: 'Correction Made',
    resolutionNote: 'Verified via server logs. Placement updated to 3rd.'
  },
  {
    disputeId: 'DSP-BGMI-0021',
    referenceNumber: 'DSP-BGMI-0021',
    teamId: 't8',
    teamName: 'Nova Gaming',
    teamTag: 'NV',
    teamLogo: '',
    disputeType: 'Code of Conduct Violation',
    description: 'Player from another team was toxic in all-chat.',
    submittedAt: new Date(Date.now() - 1440 * 60000).toISOString(), // 1 day ago
    submittedBy: 'Team Captain',
    priority: 'Normal',
    status: 'Dismissed',
    matchId: 'm2',
    matchName: 'Match 2',
    round: 'Round 1',
    evidence: [],
    requestedResolution: 'Warn the offending player',
    leaderboardImpact: false,
    currentMatchImpact: false,
    assignedTo: 'Jane Smith',
    resolutionOutcome: 'Dismissed',
    resolutionNote: 'Procedurally invalid. No screenshots provided to verify claim.'
  }
];
