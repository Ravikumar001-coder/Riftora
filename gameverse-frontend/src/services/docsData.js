export const docsCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Gamepad2",
    description: "Everything you need to begin using Riftora.",
    articleCount: 6,
    path: "/docs/getting-started"
  },
  {
    id: "tournaments",
    title: "Tournaments",
    icon: "Trophy",
    description: "Discover, register, and participate in events.",
    articleCount: 9,
    path: "/docs/tournaments"
  },
  {
    id: "teams",
    title: "Teams & Players",
    icon: "Users",
    description: "Manage rosters and player profiles.",
    articleCount: 6,
    path: "/docs/teams"
  },
  {
    id: "organizations",
    title: "Organizations",
    icon: "Building",
    description: "Create orgs and manage your members.",
    articleCount: 6,
    path: "/docs/organizations"
  },
  {
    id: "operations",
    title: "Tournament Operations",
    icon: "Settings",
    description: "Tools for organizers and staff.",
    articleCount: 9,
    path: "/docs/operations"
  },
  {
    id: "scoring",
    title: "Live Scoring & Leaderboards",
    icon: "BarChart3",
    description: "Understand score tracking and updates.",
    articleCount: 5,
    path: "/docs/scoring"
  },
  {
    id: "broadcasting",
    title: "Broadcasting",
    icon: "Tv",
    description: "Live streaming and production workflows.",
    articleCount: 5,
    path: "/docs/broadcasting"
  },
  {
    id: "overlays",
    title: "OBS Overlays",
    icon: "MonitorPlay",
    description: "Setup official graphics for streams.",
    articleCount: 7,
    path: "/docs/overlays"
  },
  {
    id: "api",
    title: "API Documentation",
    icon: "Code2",
    description: "Technical reference for developers.",
    articleCount: 15,
    path: "/docs/api"
  },
  {
    id: "errors",
    title: "Error Reference",
    icon: "AlertTriangle",
    description: "Understand platform error codes.",
    articleCount: 6,
    path: "/docs/errors"
  }
];

export const popularGuides = [
  {
    id: "create-first-tournament",
    title: "How to Create Your First Tournament",
    category: "Tournament Operations",
    description: "A step-by-step guide to configuring, publishing, and managing your first event.",
    readTime: "5 min read",
    path: "/docs/operations/create-first-tournament"
  },
  {
    id: "tournament-registration",
    title: "How Tournament Registration Works",
    category: "Tournaments",
    description: "Learn how to register your team, meet requirements, and complete check-in.",
    readTime: "3 min read",
    path: "/docs/tournaments/registration"
  },
  {
    id: "manage-roster",
    title: "Managing Your Team Roster",
    category: "Teams & Players",
    description: "Invite players, assign roles, and prepare your team for competition.",
    readTime: "4 min read",
    path: "/docs/teams/manage-roster"
  },
  {
    id: "live-leaderboards",
    title: "Understanding Live Leaderboards",
    category: "Live Scoring & Leaderboards",
    description: "How points are calculated and when updates are pushed to the live view.",
    readTime: "4 min read",
    path: "/docs/scoring/live-leaderboards"
  },
  {
    id: "obs-overlays",
    title: "Setting Up OBS Overlays",
    category: "OBS Overlays",
    description: "Integrate Riftora's real-time graphics into your broadcast software.",
    readTime: "6 min read",
    path: "/docs/overlays/setup"
  },
  {
    id: "api-getting-started",
    title: "Getting Started with the Riftora API",
    category: "API Documentation",
    description: "Authentication, rate limits, and making your first request.",
    readTime: "8 min read",
    path: "/docs/api/getting-started"
  }
];

export const userRoles = [
  {
    id: "player",
    title: "I'm a Player",
    icon: "Gamepad2",
    path: "/docs/getting-started"
  },
  {
    id: "captain",
    title: "I'm a Team Captain",
    icon: "Crown",
    path: "/docs/teams"
  },
  {
    id: "organizer",
    title: "I'm an Organizer",
    icon: "Building",
    path: "/docs/organizations"
  },
  {
    id: "staff",
    title: "I'm Tournament Staff",
    icon: "ShieldAlert",
    path: "/docs/operations"
  },
  {
    id: "broadcaster",
    title: "I'm a Broadcast Producer",
    icon: "Tv",
    path: "/docs/broadcasting"
  },
  {
    id: "developer",
    title: "I'm a Developer",
    icon: "Code2",
    path: "/docs/api"
  }
];

// Simple client-side search index
export const searchIndex = [
  ...popularGuides.map(g => ({ title: g.title, category: g.category, description: g.description, path: g.path })),
  { title: "Error Codes", category: "Error Reference", description: "List of all API and platform errors.", path: "/docs/errors" },
  { title: "API Rate Limits", category: "API Documentation", description: "Understand the rate limits for the public API.", path: "/docs/api/rate-limits" },
  { title: "Leaderboard Overlay", category: "OBS Overlays", description: "Browser source URL for the leaderboard overlay.", path: "/docs/overlays/leaderboard" },
  { title: "Match Bar", category: "OBS Overlays", description: "Setup the match status bar for your broadcast.", path: "/docs/overlays/match-bar" },
  { title: "Live Streaming Setup", category: "Broadcasting", description: "Link your Twitch or YouTube stream to your tournament.", path: "/docs/broadcasting/live-streaming" }
];

export const apiEndpoints = [
  {
    id: "get-tournaments",
    method: "GET",
    path: "/v1/tournaments",
    access: "Public",
    description: "Get a paginated list of public tournaments.",
    params: [
      { name: "page", type: "integer", description: "Page number (default: 1)" },
      { name: "limit", type: "integer", description: "Items per page (default: 20, max: 100)" },
      { name: "status", type: "string", description: "Filter by status (e.g., UPCOMING, LIVE)" }
    ],
    responseExample: `{
  "success": true,
  "data": {
    "tournaments": [
      {
        "id": "t_123",
        "slug": "bgmi-pro-championship",
        "name": "BGMI Pro Championship",
        "status": "LIVE"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 8
    }
  }
}`
  }
];

export const errorCodes = [
  {
    code: "RATE_LIMIT_EXCEEDED",
    status: 429,
    meaning: "Too many requests were made within the allowed time window.",
    action: "Wait until the retry period expires as indicated by the Retry-After header."
  },
  {
    code: "UNAUTHORIZED",
    status: 401,
    meaning: "Authentication token is missing or invalid.",
    action: "Provide a valid Bearer token in the Authorization header."
  },
  {
    code: "FORBIDDEN",
    status: 403,
    meaning: "Authenticated user lacks permissions for this action.",
    action: "Verify your role or organization membership."
  },
  {
    code: "NOT_FOUND",
    status: 404,
    meaning: "The requested resource does not exist.",
    action: "Check the resource ID or slug and try again."
  },
  {
    code: "VALIDATION_ERROR",
    status: 400,
    meaning: "The request body failed validation.",
    action: "Check the error details array to correct the fields in your request."
  }
];

export const mockArticleContent = `
## Overview

Tournament registration is the process of enrolling your team into an event. 
Organizers may require specific conditions to be met before a registration is approved.

## Requirements

Before registering, ensure that:
1. You are the Captain of your team.
2. Your team meets the minimum roster size requirements.
3. All players have linked their game accounts.

## Step-by-Step Setup

1. Navigate to the Tournament Overview page.
2. Click the **Register Team** button.
3. Select the team you wish to enter.
4. Choose the players from your roster who will compete.
5. Accept the tournament rules and submit your registration.

## Common Issues

* **Missing Game Accounts:** If a player hasn't linked their game account, you cannot select them.
* **Region Locks:** Some tournaments restrict entry based on player regions.

> **Note:** If the tournament has an entry fee, you will be redirected to the payment gateway after submitting your roster.
`;
