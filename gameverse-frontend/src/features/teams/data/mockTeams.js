export const MOCK_TEAMS = [
  {
    id: "team-local-001",
    name: "Hydra Reborn",
    tag: "HDRA",
    slug: "hydra-reborn",
    primaryGame: "bgmi",
    logo: null,
    banner: null,
    description: "We are an elite competitive team.",
    country: "India",
    captainId: "current-user",
    roster: [
      { id: '1', username: 'player', role: 'captain', uid: '512498721', status: 'online', inGameRole: 'IGL' },
      { id: '2', username: 'shadow_ninja', role: 'player', uid: '528919022', status: 'in-game', inGameRole: 'Assaulter' },
      { id: '3', username: 'pro_sniper', role: 'player', uid: '599812344', status: 'offline', inGameRole: 'Sniper' },
      { id: '4', username: 'medic_main', role: 'player', uid: '500192837', status: 'online', inGameRole: 'Support' },
      { id: '5', username: 'sub_hero', role: 'substitute', uid: '544812399', status: 'offline', inGameRole: 'Assaulter' }
    ],
    status: "active",
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-local-002",
    name: "Rift Hunters",
    tag: "RFTH",
    slug: "rift-hunters",
    primaryGame: "free-fire-max",
    logo: null,
    banner: null,
    description: "Hunting down the competition.",
    country: "India",
    captainId: "current-user",
    roster: [
      { id: '1', username: 'player', role: 'captain', uid: '123456789', status: 'online', inGameRole: 'IGL' },
      { id: '2', username: 'hunter_one', role: 'player', uid: '987654321', status: 'offline', inGameRole: 'Assaulter' },
      { id: '3', username: 'hunter_two', role: 'player', uid: '192837465', status: 'in-game', inGameRole: 'Sniper' },
      { id: '4', username: 'hunter_three', role: 'player', uid: '564738291', status: 'online', inGameRole: 'Support' },
      { id: '5', username: 'hunter_four', role: 'player', uid: '445566778', status: 'offline', inGameRole: 'Assaulter' },
      { id: '6', username: 'sub_one', role: 'substitute', uid: '998877665', status: 'online', inGameRole: 'Sniper' },
      { id: '7', username: 'sub_two', role: 'substitute', uid: '223344556', status: 'offline', inGameRole: 'Support' }
    ],
    status: "active",
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];
export const mockCreateTeam = (teamData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let baseSlug = teamData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let slug = baseSlug;
      let counter = 1;
      while (MOCK_TEAMS.some(t => t.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const newTeam = {
        id: `team-local-${Date.now()}`,
        ...teamData,
        slug,
        captainId: "current-user",
        roster: [],
        status: "active"
      };

      MOCK_TEAMS.push(newTeam);
      resolve(newTeam);
    }, 1500); // simulate network delay
  });
};
