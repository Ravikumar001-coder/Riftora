export const MOCK_TOURNAMENTS = Array.from({ length: 48 }).map((_, index) => {
  const games = ['BGMI', 'Free Fire MAX', 'Valorant', 'COD Mobile', 'PUBG'];
  const tiers = ['Community', 'Invitational', 'Open', 'Pro'];
  const statuses = [
    'DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED',
    'CHECK_IN', 'LIVE', 'COMPLETED', 'ARCHIVED', 'POSTPONED', 'CANCELLED'
  ];
  
  const orgs = [
    { name: 'Hydra Esports', slug: 'hydra-esports', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=hydra&backgroundColor=0f172a' },
    { name: 'Storm Gaming', slug: 'storm-gaming', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=storm&backgroundColor=0f172a' },
    { name: 'Titan Esports', slug: 'titan-esports', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=titan&backgroundColor=0f172a' },
    { name: 'Nova Competitive', slug: 'nova-comp', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nova&backgroundColor=0f172a' },
    { name: 'Rift Arena', slug: 'rift-arena', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=rift&backgroundColor=0f172a' }
  ];

  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const game = games[Math.floor(Math.random() * games.length)];
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  const org = orgs[Math.floor(Math.random() * orgs.length)];
  
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90) - 10);
  
  const startDate = new Date(createdDate);
  startDate.setDate(startDate.getDate() + 15);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3);

  const isFree = Math.random() > 0.6;
  const entryFee = isFree ? 0 : Math.floor(Math.random() * 10) * 100 + 100;
  
  const prizePool = Math.floor(Math.random() * 50) * 10000;
  
  const capacities = [16, 32, 64, 128];
  const capacity = capacities[Math.floor(Math.random() * capacities.length)];
  
  // Logic for registered teams based on status
  let registeredTeams = 0;
  if (['REGISTRATION_CLOSED', 'CHECK_IN', 'LIVE', 'COMPLETED', 'ARCHIVED'].includes(status)) {
    registeredTeams = capacity; 
  } else if (status === 'REGISTRATION_OPEN') {
    registeredTeams = Math.floor(Math.random() * capacity);
  } else if (['POSTPONED', 'CANCELLED'].includes(status)) {
    registeredTeams = Math.floor(Math.random() * capacity);
  }

  return {
    id: `tour-${index + 1}`,
    name: `${org.name} ${game} Championship ${index + 1}`,
    slug: `${org.slug}-${game.toLowerCase().replace(' ', '-')}-${index + 1}`,
    logo: `https://api.dicebear.com/7.x/shapes/svg?seed=tour${index}&backgroundColor=1e293b`,
    organization: org,
    game,
    tier,
    status,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    registrationOpenAt: createdDate.toISOString(),
    registrationCloseAt: startDate.toISOString(),
    entryFee,
    registeredTeams,
    teamCapacity: capacity,
    prizePool,
    format: 'Battle Royale',
    teamsPerMatch: 16,
    rounds: 3,
    matchesPerRound: 4,
    scoringSystem: 'Standard Points',
    checkInRequired: true,
    publicVisible: !['DRAFT'].includes(status),
    cancellationReason: status === 'CANCELLED' ? 'Violation of terms' : null,
    createdAt: createdDate.toISOString(),
    updatedAt: new Date().toISOString(),
    
    activity: [
      {
        id: `act-${index}-1`,
        timestamp: createdDate.toISOString(),
        event: 'Tournament published',
        actor: 'Organizer'
      },
      {
        id: `act-${index}-2`,
        timestamp: new Date(createdDate.getTime() + 86400000).toISOString(),
        event: 'Registration opened',
        actor: 'System'
      }
    ]
  };
});
