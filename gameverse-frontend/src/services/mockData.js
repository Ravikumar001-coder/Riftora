// Mock Data for Landing Page Development

export const mockStats = {
  players: "10,000+",
  teams: "2,500+",
  tournaments: "500+",
  prizePools: "₹50L+"
};

export const liveTournaments = [
  {
    id: "t1",
    name: "BGMI PRO CHAMPIONSHIP",
    game: "BGMI",
    organization: "Riftora Official",
    round: "Round 3",
    match: "Match 2",
    viewers: "12,842",
    prize: "₹1,00,000",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
    status: "live"
  }
];

export const featuredTournaments = [
  {
    id: "t2",
    name: "Free Fire MAX Summer Clash",
    game: "Free Fire MAX",
    organization: "Esports Arena",
    date: "Starts Aug 15",
    slots: "42 / 64 Teams",
    entryFee: "Free",
    prize: "₹50,000",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
    status: "upcoming"
  }
];

export const leaderboardData = [
  { rank: 1, team: "Storm Squad", points: 86, kills: 42, dinners: 2, prevRank: 2 },
  { rank: 2, team: "Hydra Esports", points: 81, kills: 38, dinners: 1, prevRank: 1 },
  { rank: 3, team: "Phoenix Rising", points: 76, kills: 35, dinners: 0, prevRank: 4 },
  { rank: 4, team: "Team Velocity", points: 68, kills: 30, dinners: 1, prevRank: 3 },
  { rank: 5, team: "Alpha Warriors", points: 61, kills: 25, dinners: 0, prevRank: 6 },
];

export const exploreTournaments = [
  {
    id: "t1",
    slug: "bgmi-pro-championship",
    name: "BGMI PRO CHAMPIONSHIP",
    description: "The premier BGMI championship for professional squads. Prove your worth in the ultimate battle royale test. Expect intense competition, huge prize pools, and massive viewership.",
    game: "BGMI",
    organization: "Riftora Official",
    organizationSlug: "riftora-official",
    organizationLogo: "https://ui-avatars.com/api/?name=RO&background=2563EB&color=fff",
    status: "live",
    format: "Squad",
    tournamentType: "Invitational",
    tournamentTier: "Pro",
    region: "India",
    entryFee: 0,
    entryType: "Free",
    prizePool: 100000,
    prizePoolString: "₹1,00,000",
    teamsRegistered: 64,
    maxTeams: 64,
    teamsPerMatch: 16,
    viewers: 12842,
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
    startsAt: "2026-08-01T10:00:00Z",
    registrationClosesAt: null,
    currentMatch: {
      number: 3,
      round: "Round 2",
      status: "IN_PROGRESS"
    },
    stream: {
      type: "youtube",
      url: "https://www.youtube.com/embed/live_stream?channel=riftora"
    },
    streams: [
      { id: 's1', language: 'English', type: 'youtube', url: 'https://www.youtube.com/embed/live_stream?channel=riftora' },
      { id: 's2', language: 'Hindi', type: 'youtube', url: 'https://www.youtube.com/embed/live_stream?channel=riftora_hindi' },
      { id: 's3', language: 'Tamil', type: 'twitch', url: 'https://player.twitch.tv/?channel=riftora_tamil&parent=localhost' }
    ]
  },
  {
    id: "t2",
    slug: "free-fire-max-summer-clash",
    name: "Free Fire MAX Summer Clash",
    description: "Get ready for the hottest Free Fire MAX tournament of the summer. Fast-paced duo action.",
    game: "Free Fire MAX",
    organization: "Esports Arena",
    organizationSlug: "esports-arena",
    organizationLogo: "https://ui-avatars.com/api/?name=EA&background=8B5CF6&color=fff",
    status: "upcoming",
    format: "Duo",
    tournamentType: "Open",
    tournamentTier: "Community",
    region: "Global",
    entryFee: 0,
    entryType: "Free",
    prizePool: 50000,
    prizePoolString: "₹50,000",
    teamsRegistered: 42,
    maxTeams: 64,
    teamsPerMatch: 12,
    viewers: 0,
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
    startsAt: "2026-08-15T14:00:00Z",
    registrationClosesAt: "2026-08-14T23:59:59Z",
  },
  {
    id: "t3",
    slug: "pubg-mobile-world-invite",
    name: "PUBG Mobile World Invite",
    description: "Global showcase of the best PUBG Mobile talent. Premium entry, massive payouts.",
    game: "PUBG Mobile",
    organization: "Global Gaming",
    organizationSlug: "global-gaming",
    organizationLogo: "https://ui-avatars.com/api/?name=GG&background=10B981&color=fff",
    status: "registration_open",
    format: "Squad",
    tournamentType: "Open",
    tournamentTier: "Pro",
    region: "Global",
    entryFee: 500,
    entryType: "Paid",
    prizePool: 250000,
    prizePoolString: "₹2,50,000",
    teamsRegistered: 12,
    maxTeams: 32,
    teamsPerMatch: 16,
    viewers: 0,
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070",
    startsAt: "2026-10-01T18:00:00Z",
    registrationClosesAt: "2026-09-30T12:00:00Z",
  },
  {
    id: "t4",
    slug: "bgmi-amateur-league",
    name: "BGMI Amateur League Season 3",
    game: "BGMI",
    organization: "Community Esports",
    organizationLogo: "https://ui-avatars.com/api/?name=CE&background=F59E0B&color=fff",
    status: "registration_open",
    format: "Solo",
    region: "India",
    entryFee: 50,
    entryType: "Paid",
    prizePool: 10000,
    prizePoolString: "₹10,000",
    teamsRegistered: 85,
    maxTeams: 100,
    viewers: 0,
    banner: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=2070",
    startsAt: "2026-10-20T16:00:00Z",
    registrationClosesAt: "2026-10-19T23:59:59Z",
  },
  {
    id: "t5",
    slug: "valorant-showdown",
    name: "Valorant Radiant Showdown",
    game: "Valorant",
    organization: "Riftora Official",
    organizationLogo: "https://ui-avatars.com/api/?name=RO&background=2563EB&color=fff",
    status: "live",
    format: "Squad",
    region: "Global",
    entryFee: 0,
    entryType: "Free",
    prizePool: 500000,
    prizePoolString: "₹5,00,000",
    teamsRegistered: 16,
    maxTeams: 16,
    viewers: 45210,
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
    startsAt: "2026-08-05T12:00:00Z",
    registrationClosesAt: null,
  },
  {
    id: "t6",
    slug: "free-fire-weekend-brawl",
    name: "Free Fire Weekend Brawl",
    description: "Completed tournament. Action packed weekend.",
    game: "Free Fire MAX",
    organization: "Weekend Gamers",
    organizationSlug: "weekend-gamers",
    organizationLogo: "https://ui-avatars.com/api/?name=WG&background=EF4444&color=fff",
    status: "completed",
    format: "Squad",
    tournamentType: "Open",
    tournamentTier: "Community",
    region: "India",
    entryFee: 0,
    entryType: "Free",
    prizePool: 5000,
    prizePoolString: "₹5,000",
    teamsRegistered: 48,
    maxTeams: 48,
    teamsPerMatch: 12,
    viewers: 0,
    banner: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=2074",
    startsAt: "2026-07-25T10:00:00Z",
    registrationClosesAt: "2026-07-24T23:59:59Z",
    champion: {
      teamName: "Storm Squad",
      teamSlug: "storm-squad",
      logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff"
    }
  }
];

export const exploreOrganizations = [
  {
    id: "org1",
    slug: "riftora-official",
    name: "Riftora Official",
    description: "The official tournament organizing body of the Riftora platform. We host the largest seasonal circuits and premier events across multiple titles.",
    logo: "https://ui-avatars.com/api/?name=RO&background=2563EB&color=fff",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
    isVerified: true,
    location: "Global",
    foundedYear: 2024,
    website: "https://riftora.gg",
    socials: {
      discord: "https://discord.gg/riftora",
      twitter: "https://x.com/riftora",
      youtube: "https://youtube.com/@riftora"
    },
    stats: {
      totalTournaments: 45,
      activeEvents: 3,
      totalParticipants: 12500,
      totalPrizePool: "₹50L+"
    },
    supportedGames: ["BGMI", "Valorant", "Free Fire MAX"]
  },
  {
    id: "org2",
    slug: "esports-arena",
    name: "Esports Arena",
    description: "Esports Arena is a community-driven organization focusing on grassroots tournaments and regional championships for upcoming talent.",
    logo: "https://ui-avatars.com/api/?name=EA&background=8B5CF6&color=fff",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
    isVerified: true,
    location: "India",
    foundedYear: 2023,
    website: null,
    socials: {
      discord: "https://discord.gg/esportsarena",
      instagram: "https://instagram.com/esportsarena"
    },
    stats: {
      totalTournaments: 12,
      activeEvents: 1,
      totalParticipants: 3200,
      totalPrizePool: "₹10L+"
    },
    supportedGames: ["Free Fire MAX"]
  }
];

export const exploreTeams = [
  {
    id: "team1",
    slug: "rift-legends",
    name: "Rift Legends",
    description: "Rift Legends is a competitive esports team focused on professional Battle Royale competition. We aim for the top in every tournament we enter.",
    logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
    isVerified: true,
    tag: "RFT",
    region: "India",
    foundedYear: 2023,
    website: "https://riftlegends.gg",
    socials: {
      discord: "https://discord.gg/riftlegends",
      twitter: "https://x.com/riftlegends",
      youtube: "https://youtube.com/@riftlegends",
      instagram: "https://instagram.com/riftlegends"
    },
    stats: {
      totalTournaments: 24,
      activeEvents: 2,
      matchesPlayed: 126,
      tournamentWins: 8,
      totalPrizePool: "₹5L+"
    },
    supportedGames: ["BGMI", "Valorant"]
  },
  {
    id: "team2",
    slug: "storm-squad",
    name: "Storm Squad",
    description: "Taking the esports scene by storm. Currently dominating the Free Fire MAX circuit.",
    logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff",
    coverImage: null, // Test fallback cover
    isVerified: false,
    tag: "STRM",
    region: "Global",
    foundedYear: 2024,
    website: null,
    socials: {
      discord: "https://discord.gg/stormsquad"
    },
    stats: {
      totalTournaments: 10,
      activeEvents: 1,
      matchesPlayed: 45,
      tournamentWins: 2,
      totalPrizePool: "₹50,000"
    },
    supportedGames: ["Free Fire MAX"]
  }
];

export const exploreTeamRosters = {
  "rift-legends": [
    { id: "p1", username: "ravikumar", displayName: "Ravi Kumar", avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=333&color=fff", teamRole: "Captain", joinedAt: "2023-01-15T00:00:00Z" },
    { id: "p2", username: "shadow", displayName: "Shadow Ninja", avatar: "https://ui-avatars.com/api/?name=Shadow+Ninja&background=333&color=fff", teamRole: "Player", joinedAt: "2023-02-01T00:00:00Z" },
    { id: "p3", username: "viper", displayName: "Viper Strike", avatar: "https://ui-avatars.com/api/?name=Viper+Strike&background=333&color=fff", teamRole: "Player", joinedAt: "2023-03-10T00:00:00Z" },
    { id: "p4", username: "aimbot", displayName: "Aim Bot", avatar: "https://ui-avatars.com/api/?name=Aim+Bot&background=333&color=fff", teamRole: "Player", joinedAt: "2023-05-20T00:00:00Z" },
    { id: "p5", username: "coach_x", displayName: "Coach X", avatar: "https://ui-avatars.com/api/?name=Coach+X&background=333&color=fff", teamRole: "Coach", joinedAt: "2024-01-10T00:00:00Z" },
  ],
  "storm-squad": [
    { id: "p6", username: "storm_king", displayName: "Storm King", avatar: "https://ui-avatars.com/api/?name=Storm+King&background=333&color=fff", teamRole: "Captain", joinedAt: "2024-01-05T00:00:00Z" },
    { id: "p7", username: "thunder", displayName: "Thunder", avatar: "https://ui-avatars.com/api/?name=Thunder&background=333&color=fff", teamRole: "Player", joinedAt: "2024-01-05T00:00:00Z" },
    { id: "p8", username: "lightning", displayName: "Lightning", avatar: "https://ui-avatars.com/api/?name=Lightning&background=333&color=fff", teamRole: "Player", joinedAt: "2024-02-15T00:00:00Z" },
  ]
};

export const explorePlayers = [
  {
    id: "p1",
    username: "ravikumar",
    displayName: "Ravi Kumar",
    bio: "Competitive BGMI player focused on professional Battle Royale tournaments. Always aiming for the chicken dinner.",
    avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=333&color=fff",
    isVerified: true,
    country: "India",
    region: "Asia",
    joinedAt: "2023-01-15T00:00:00Z",
    socials: {
      youtube: "https://youtube.com/@ravikumar",
      instagram: "https://instagram.com/ravikumar",
      discord: "https://discord.gg/ravikumar"
    },
    teamId: "team1",
    teamSlug: "rift-legends",
    teamName: "Rift Legends",
    teamLogo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff",
    teamRole: "Captain",
    stats: {
      totalTournaments: 24,
      activeEvents: 2,
      matchesPlayed: 126,
      tournamentWins: 8,
      bestPlacement: "1st",
      totalPrizePool: "₹2L+"
    },
    supportedGames: ["BGMI", "Valorant"]
  },
  {
    id: "p2",
    username: "shadow",
    displayName: "Shadow Ninja",
    bio: "Silent but deadly. Free Fire MAX enthusiast.",
    avatar: "https://ui-avatars.com/api/?name=Shadow+Ninja&background=333&color=fff",
    isVerified: false,
    country: "India",
    region: "Asia",
    joinedAt: "2023-02-01T00:00:00Z",
    socials: {
      twitter: "https://x.com/shadow"
    },
    teamId: "team1",
    teamSlug: "rift-legends",
    teamName: "Rift Legends",
    teamLogo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff",
    teamRole: "Player",
    stats: {
      totalTournaments: 15,
      activeEvents: 1,
      matchesPlayed: 80,
      tournamentWins: 3,
      bestPlacement: "1st",
      totalPrizePool: "₹50K+"
    },
    supportedGames: ["Free Fire MAX", "BGMI"]
  },
  {
    id: "p9",
    username: "solo_king",
    displayName: "Solo King",
    bio: "Independent competitive player looking for a team.",
    avatar: "https://ui-avatars.com/api/?name=Solo+King&background=333&color=fff",
    isVerified: false,
    country: "Global",
    region: "Global",
    joinedAt: "2024-01-01T00:00:00Z",
    socials: {},
    teamId: null,
    teamSlug: null,
    teamName: null,
    teamLogo: null,
    teamRole: null,
    stats: {
      totalTournaments: 5,
      activeEvents: 0,
      matchesPlayed: 20,
      tournamentWins: 0,
      bestPlacement: "Top 10",
      totalPrizePool: "0"
    },
    supportedGames: ["Valorant"]
  },
  {
    id: "p7",
    username: "thunder",
    displayName: "Thunder",
    bio: "Loud and fast. Aggressive fragger for Storm Squad.",
    avatar: "https://ui-avatars.com/api/?name=Thunder&background=333&color=fff",
    isVerified: false,
    country: "India",
    region: "Asia",
    joinedAt: "2024-01-05T00:00:00Z",
    socials: {
      instagram: "https://instagram.com/thunder"
    },
    teamId: "team2",
    teamSlug: "storm-squad",
    teamName: "Storm Squad",
    teamLogo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff",
    teamRole: "Player",
    stats: {
      totalTournaments: 8,
      activeEvents: 1,
      matchesPlayed: 40,
      tournamentWins: 1,
      bestPlacement: "1st",
      totalPrizePool: "₹10K+"
    },
    supportedGames: ["Free Fire MAX"]
  },
  {
    id: "p10",
    username: "scoutop",
    displayName: "Scout OP",
    bio: "Aggressive BGMI assaulter. Watch me clutch 1v4s on stream.",
    avatar: "https://ui-avatars.com/api/?name=Scout+OP&background=333&color=fff",
    isVerified: true,
    country: "India",
    region: "Asia",
    joinedAt: "2023-05-12T00:00:00Z",
    socials: {
      youtube: "https://youtube.com/@scoutop",
      instagram: "https://instagram.com/scoutop"
    },
    teamId: "team1",
    teamSlug: "rift-legends",
    teamName: "Rift Legends",
    teamLogo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff",
    teamRole: "Player",
    stats: {
      totalTournaments: 42,
      activeEvents: 3,
      matchesPlayed: 215,
      tournamentWins: 12,
      bestPlacement: "1st",
      totalPrizePool: "₹15L+"
    },
    supportedGames: ["BGMI"]
  }
];

export const explorePlayerAchievements = {
  "ravikumar": [
    { id: "a1", name: "Tournament Champion", description: "Won 1st place in a major tournament.", date: "2023-12-01", icon: "🏆" },
    { id: "a2", name: "MVP", description: "Awarded Most Valuable Player in BGMI Pro League.", date: "2024-02-15", icon: "⭐" },
    { id: "a3", name: "Top 3 Finish", description: "Finished in the top 3 of a regional event.", date: "2023-10-10", icon: "🔥" }
  ],
  "shadow": [
    { id: "a4", name: "Top Performer", description: "Highest kills in a single match.", date: "2023-11-20", icon: "🎯" }
  ],
  "scoutop": [
    { id: "a5", name: "BGMI Pro MVP", description: "Most eliminations in BGMI Pro Championship Finals.", date: "2024-03-20", icon: "🔥" },
    { id: "a6", name: "100K Subscriber Play Button", description: "Hit 100K subs on YouTube.", date: "2024-01-10", icon: "▶️" }
  ]
};


export const exploreTournamentRules = {
  "bgmi-pro-championship": {
    metadata: {
      version: "1.2.0",
      lastUpdated: "2026-09-08T10:00:00Z",
      downloadUrl: "/downloads/rulebook_bgmi_pro.pdf"
    },
    sections: [
      {
        id: "general",
        title: "General Rules",
        blocks: [
          { type: 'paragraph', content: "Welcome to the BGMI PRO CHAMPIONSHIP. These rules govern all tournament play. By participating, players agree to follow all instructions from the Tournament Organizers." },
          { type: 'list', items: [
            "All matches are played on the latest version of BGMI.",
            "Tournament Organizers reserve the right to amend rules at any time.",
            "All decisions made by the Organizers are final."
          ]}
        ]
      },
      {
        id: "eligibility",
        title: "Eligibility Requirements",
        blocks: [
          { type: 'paragraph', content: "To participate in the tournament, all players must meet the following criteria:" },
          { type: 'list', items: [
            "Players must be at least 16 years of age.",
            "Players must be residents of India.",
            "Accounts must be level 40 or higher.",
            "No player may play for more than one team in this tournament."
          ]}
        ]
      },
      {
        id: "format",
        title: "Tournament Format",
        blocks: [
          { type: 'paragraph', content: "The tournament consists of three stages: Group Stage, Semi Finals, and Grand Finals." },
          { type: 'heading3', content: "Group Stage" },
          { type: 'paragraph', content: "32 teams are divided into 4 groups (A, B, C, D). Each group plays a Round Robin format. The top 4 teams from each group advance to the Semi Finals." },
          { type: 'heading3', content: "Semi Finals" },
          { type: 'paragraph', content: "16 teams play 6 matches. The top 8 teams advance." },
          { type: 'heading3', content: "Grand Finals" },
          { type: 'paragraph', content: "The final 8 teams play 12 matches over 2 days to determine the champion." }
        ]
      },
      {
        id: "scoring",
        title: "Scoring System",
        blocks: [
          { type: 'paragraph', content: "The official scoring system rewards both placement and eliminations." },
          { type: 'list', items: [
            "1st Place: 10 points",
            "2nd Place: 6 points",
            "3rd Place: 5 points",
            "4th Place: 4 points",
            "5th Place: 3 points",
            "6th Place: 2 points",
            "7th - 8th Place: 1 point",
            "9th - 16th Place: 0 points",
            "Each Elimination: 1 point"
          ]}
        ]
      },
      {
        id: "conduct",
        title: "Code of Conduct",
        blocks: [
          { type: 'paragraph', content: "All participants are expected to act professionally. Toxic behavior will not be tolerated." },
          { type: 'heading3', content: "Prohibited Behavior" },
          { type: 'list', items: [
            "Harassment of players or staff.",
            "Collusion or match-fixing.",
            "Account sharing.",
            "Exploiting game bugs."
          ]}
        ]
      },
      {
        id: "penalties",
        title: "Penalties",
        blocks: [
          { type: 'paragraph', content: "Violations of the rulebook will result in penalties at the discretion of the Organizers." },
          { type: 'table', 
            headers: ["Violation", "Action"],
            rows: [
              ["Minor Toxicity", "Warning"],
              ["Repeated Toxicity", "Point Deduction (10 pts)"],
              ["Account Sharing", "Disqualification"],
              ["Use of Cheats", "Permanent Ban"]
            ]
          }
        ]
      }
    ]
  }
};

export const exploreTournamentPrizes = {
  "bgmi-pro-championship": {
    currency: "INR",
    totalPrizePool: 100000,
    status: "FINALIZED",
    prizeTerms: "Prizes will be distributed within 30 days of the tournament concluding. All winners must complete verification processes and adhere to the official Code of Conduct.",
    distribution: [
      { id: "p1", place: "1st Place", amount: 50000, type: "cash", sponsor: null, description: "Champion's share" },
      { id: "p2", place: "2nd Place", amount: 25000, type: "cash", sponsor: null },
      { id: "p3", place: "3rd Place", amount: 10000, type: "cash", sponsor: null },
      { id: "p4", place: "4th-5th Place", amount: 5000, type: "cash", sponsor: null },
      { id: "p5", place: "6th-10th Place", amount: 1000, type: "cash", sponsor: null }
    ],
    specialAwards: [
      { id: "sa1", title: "MVP", amount: 5000, type: "cash", description: "Awarded to the player with the highest performance rating." },
      { id: "sa2", title: "Best Fragger", amount: 3000, type: "cash", description: "Awarded to the player with the most eliminations." }
    ],
    nonCashPrizes: [
      { id: "nc1", title: "Pro Gaming Headset", type: "hardware", sponsor: "Logitech G", description: "Awarded to the tournament MVP." },
      { id: "nc2", title: "Tournament Trophy", type: "physical", sponsor: null, description: "Official Championship Trophy." }
    ]
  }
};

export const exploreTournamentTeams = {
  "bgmi-pro-championship": [
    { id: "team1", name: "Rift Legends", tag: "RFT", logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff", slug: "rift-legends", group: "Group A", status: "ACTIVE", rank: 1, players: 4, org: "Riftora Esports" },
    { id: "team2", name: "Storm Squad", tag: "STRM", logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff", slug: "storm-squad", group: "Group A", status: "ACTIVE", rank: 2, players: 4 },
    { id: "team3", name: "Hydra Esports", tag: "HYD", logo: "https://ui-avatars.com/api/?name=HYD&background=10B981&color=fff", slug: "hydra-esports", group: "Group B", status: "ELIMINATED", rank: 6, players: 4 },
    { id: "team4", name: "Phoenix Rising", tag: "PHX", logo: "https://ui-avatars.com/api/?name=PR&background=F59E0B&color=fff", slug: "phoenix-rising", group: "Group B", status: "QUALIFIED", rank: 3, players: 4 },
    { id: "team5", name: "Team Velocity", tag: "TV", logo: "https://ui-avatars.com/api/?name=TV&background=EF4444&color=fff", slug: "team-velocity", group: "Group A", status: "ACTIVE", rank: 4, players: 4 },
    { id: "team6", name: "Alpha Warriors", tag: "AW", logo: "https://ui-avatars.com/api/?name=AW&background=10B981&color=fff", slug: "alpha-warriors", group: "Group C", status: "QUALIFIED", rank: 5, players: 4 },
    { id: "team7", name: "Nexus Gaming", tag: "NX", logo: "https://ui-avatars.com/api/?name=NX&background=6366F1&color=fff", slug: "nexus-gaming", group: "Group B", status: "ELIMINATED", rank: 7, players: 4 },
    { id: "team8", name: "Shadow Assassins", tag: "SA", logo: "https://ui-avatars.com/api/?name=SA&background=374151&color=fff", slug: "shadow-assassins", group: "Group C", status: "ELIMINATED", rank: 8, players: 4 }
  ]
};

export const exploreTournamentSchedule = {
  "bgmi-pro-championship": [
    { id: "m1", matchNumber: 1, stage: "Group Stage", round: "Round 1", scheduledTime: "2026-09-20T14:00:00Z", status: "COMPLETED", map: "Erangel", format: "BO1" },
    { id: "m2", matchNumber: 2, stage: "Group Stage", round: "Round 1", scheduledTime: "2026-09-20T15:00:00Z", status: "COMPLETED", map: "Miramar", format: "BO1" },
    { id: "m3", matchNumber: 3, stage: "Group Stage", round: "Round 2", scheduledTime: "2026-09-20T16:00:00Z", status: "COMPLETED", map: "Sanhok", format: "BO1" },
    { id: "m4", matchNumber: 4, stage: "Group Stage", round: "Round 2", scheduledTime: "2026-09-20T17:00:00Z", status: "COMPLETED", map: "Erangel", format: "BO1" },
    { id: "m5", matchNumber: 5, stage: "Semi Finals", round: "Match 1", scheduledTime: "2026-09-21T14:00:00Z", status: "COMPLETED", map: "Erangel", format: "BO1" },
    { id: "m6", matchNumber: 6, stage: "Semi Finals", round: "Match 2", scheduledTime: "2026-09-21T15:00:00Z", status: "COMPLETED", map: "Miramar", format: "BO1" },
    { id: "m7", matchNumber: 7, stage: "Semi Finals", round: "Match 3", scheduledTime: "2026-09-21T16:00:00Z", status: "IN_PROGRESS", map: "Sanhok", format: "BO1", teamScores: [{ name: "Storm Squad", score: 14 }, { name: "Rift Legends", score: 12 }] },
    { id: "m8", matchNumber: 8, stage: "Semi Finals", round: "Match 4", scheduledTime: "2026-09-21T17:00:00Z", status: "UPCOMING", map: "Erangel", format: "BO1" },
    { id: "m9", matchNumber: 9, stage: "Grand Finals", round: "Match 1", scheduledTime: "2026-09-22T14:00:00Z", status: "SCHEDULED", map: "Erangel", format: "BO1" },
    { id: "m10", matchNumber: 10, stage: "Grand Finals", round: "Match 2", scheduledTime: "2026-09-22T15:00:00Z", status: "SCHEDULED", map: "Miramar", format: "BO1" },
    { id: "m11", matchNumber: 11, stage: "Grand Finals", round: "Match 3", scheduledTime: "2026-09-22T16:00:00Z", status: "SCHEDULED", map: "Sanhok", format: "BO1" },
    { id: "m12", matchNumber: 12, stage: "Grand Finals", round: "Match 4", scheduledTime: "2026-09-22T17:00:00Z", status: "SCHEDULED", map: "Erangel", format: "BO1" },
  ]
};

export const exploreTournamentLeaderboard = {
  "bgmi-pro-championship": [
    { rank: 1, teamSlug: "rift-legends", team: "Rift Legends", logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff", matchesPlayed: 4, placementPoints: 44, eliminations: 42, points: 86, dinners: 2, prevRank: 2, isQualified: true },
    { rank: 2, teamSlug: "storm-squad", team: "Storm Squad", logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff", matchesPlayed: 4, placementPoints: 43, eliminations: 38, points: 81, dinners: 1, prevRank: 1, isQualified: true },
    { rank: 3, teamSlug: "phoenix-rising", team: "Phoenix Rising", logo: "https://ui-avatars.com/api/?name=PR&background=F59E0B&color=fff", matchesPlayed: 4, placementPoints: 41, eliminations: 35, points: 76, dinners: 0, prevRank: 4, isQualified: true },
    { rank: 4, teamSlug: "team-velocity", team: "Team Velocity", logo: "https://ui-avatars.com/api/?name=TV&background=EF4444&color=fff", matchesPlayed: 4, placementPoints: 38, eliminations: 30, points: 68, dinners: 1, prevRank: 3, isQualified: true },
    { rank: 5, teamSlug: "alpha-warriors", team: "Alpha Warriors", logo: "https://ui-avatars.com/api/?name=AW&background=10B981&color=fff", matchesPlayed: 4, placementPoints: 36, eliminations: 25, points: 61, dinners: 0, prevRank: 6, isQualified: true },
    { rank: 6, teamSlug: "hydra-esports", team: "Hydra Esports", logo: "https://ui-avatars.com/api/?name=HYD&background=10B981&color=fff", matchesPlayed: 4, placementPoints: 30, eliminations: 22, points: 52, dinners: 0, prevRank: 5, isQualified: false },
    { rank: 7, teamSlug: "nexus-gaming", team: "Nexus Gaming", logo: "https://ui-avatars.com/api/?name=NG&background=6366F1&color=fff", matchesPlayed: 4, placementPoints: 24, eliminations: 18, points: 42, dinners: 0, prevRank: 7, isQualified: false },
    { rank: 8, teamSlug: "shadow-assassins", team: "Shadow Assassins", logo: "https://ui-avatars.com/api/?name=SA&background=374151&color=fff", matchesPlayed: 4, placementPoints: 16, eliminations: 12, points: 28, dinners: 0, prevRank: 8, isQualified: false },
  ]
};

export const exploreTournamentResults = {
  "bgmi-pro-championship": {
    champion: {
      team: "Rift Legends",
      teamSlug: "rift-legends",
      logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff",
      points: 156
    },
    matches: [
      {
        id: "m6",
        name: "Match 6",
        stage: "Grand Finals",
        status: "COMPLETED",
        completedAt: "2026-09-22T17:45:00Z",
        winner: { team: "Rift Legends", teamSlug: "rift-legends", logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff" },
        mvp: { name: "Ravi Kumar", team: "Rift Legends", stat: "8 Eliminations" },
        stats: { eliminations: 14, points: 29 },
        standings: [
          { rank: 1, team: "Rift Legends", teamSlug: "rift-legends", logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff", placementPoints: 15, eliminations: 14, points: 29 },
          { rank: 2, team: "Storm Squad", teamSlug: "storm-squad", logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff", placementPoints: 12, eliminations: 8, points: 20 },
          { rank: 3, team: "Phoenix Rising", teamSlug: "phoenix-rising", logo: "https://ui-avatars.com/api/?name=PR&background=F59E0B&color=fff", placementPoints: 10, eliminations: 6, points: 16 }
        ]
      },
      {
        id: "m5",
        name: "Match 5",
        stage: "Grand Finals",
        status: "COMPLETED",
        completedAt: "2026-09-22T16:45:00Z",
        winner: { team: "Storm Squad", teamSlug: "storm-squad", logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff" },
        mvp: { name: "Thunder", team: "Storm Squad", stat: "10 Eliminations" },
        stats: { eliminations: 12, points: 27 },
        standings: [
          { rank: 1, team: "Storm Squad", teamSlug: "storm-squad", logo: "https://ui-avatars.com/api/?name=SS&background=8B5CF6&color=fff", placementPoints: 15, eliminations: 12, points: 27 },
          { rank: 2, team: "Rift Legends", teamSlug: "rift-legends", logo: "https://ui-avatars.com/api/?name=RL&background=2563EB&color=fff", placementPoints: 12, eliminations: 10, points: 22 },
          { rank: 3, team: "Team Velocity", teamSlug: "team-velocity", logo: "https://ui-avatars.com/api/?name=TV&background=EF4444&color=fff", placementPoints: 10, eliminations: 5, points: 15 }
        ]
      }
    ]
  }
};

export const sponsorDashboardData = {
  sponsor: {
    id: "sponsor-001",
    name: "Nova Gaming",
    tier: "GOLD",
    role: "Official Gaming Partner",
    logo: "https://ui-avatars.com/api/?name=NG&background=2563EB&color=fff",
    contact: {
      name: "Nova Gaming Campaign Representative",
      email: "sponsor@novagaming.example.com",
      organization: "Nova Gaming"
    }
  },
  tournament: {
    id: "t1",
    slug: "bgmi-pro-championship",
    name: "Riftora Championship Series",
    game: "BGMI",
    status: "LIVE"
  },
  campaign: {
    status: "ACTIVE",
    startDate: "2026-09-01",
    endDate: "2026-09-15"
  },
  analytics: {
    impressions: { current: 1248320, change: 18.4 },
    engagements: { current: 84920, change: 11.2 },
    streamViews: { current: 630400, change: 24.7 },
    clicks: { current: 18240, change: 8.9 }
  },
  placements: [
    { id: "p1", name: "Tournament Header", status: "ACTIVE", delivery: "24/24h", type: "Public tournament branding" },
    { id: "p2", name: "Stream Overlay", status: "ACTIVE", delivery: "18 matches", type: "Live broadcast sponsor bug" },
    { id: "p3", name: "Match Overlay", status: "ACTIVE", delivery: "12/16", type: "Match graphics" },
    { id: "p4", name: "Result Screen", status: "PENDING", delivery: "0/8", type: "End-of-match branding" }
  ],
  deliverables: [
    { id: "d1", name: "Tournament Logo Placement", status: "COMPLETED", date: "Sep 01", placement: "Tournament Page" },
    { id: "d2", name: "Stream Overlay Branding", status: "COMPLETED", date: "Sep 03", placement: "Stream Overlay" },
    { id: "d3", name: "Sponsored Match Segment", status: "IN_PROGRESS", date: "Sep 11", placement: "Sponsor Segment" },
    { id: "d4", name: "Social Media Promotion", status: "SCHEDULED", date: "Sep 12", placement: "Social Promotion" },
    { id: "d5", name: "Finale Branding", status: "PENDING", date: "Sep 15", placement: "Finale Screen" }
  ],
  upcomingEvents: [
    { id: "e1", title: "Match 03", subtitle: "BGMI — Round 1", time: "Today, 7:30 PM", placement: "Nova Gaming Sponsor Overlay" },
    { id: "e2", title: "Semi Finals", subtitle: "BGMI", time: "Tomorrow, 6:00 PM", placement: "Nova Gaming Sponsor Overlay" },
    { id: "e3", title: "Grand Finale", subtitle: "BGMI", time: "Sep 15, 8:00 PM", placement: "Nova Gaming Finale Graphic" }
  ],
  milestones: [
    { id: "m1", title: "Campaign Started", status: "COMPLETED", date: "Sep 01" },
    { id: "m2", title: "Branding Activated", status: "COMPLETED", date: "Sep 02" },
    { id: "m3", title: "First Live Broadcast", status: "COMPLETED", date: "Sep 03" },
    { id: "m4", title: "Match Day 2", status: "CURRENT", date: "Today" },
    { id: "m5", title: "Grand Finale", status: "PENDING", date: "Sep 15" }
  ],
  assets: [
    { id: "a1", name: "Logo", status: "UPLOADED" },
    { id: "a2", name: "Dark Logo", status: "UPLOADED" },
    { id: "a3", name: "Stream Banner", status: "UPLOADED" },
    { id: "a4", name: "Match Overlay", status: "UPLOADED" },
    { id: "a5", name: "Finale Graphic", status: "MISSING" }
  ],
  updates: [
    { id: "u1", message: "Stream overlay activated", time: "10 minutes ago", type: "success" },
    { id: "u2", message: "Match Day 2 started", time: "1 hour ago", type: "success" },
    { id: "u3", message: "Finale graphic is still pending", time: "2 hours ago", type: "warning" }
  ],
  engagement: {
    registeredTeams: 64,
    players: 256,
    matches: 24,
    completed: 12,
    liveViewers: 18420,
    peakViewers: 27810
  },
  liveVisibility: [
    { name: "Stream Overlay", status: "ACTIVE" },
    { name: "Match Bar", status: "ACTIVE" },
    { name: "Sponsor Segment", status: "UPCOMING" },
    { name: "Result Splash", status: "PENDING" }
  ]
};

export const broadcastDashboard = {
  tournament: {
    id: "t1",
    name: "Riftora Championship 2026",
    game: "BGMI",
    phase: "Grand Finals",
    matchDay: 3,
  },
  broadcast: {
    status: "LIVE",
    currentMatchId: "M04",
    startedAt: new Date(Date.now() - 42 * 60000).toISOString(),
  },
  currentMatch: {
    id: "M04",
    number: "04",
    map: "Erangel",
    lobby: "Lobby A",
    teamCount: 16,
    status: "IN_PROGRESS",
    productionStates: [
      { name: "Scoreboard", status: "READY" },
      { name: "Matchbar", status: "LIVE" },
      { name: "Leaderboard", status: "READY" },
      { name: "Sponsor Rotation", status: "ACTIVE" },
      { name: "Caster Scene", status: "LIVE" },
      { name: "Result Scene", status: "STANDBY" }
    ]
  },
  nextMatch: {
    id: "M05",
    number: "05",
    map: "Miramar",
    lobby: "Lobby B",
    teamCount: 16,
    status: "READY",
    startTime: new Date(Date.now() + 18 * 60000 + 32000).toISOString(),
    readiness: [
      { name: "Teams Loaded", ready: true },
      { name: "Matchbar", ready: true },
      { name: "Leaderboard", ready: true },
      { name: "Sponsor Package", ready: true },
      { name: "Caster Scene", ready: true }
    ]
  },
  readiness: {
    items: [
      { id: 'r1', name: 'Current match data', status: 'READY' },
      { id: 'r2', name: 'Scoreboard', status: 'READY' },
      { id: 'r3', name: 'Leaderboard', status: 'READY' },
      { id: 'r4', name: 'Matchbar', status: 'READY' },
      { id: 'r5', name: 'Sponsor rotation', status: 'READY' },
      { id: 'r6', name: 'Result scene', status: 'STANDBY' },
      { id: 'r7', name: 'Finale scene', status: 'STANDBY' }
    ],
    readyCount: 5,
    totalCount: 7
  },
  overlays: [
    { id: 'leaderboard', name: 'Leaderboard', status: 'READY', path: '/overlay/t1/leaderboard' },
    { id: 'top10', name: 'Top 10', status: 'READY', path: '/overlay/t1/top10' },
    { id: 'matchbar', name: 'Match Bar', status: 'READY', path: '/overlay/t1/matchbar' },
    { id: 'sponsor', name: 'Sponsor', status: 'READY', path: '/overlay/t1/sponsor' },
    { id: 'result', name: 'Result', status: 'READY', path: '/overlay/t1/result' },
    { id: 'finale', name: 'Finale', status: 'READY', path: '/overlay/t1/finale' }
  ],
  streamHealth: {
    status: "LIVE",
    connection: "Stable",
    bitrate: "5.8 Mbps",
    fps: 60,
    droppedFrames: "0.2%",
    latency: "3.1s"
  },
  schedule: [
    { id: "M04", number: "04", phase: "Grand Finals", map: "Erangel", lobby: "Lobby A", time: "10:00", status: "LIVE" },
    { id: "M05", number: "05", phase: "Grand Finals", map: "Miramar", lobby: "Lobby B", time: "11:15", status: "NEXT" },
    { id: "M06", number: "06", phase: "Grand Finals", map: "Sanhok", lobby: "Lobby A", time: "12:30", status: "SCHEDULED" },
    { id: "BRK", name: "Break", phase: "Intermission", time: "13:45", status: "UPCOMING" },
    { id: "M07", number: "07", phase: "Grand Finals", map: "Erangel", lobby: "Lobby B", time: "14:00", status: "SCHEDULED" }
  ],
  sponsors: [
    { id: "s1", name: "Nova Gaming", placement: "Main Overlay", status: "ACTIVE" },
    { id: "s2", name: "Energy Drink Co", placement: "Match Break", status: "READY" },
    { id: "s3", name: "Tech Gear", placement: "Finale", status: "SCHEDULED" }
  ],
  sponsorsSummary: {
    active: 8,
    scheduled: 12,
    readyAssets: 11
  },
  alerts: [
    { id: "a1", priority: "warning", message: "Sponsor bumper for Match 06 is not ready" },
    { id: "a2", priority: "success", message: "Match 05 leaderboard package ready" },
    { id: "a3", priority: "warning", message: "Result scene requires verification" },
    { id: "a4", priority: "success", message: "All current match overlays loaded" }
  ]
};