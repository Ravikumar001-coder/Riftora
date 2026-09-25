export const mockPlatformOverview = {
  activeOrganizations: { value: 1284, growth: 8.4 },
  totalTournaments: { value: 4672, growth: 12.7 },
  registeredUsers: { value: 84291, growth: 15.2 },
  gmv: { value: 18400000, growth: 18.6 }, // 1.84 Cr
  platformFeeRevenue: { value: 1020000, growth: 14.3 }, // 10.2 L
  activeWebSocketConnections: { value: 8421, status: 'Healthy' },
  uptime: { value: 99.97, target: 99.9 },
  apiLatency: { p50: 82, p95: 214, p99: 480 }
};

export const mockTournamentStatusOverview = [
  { status: 'LIVE', count: 42, color: 'bg-red-500' },
  { status: 'REGISTRATION OPEN', count: 186, color: 'bg-blue-500' },
  { status: 'CHECK-IN', count: 11, color: 'bg-amber-500' },
  { status: 'COMPLETED', count: 3842, color: 'bg-emerald-500' },
  { status: 'DRAFT', count: 420, color: 'bg-slate-500' },
  { status: 'CANCELLED', count: 91, color: 'bg-slate-700' }
];

export const mockLiveTournaments = [
  { id: 'bgmi-masters-league', name: 'BGMI Masters League', org: 'Hydra Events', game: 'BGMI', state: 'LIVE', teams: '64/64', matches: '3/8', started: '12:30 PM' },
  { id: 'valorant-champions-tour', name: 'Valorant Champions Tour', org: 'Riot India', game: 'Valorant', state: 'LIVE', teams: '16/16', matches: '1/3', started: '01:00 PM' },
  { id: 'free-fire-invitational', name: 'Free Fire Invitational', org: 'Esports Wala', game: 'Free Fire', state: 'CHECK-IN', teams: '48/100', matches: '0/5', started: 'Pending' },
  { id: 'pokemon-unite-cup', name: 'Pokemon Unite Cup', org: 'Global Esports', game: 'Pokemon Unite', state: 'LIVE', teams: '8/8', matches: '4/4', started: '10:00 AM' }
];

export const mockRevenueTrend = [
  { month: 'Jan', gmv: 12000000, fees: 600000 },
  { month: 'Feb', gmv: 13500000, fees: 675000 },
  { month: 'Mar', gmv: 12800000, fees: 640000 },
  { month: 'Apr', gmv: 15000000, fees: 750000 },
  { month: 'May', gmv: 16200000, fees: 810000 },
  { month: 'Jun', gmv: 18400000, fees: 920000 }
];

export const mockRevenueByPlan = [
  { plan: 'Free', gmv: 1200000, fees: 96000, orgs: 850 },
  { plan: 'Starter', gmv: 2800000, fees: 168000, orgs: 250 },
  { plan: 'Pro', gmv: 5400000, fees: 270000, orgs: 120 },
  { plan: 'Elite', gmv: 7000000, fees: 280000, orgs: 50 },
  { plan: 'Enterprise', gmv: 2000000, fees: 100000, orgs: 14 }
];

export const mockUserAcquisitionFunnel = [
  { stage: 'Visitors', count: 245000, dropoff: null },
  { stage: 'Registrations', count: 31360, dropoff: 12.8 },
  { stage: 'First Tournament Viewed', count: 21453, dropoff: 68.4 },
  { stage: 'First Registration Submitted', count: 6801, dropoff: 31.7 },
  { stage: 'First Tournament Participated', count: 5054, dropoff: 74.2 }
];

export const mockTopOrganizations = [
  { rank: 1, orgName: 'Hydra Esports Events', tournaments: 84, gmv: 1840000, fees: 92000, growth: 21 },
  { rank: 2, orgName: 'Global Esports', tournaments: 52, gmv: 1420000, fees: 71000, growth: 15 },
  { rank: 3, orgName: 'S8UL Events', tournaments: 64, gmv: 1250000, fees: 62500, growth: 8 },
  { rank: 4, orgName: 'Velocity Gaming', tournaments: 30, gmv: 980000, fees: 49000, growth: 12 },
  { rank: 5, orgName: 'Revenant Esports', tournaments: 45, gmv: 850000, fees: 42500, growth: 5 }
];

export const mockPlatformAlerts = [
  { id: 1, severity: 'warning', title: 'Pending Organizations', description: '3 organizations pending KYC review.', count: 3, actionLabel: 'Review Orgs', route: '/admin/organizations' },
  { id: 2, severity: 'critical', title: 'Escalated Disputes', description: '2 disputes require Super Admin intervention.', count: 2, actionLabel: 'Review Disputes', route: '/admin/disputes' },
  { id: 3, severity: 'critical', title: 'Failed Prize Payouts', description: '4 automated prize payouts failed to process.', count: 4, actionLabel: 'View Finance', route: '/admin/dashboard' },
  { id: 4, severity: 'warning', title: 'Game Configuration', description: '1 new game added requires metadata review.', count: 1, actionLabel: 'Game Catalog', route: '/admin/games' }
];

export const mockRecentActivity = [
  { id: 1, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), actor: 'Hydra Events', event: 'Tournament published', entity: 'BGMI Masters League', status: 'Success' },
  { id: 2, timestamp: new Date(Date.now() - 12 * 60000).toISOString(), actor: 'Priya Nair', event: 'Dispute escalated', entity: 'Match 14 Result', status: 'Action Required' },
  { id: 3, timestamp: new Date(Date.now() - 45 * 60000).toISOString(), actor: 'System', event: 'Payout completed', entity: '₹7,500 to Storm Squad', status: 'Success' },
  { id: 4, timestamp: new Date(Date.now() - 120 * 60000).toISOString(), actor: 'Global Esports', event: 'Organization created', entity: 'Global Esports Org', status: 'Pending Review' },
  { id: 5, timestamp: new Date(Date.now() - 150 * 60000).toISOString(), actor: 'Riot Games', event: 'Game added', entity: 'Valorant Console', status: 'Success' }
];

export const mockApiPerformanceChart = [
  { time: '10:00', p50: 75, p95: 180, p99: 380 },
  { time: '10:30', p50: 78, p95: 195, p99: 420 },
  { time: '11:00', p50: 82, p95: 214, p99: 480 },
  { time: '11:30', p50: 80, p95: 190, p99: 450 },
  { time: '12:00', p50: 85, p95: 250, p99: 550 }, // Slight spike
  { time: '12:30', p50: 78, p95: 190, p99: 421 }
];
