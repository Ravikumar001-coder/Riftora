export const mockOrganizationSettings = {
  general: {
    name: 'Hydra Esports',
    shortDescription: 'Competitive esports organization hosting tournaments and live gaming events.',
    description: 'Hydra Esports is a leading competitive gaming organization focusing on mobile and PC titles. We host monthly tournaments and provide a platform for upcoming talent to showcase their skills on a global stage.',
    type: 'Esports Organization'
  },
  branding: {
    logoUrl: null // Using null to allow demonstrating the empty/upload state
  },
  url: {
    slug: 'hydra-esports'
  },
  contact: {
    email: 'contact@hydra-esports.com',
    phone: '+91 98765 43210',
    website: 'https://hydra-esports.com',
    socialLinks: {
      discord: 'https://discord.gg/hydra',
      youtube: 'https://youtube.com/c/hydraesports',
      instagram: 'https://instagram.com/hydraesports',
      twitter: 'https://twitter.com/hydraesports',
      twitch: 'https://twitch.tv/hydraesports'
    }
  },
  localization: {
    timezone: 'Asia/Kolkata',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour'
  },
  privacy: {
    visibility: 'Public', // 'Public' | 'Private'
    discoverable: true,
    publicTournaments: true
  },
  memberDefaults: {
    defaultRole: 'Viewer', // 'Viewer' | 'Staff'
    allowInvites: true,
    requireApproval: true
  },
  notifications: {
    registrations: true,
    scheduleChanges: true,
    memberActivity: false,
    announcements: true,
    disputes: true,
    system: true
  }
};
