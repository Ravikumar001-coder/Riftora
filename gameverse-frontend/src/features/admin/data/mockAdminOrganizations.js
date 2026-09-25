export const MOCK_ORGANIZATIONS = Array.from({ length: 42 }).map((_, index) => {
  const games = ['BGMI', 'Free Fire MAX', 'Valorant', 'COD Mobile', 'PUBG'];
  const plans = ['Free', 'Starter', 'Pro', 'Elite', 'Enterprise'];
  const statuses = ['Active', 'Active', 'Active', 'Suspended', 'Pending Review'];
  
  const statusesValue = statuses[Math.floor(Math.random() * statuses.length)];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));

  const isSuspended = statusesValue === 'Suspended';
  const suspendedAt = isSuspended ? new Date(Date.now() - 86400000).toISOString() : null;
  const suspensionReason = isSuspended ? 'Policy violation' : null;

  return {
    id: `org-${index + 1}`,
    name: `Esports Org ${index + 1}`,
    slug: `esports-org-${index + 1}`,
    logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${index}&backgroundColor=0f172a`,
    owner: {
      name: `Owner ${index + 1}`,
      username: `owner_${index + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=owner${index}`
    },
    primaryGame: games[Math.floor(Math.random() * games.length)],
    country: 'India',
    city: 'Mumbai',
    plan: plan,
    status: statusesValue,
    tournamentsCount: Math.floor(Math.random() * 150),
    activeTournaments: Math.floor(Math.random() * 5),
    completedTournaments: Math.floor(Math.random() * 100),
    membersCount: Math.floor(Math.random() * 250),
    teamsCount: Math.floor(Math.random() * 100),
    gmv: Math.floor(Math.random() * 5000000), // in INR
    platformFees: Math.floor(Math.random() * 500000),
    followers: Math.floor(Math.random() * 10000),
    createdAt: createdDate.toISOString(),
    suspendedAt,
    suspensionReason,
    
    // Limits based on plan
    limits: {
      tournaments: plan === 'Free' ? 4 : plan === 'Starter' ? 12 : 'Unlimited',
      teams: plan === 'Free' ? 32 : plan === 'Starter' ? 64 : plan === 'Pro' ? 128 : plan === 'Elite' ? 256 : 'Unlimited',
      members: plan === 'Free' ? 3 : plan === 'Starter' ? 8 : plan === 'Pro' ? 20 : 'Unlimited'
    },
    
    recentActivity: [
      {
        id: `act-${index}-1`,
        timestamp: new Date().toISOString(),
        event: 'Tournament published',
        actor: `Owner ${index + 1}`
      },
      {
        id: `act-${index}-2`,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        event: 'Member invited',
        actor: `Owner ${index + 1}`
      }
    ],
    
    recentTournaments: [
      {
        id: `tour-${index}-1`,
        name: `Weekly Clash ${index}`,
        game: games[Math.floor(Math.random() * games.length)],
        status: 'Completed',
        teams: 64,
        prizePool: 100000,
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  };
});
