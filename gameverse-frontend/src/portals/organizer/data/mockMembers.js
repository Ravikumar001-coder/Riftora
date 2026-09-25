export const mockMembers = [
  {
    id: 'm1',
    organizationSlug: 'hydra-esports',
    displayName: 'Aarav Sharma',
    username: 'aarav',
    email: 'aarav@hydra-esports.com',
    role: 'Org Owner',
    status: 'ACTIVE',
    joinedAt: '2025-08-12T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
    tournamentCount: 12
  },
  {
    id: 'm2',
    organizationSlug: 'hydra-esports',
    displayName: 'Neha Gupta',
    username: 'neha_g',
    email: 'neha@hydra-esports.com',
    role: 'Org Admin',
    status: 'ACTIVE',
    joinedAt: '2025-09-01T14:30:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tournamentCount: 8
  },
  {
    id: 'm3',
    organizationSlug: 'hydra-esports',
    displayName: 'Rohan Mehta',
    username: 'rohanM',
    email: 'rohan.mehta@example.com',
    role: 'Tournament Director',
    status: 'ACTIVE',
    joinedAt: '2026-01-15T09:15:00Z',
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tournamentCount: 15
  },
  {
    id: 'm4',
    organizationSlug: 'hydra-esports',
    displayName: 'Priya Singh',
    username: 'priya_s',
    email: 'priya.singh@example.com',
    role: 'Staff',
    status: 'PENDING',
    joinedAt: '2026-08-30T16:45:00Z',
    lastActiveAt: null,
    tournamentCount: 0
  },
  {
    id: 'm5',
    organizationSlug: 'hydra-esports',
    displayName: 'Vikram Joshi',
    username: 'vikramJ',
    email: 'vikram.j@example.com',
    role: 'Staff',
    status: 'ACTIVE',
    joinedAt: '2026-02-20T11:20:00Z',
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tournamentCount: 3
  },
  {
    id: 'm6',
    organizationSlug: 'hydra-esports',
    displayName: 'Karan Patel',
    username: 'karan_p',
    email: 'karan.patel@example.com',
    role: 'Viewer',
    status: 'INACTIVE',
    joinedAt: '2025-11-11T13:00:00Z',
    lastActiveAt: '2026-04-01T10:00:00Z',
    tournamentCount: 1
  },
  {
    id: 'm7',
    organizationSlug: 'hydra-esports',
    displayName: 'Anjali Desai',
    username: 'anjali_d',
    email: 'anjali.desai@example.com',
    role: 'Org Admin',
    status: 'PENDING',
    joinedAt: '2026-09-08T09:00:00Z',
    lastActiveAt: null,
    tournamentCount: 0
  },
  {
    id: 'm8',
    organizationSlug: 'riftora-esports',
    displayName: 'Riftora Admin',
    username: 'riftora_admin',
    email: 'admin@riftora.com',
    role: 'Org Owner',
    status: 'ACTIVE',
    joinedAt: '2025-01-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    tournamentCount: 0
  }
];
