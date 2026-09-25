export const MOCK_ADMIN_DISPUTES = [
  {
    "id": "dsp-1",
    "referenceNumber": "DSP-PUBG-0001",
    "tournamentId": "trn-4",
    "tournamentName": "PUBG Masters Season 3",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-3",
    "organizationName": "Global Gaming",
    "teamId": "team-200",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team1",
    "captain": "Player1",
    "game": "PUBG",
    "type": "Organizer Conduct Complaint",
    "priority": "Normal",
    "status": "Under Review",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-16T14:18:06.491Z",
    "createdAt": "2026-08-14T14:38:42.724Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-14T14:38:42.724Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-16T14:18:06.491Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-2",
    "referenceNumber": "DSP-Free-0002",
    "tournamentId": "trn-4",
    "tournamentName": "Free Fire MAX Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-2",
    "organizationName": "Global Gaming",
    "teamId": "team-300",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team2",
    "captain": "Player2",
    "game": "Free Fire MAX",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Dismissed",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-08-11T22:40:01.185Z",
    "createdAt": "2026-08-11T22:03:27.889Z",
    "evidence": [
      {
        "id": "ev-2-1",
        "url": "https://picsum.photos/seed/ev12/800/600",
        "thumbnail": "https://picsum.photos/seed/ev12/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-11T22:03:27.889Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-2-2",
        "url": "https://picsum.photos/seed/ev22/800/600",
        "thumbnail": "https://picsum.photos/seed/ev22/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-11T22:03:27.889Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-12T00:40:01.185Z"
    },
    "history": [
      {
        "timestamp": "2026-08-11T22:03:27.889Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-11T22:40:01.185Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-08-11T20:03:27.889Z"
    }
  },
  {
    "id": "dsp-3",
    "referenceNumber": "DSP-PUBG-0003",
    "tournamentId": "trn-5",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-2",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team3",
    "captain": "Player3",
    "game": "PUBG",
    "type": "Organizer Conduct Complaint",
    "priority": "Critical",
    "status": "Resolved — No Change",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-23T22:07:44.948Z",
    "createdAt": "2026-08-22T23:35:45.953Z",
    "evidence": [
      {
        "id": "ev-3-1",
        "url": "https://picsum.photos/seed/ev13/800/600",
        "thumbnail": "https://picsum.photos/seed/ev13/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-22T23:35:45.953Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-3-2",
        "url": "https://picsum.photos/seed/ev23/800/600",
        "thumbnail": "https://picsum.photos/seed/ev23/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-22T23:35:45.953Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-23T01:35:45.953Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-24T00:07:44.948Z"
    },
    "history": [
      {
        "timestamp": "2026-08-22T23:35:45.953Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-23T01:35:45.953Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-23T22:07:44.948Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-4",
    "referenceNumber": "DSP-COD-0004",
    "tournamentId": "trn-3",
    "tournamentName": "COD Mobile Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-5",
    "organizationName": "Storm Esports",
    "teamId": "team-100",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team4",
    "captain": "Player4",
    "game": "COD Mobile",
    "type": "Unauthorized Player in Lobby",
    "priority": "Critical",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding unauthorized player in lobby. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-09-10T01:58:14.050Z",
    "createdAt": "2026-09-09T22:13:27.843Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-09-10T03:58:14.050Z"
    },
    "history": [
      {
        "timestamp": "2026-09-09T22:13:27.843Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-10T01:58:14.050Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-5",
    "referenceNumber": "DSP-Valorant-0005",
    "tournamentId": "trn-5",
    "tournamentName": "Valorant Masters Season 1",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-1",
    "organizationName": "Elite Tournaments",
    "teamId": "team-100",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team5",
    "captain": "Player5",
    "game": "Valorant",
    "type": "Incorrect Kill Count",
    "priority": "Critical",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding incorrect kill count. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Correct our kill count.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-08-22T18:03:41.595Z",
    "createdAt": "2026-08-21T11:53:44.351Z",
    "evidence": [],
    "linkedResult": {
      "placement": 4,
      "kills": 15,
      "points": 35
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+1",
      "projectedRankChange": "3th → 1rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-22T20:03:41.595Z"
    },
    "history": [
      {
        "timestamp": "2026-08-21T11:53:44.351Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-22T18:03:41.595Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-6",
    "referenceNumber": "DSP-BGMI-0006",
    "tournamentId": "trn-4",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-3",
    "organizationName": "Hydra Events",
    "teamId": "team-100",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team6",
    "captain": "Player6",
    "game": "BGMI",
    "type": "Technical Issue Not Addressed",
    "priority": "Normal",
    "status": "Under Review",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-02T04:46:19.123Z",
    "createdAt": "2026-08-31T07:46:53.061Z",
    "evidence": [
      {
        "id": "ev-6-1",
        "url": "https://picsum.photos/seed/ev16/800/600",
        "thumbnail": "https://picsum.photos/seed/ev16/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-31T07:46:53.061Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-31T09:46:53.061Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-31T07:46:53.061Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-31T09:46:53.061Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-02T04:46:19.123Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-7",
    "referenceNumber": "DSP-Valorant-0007",
    "tournamentId": "trn-4",
    "tournamentName": "Valorant Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-3",
    "organizationName": "Hydra Events",
    "teamId": "team-100",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team7",
    "captain": "Player7",
    "game": "Valorant",
    "type": "Incorrect Placement",
    "priority": "Critical",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-29T10:16:18.804Z",
    "createdAt": "2026-08-28T10:13:21.680Z",
    "evidence": [
      {
        "id": "ev-7-1",
        "url": "https://picsum.photos/seed/ev17/800/600",
        "thumbnail": "https://picsum.photos/seed/ev17/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-28T10:13:21.680Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-7-2",
        "url": "https://picsum.photos/seed/ev27/800/600",
        "thumbnail": "https://picsum.photos/seed/ev27/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-28T10:13:21.680Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": {
      "placement": 4,
      "kills": 2,
      "points": 50
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+8",
      "projectedRankChange": "4th → 1rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-28T12:13:21.680Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-29T12:16:18.804Z"
    },
    "history": [
      {
        "timestamp": "2026-08-28T10:13:21.680Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-28T12:13:21.680Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-29T10:16:18.804Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-8",
    "referenceNumber": "DSP-BGMI-0008",
    "tournamentId": "trn-3",
    "tournamentName": "BGMI Masters Season 1",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-2",
    "organizationName": "Storm Esports",
    "teamId": "team-100",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team8",
    "captain": "Player8",
    "game": "BGMI",
    "type": "Room Credential Issue",
    "priority": "Normal",
    "status": "Under Review",
    "description": "Dispute regarding room credential issue. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-26T11:35:52.466Z",
    "createdAt": "2026-08-26T03:48:49.193Z",
    "evidence": [
      {
        "id": "ev-8-1",
        "url": "https://picsum.photos/seed/ev18/800/600",
        "thumbnail": "https://picsum.photos/seed/ev18/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-26T03:48:49.193Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-8-2",
        "url": "https://picsum.photos/seed/ev28/800/600",
        "thumbnail": "https://picsum.photos/seed/ev28/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-26T03:48:49.193Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-26T05:48:49.193Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-26T03:48:49.193Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-26T05:48:49.193Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-26T11:35:52.466Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-9",
    "referenceNumber": "DSP-Valorant-0009",
    "tournamentId": "trn-2",
    "tournamentName": "Valorant Masters Season 3",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-4",
    "organizationName": "Hydra Events",
    "teamId": "team-100",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team9",
    "captain": "Player9",
    "game": "Valorant",
    "type": "Incorrect Placement",
    "priority": "Critical",
    "status": "Resolved — No Change",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-20T01:21:48.537Z",
    "createdAt": "2026-08-20T00:08:18.378Z",
    "evidence": [
      {
        "id": "ev-9-1",
        "url": "https://picsum.photos/seed/ev19/800/600",
        "thumbnail": "https://picsum.photos/seed/ev19/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-20T00:08:18.378Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-9-2",
        "url": "https://picsum.photos/seed/ev29/800/600",
        "thumbnail": "https://picsum.photos/seed/ev29/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-20T00:08:18.378Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": {
      "placement": 2,
      "kills": 2,
      "points": 35
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+8",
      "projectedRankChange": "2th → 2rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-20T02:08:18.378Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-20T03:21:48.537Z"
    },
    "history": [
      {
        "timestamp": "2026-08-20T00:08:18.378Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-20T02:08:18.378Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-20T01:21:48.537Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-10",
    "referenceNumber": "DSP-BGMI-0010",
    "tournamentId": "trn-5",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-1",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team10",
    "captain": "Player10",
    "game": "BGMI",
    "type": "Other",
    "priority": "Normal",
    "status": "Pending Evidence",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Unresolved >24h",
    "escalatedAt": "2026-08-14T06:12:37.526Z",
    "createdAt": "2026-08-12T10:04:27.895Z",
    "evidence": [
      {
        "id": "ev-10-1",
        "url": "https://picsum.photos/seed/ev110/800/600",
        "thumbnail": "https://picsum.photos/seed/ev110/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-12T10:04:27.895Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-10-2",
        "url": "https://picsum.photos/seed/ev210/800/600",
        "thumbnail": "https://picsum.photos/seed/ev210/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-12T10:04:27.895Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-12T10:04:27.895Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-14T06:12:37.526Z",
        "actor": "System",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Unresolved >24h"
      }
    ]
  },
  {
    "id": "dsp-11",
    "referenceNumber": "DSP-BGMI-0011",
    "tournamentId": "trn-1",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-1",
    "organizationName": "Hydra Events",
    "teamId": "team-200",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team11",
    "captain": "Player11",
    "game": "BGMI",
    "type": "Other",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-15T15:51:41.193Z",
    "createdAt": "2026-08-14T01:52:24.095Z",
    "evidence": [
      {
        "id": "ev-11-1",
        "url": "https://picsum.photos/seed/ev111/800/600",
        "thumbnail": "https://picsum.photos/seed/ev111/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-14T01:52:24.095Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-11-2",
        "url": "https://picsum.photos/seed/ev211/800/600",
        "thumbnail": "https://picsum.photos/seed/ev211/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-14T01:52:24.095Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-14T01:52:24.095Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-15T15:51:41.193Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-12",
    "referenceNumber": "DSP-PUBG-0012",
    "tournamentId": "trn-5",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-1",
    "organizationName": "NexGen Play",
    "teamId": "team-200",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team12",
    "captain": "Player12",
    "game": "PUBG",
    "type": "Organizer Conduct Complaint",
    "priority": "High",
    "status": "Escalated",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Unresolved >24h",
    "escalatedAt": "2026-08-26T05:46:50.952Z",
    "createdAt": "2026-08-25T08:06:42.741Z",
    "evidence": [
      {
        "id": "ev-12-1",
        "url": "https://picsum.photos/seed/ev112/800/600",
        "thumbnail": "https://picsum.photos/seed/ev112/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-25T08:06:42.741Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-25T08:06:42.741Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-26T05:46:50.952Z",
        "actor": "System",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Unresolved >24h"
      }
    ]
  },
  {
    "id": "dsp-13",
    "referenceNumber": "DSP-Free-0013",
    "tournamentId": "trn-3",
    "tournamentName": "Free Fire MAX Masters Season 1",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-4",
    "organizationName": "Hydra Events",
    "teamId": "team-200",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team13",
    "captain": "Player13",
    "game": "Free Fire MAX",
    "type": "Other",
    "priority": "High",
    "status": "Resolved — No Change",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-13T17:38:49.832Z",
    "createdAt": "2026-08-12T15:27:28.344Z",
    "evidence": [
      {
        "id": "ev-13-1",
        "url": "https://picsum.photos/seed/ev113/800/600",
        "thumbnail": "https://picsum.photos/seed/ev113/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-12T15:27:28.344Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-12T17:27:28.344Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-13T19:38:49.832Z"
    },
    "history": [
      {
        "timestamp": "2026-08-12T15:27:28.344Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-12T17:27:28.344Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-13T17:38:49.832Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-14",
    "referenceNumber": "DSP-BGMI-0014",
    "tournamentId": "trn-3",
    "tournamentName": "BGMI Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-4",
    "organizationName": "NexGen Play",
    "teamId": "team-300",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team14",
    "captain": "Player14",
    "game": "BGMI",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-09-04T19:59:43.813Z",
    "createdAt": "2026-09-04T07:39:27.565Z",
    "evidence": [
      {
        "id": "ev-14-1",
        "url": "https://picsum.photos/seed/ev114/800/600",
        "thumbnail": "https://picsum.photos/seed/ev114/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-04T07:39:27.565Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-09-04T21:59:43.813Z"
    },
    "history": [
      {
        "timestamp": "2026-09-04T07:39:27.565Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-04T19:59:43.813Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-09-04T05:39:27.565Z"
    }
  },
  {
    "id": "dsp-15",
    "referenceNumber": "DSP-Valorant-0015",
    "tournamentId": "trn-5",
    "tournamentName": "Valorant Masters Season 1",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-1",
    "organizationName": "NexGen Play",
    "teamId": "team-300",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team15",
    "captain": "Player15",
    "game": "Valorant",
    "type": "Other",
    "priority": "Normal",
    "status": "Dismissed",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-26T02:36:37.003Z",
    "createdAt": "2026-08-25T19:51:38.061Z",
    "evidence": [
      {
        "id": "ev-15-1",
        "url": "https://picsum.photos/seed/ev115/800/600",
        "thumbnail": "https://picsum.photos/seed/ev115/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-25T19:51:38.061Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-25T21:51:38.061Z"
    },
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-26T04:36:37.003Z"
    },
    "history": [
      {
        "timestamp": "2026-08-25T19:51:38.061Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-25T21:51:38.061Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-26T02:36:37.003Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-16",
    "referenceNumber": "DSP-COD-0016",
    "tournamentId": "trn-5",
    "tournamentName": "COD Mobile Masters Season 4",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-1",
    "organizationName": "Storm Esports",
    "teamId": "team-100",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team16",
    "captain": "Player16",
    "game": "COD Mobile",
    "type": "Incorrect Placement",
    "priority": "High",
    "status": "Pending Evidence",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Unresolved >24h",
    "escalatedAt": "2026-09-09T21:37:41.420Z",
    "createdAt": "2026-09-08T07:27:26.921Z",
    "evidence": [
      {
        "id": "ev-16-1",
        "url": "https://picsum.photos/seed/ev116/800/600",
        "thumbnail": "https://picsum.photos/seed/ev116/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-08T07:27:26.921Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": {
      "placement": 15,
      "kills": 5,
      "points": 10
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+2",
      "projectedRankChange": "3th → 1rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-08T07:27:26.921Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-09T21:37:41.420Z",
        "actor": "System",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Unresolved >24h"
      }
    ]
  },
  {
    "id": "dsp-17",
    "referenceNumber": "DSP-Valorant-0017",
    "tournamentId": "trn-5",
    "tournamentName": "Valorant Masters Season 1",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-2",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team17",
    "captain": "Player17",
    "game": "Valorant",
    "type": "Other",
    "priority": "High",
    "status": "Resolved — No Change",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-08-29T06:11:27.728Z",
    "createdAt": "2026-08-28T05:05:49.133Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-29T08:11:27.728Z"
    },
    "history": [
      {
        "timestamp": "2026-08-28T05:05:49.133Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-29T06:11:27.728Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-18",
    "referenceNumber": "DSP-BGMI-0018",
    "tournamentId": "trn-2",
    "tournamentName": "BGMI Masters Season 1",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-2",
    "organizationName": "Storm Esports",
    "teamId": "team-200",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team18",
    "captain": "Player18",
    "game": "BGMI",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-08-18T07:13:36.283Z",
    "createdAt": "2026-08-18T01:40:01.912Z",
    "evidence": [
      {
        "id": "ev-18-1",
        "url": "https://picsum.photos/seed/ev118/800/600",
        "thumbnail": "https://picsum.photos/seed/ev118/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-18T01:40:01.912Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-18-2",
        "url": "https://picsum.photos/seed/ev218/800/600",
        "thumbnail": "https://picsum.photos/seed/ev218/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-18T01:40:01.912Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-18T01:40:01.912Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-18T07:13:36.283Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-08-17T23:40:01.912Z"
    }
  },
  {
    "id": "dsp-19",
    "referenceNumber": "DSP-PUBG-0019",
    "tournamentId": "trn-5",
    "tournamentName": "PUBG Masters Season 2",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-2",
    "organizationName": "Storm Esports",
    "teamId": "team-100",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team19",
    "captain": "Player19",
    "game": "PUBG",
    "type": "Other",
    "priority": "High",
    "status": "Under Review",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-03T03:17:39.936Z",
    "createdAt": "2026-09-01T15:00:29.346Z",
    "evidence": [
      {
        "id": "ev-19-1",
        "url": "https://picsum.photos/seed/ev119/800/600",
        "thumbnail": "https://picsum.photos/seed/ev119/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-01T15:00:29.346Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-19-2",
        "url": "https://picsum.photos/seed/ev219/800/600",
        "thumbnail": "https://picsum.photos/seed/ev219/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-01T15:00:29.346Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-01T17:00:29.346Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-01T15:00:29.346Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-01T17:00:29.346Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-03T03:17:39.936Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-20",
    "referenceNumber": "DSP-Free-0020",
    "tournamentId": "trn-1",
    "tournamentName": "Free Fire MAX Masters Season 4",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-4",
    "organizationName": "Storm Esports",
    "teamId": "team-200",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team20",
    "captain": "Player20",
    "game": "Free Fire MAX",
    "type": "Unauthorized Player in Lobby",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding unauthorized player in lobby. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-17T12:23:04.203Z",
    "createdAt": "2026-08-15T13:35:36.508Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-15T15:35:36.508Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-15T13:35:36.508Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-15T15:35:36.508Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-17T12:23:04.203Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-21",
    "referenceNumber": "DSP-COD-0021",
    "tournamentId": "trn-1",
    "tournamentName": "COD Mobile Masters Season 3",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-4",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team21",
    "captain": "Player21",
    "game": "COD Mobile",
    "type": "Other",
    "priority": "Normal",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Unresolved >24h",
    "escalatedAt": "2026-08-17T14:50:53.817Z",
    "createdAt": "2026-08-17T11:13:15.720Z",
    "evidence": [
      {
        "id": "ev-21-1",
        "url": "https://picsum.photos/seed/ev121/800/600",
        "thumbnail": "https://picsum.photos/seed/ev121/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-17T11:13:15.720Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-21-2",
        "url": "https://picsum.photos/seed/ev221/800/600",
        "thumbnail": "https://picsum.photos/seed/ev221/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-17T11:13:15.720Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-17T16:50:53.817Z"
    },
    "history": [
      {
        "timestamp": "2026-08-17T11:13:15.720Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-17T14:50:53.817Z",
        "actor": "System",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Unresolved >24h"
      }
    ]
  },
  {
    "id": "dsp-22",
    "referenceNumber": "DSP-BGMI-0022",
    "tournamentId": "trn-3",
    "tournamentName": "BGMI Masters Season 4",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-3",
    "organizationName": "Global Gaming",
    "teamId": "team-200",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team22",
    "captain": "Player22",
    "game": "BGMI",
    "type": "Organizer Conduct Complaint",
    "priority": "Normal",
    "status": "Pending Evidence",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Unresolved >24h",
    "escalatedAt": "2026-08-26T13:59:35.422Z",
    "createdAt": "2026-08-25T11:39:44.034Z",
    "evidence": [
      {
        "id": "ev-22-1",
        "url": "https://picsum.photos/seed/ev122/800/600",
        "thumbnail": "https://picsum.photos/seed/ev122/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-25T11:39:44.034Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-25T11:39:44.034Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-26T13:59:35.422Z",
        "actor": "System",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Unresolved >24h"
      }
    ]
  },
  {
    "id": "dsp-23",
    "referenceNumber": "DSP-COD-0023",
    "tournamentId": "trn-5",
    "tournamentName": "COD Mobile Masters Season 1",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-4",
    "organizationName": "NexGen Play",
    "teamId": "team-200",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team23",
    "captain": "Player23",
    "game": "COD Mobile",
    "type": "Incorrect Kill Count",
    "priority": "High",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding incorrect kill count. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Correct our kill count.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-23T11:50:13.006Z",
    "createdAt": "2026-08-21T20:19:38.464Z",
    "evidence": [
      {
        "id": "ev-23-1",
        "url": "https://picsum.photos/seed/ev123/800/600",
        "thumbnail": "https://picsum.photos/seed/ev123/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-21T20:19:38.464Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": {
      "placement": 4,
      "kills": 2,
      "points": 10
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+4",
      "projectedRankChange": "2th → 1rd",
      "advancementImpact": "No advancement impact"
    },
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-21T22:19:38.464Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-23T13:50:13.006Z"
    },
    "history": [
      {
        "timestamp": "2026-08-21T20:19:38.464Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-21T22:19:38.464Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-23T11:50:13.006Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-24",
    "referenceNumber": "DSP-BGMI-0024",
    "tournamentId": "trn-5",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-5",
    "organizationName": "NexGen Play",
    "teamId": "team-200",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team24",
    "captain": "Player24",
    "game": "BGMI",
    "type": "Organizer Conduct Complaint",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-13T07:06:27.296Z",
    "createdAt": "2026-08-13T02:16:45.442Z",
    "evidence": [
      {
        "id": "ev-24-1",
        "url": "https://picsum.photos/seed/ev124/800/600",
        "thumbnail": "https://picsum.photos/seed/ev124/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-13T02:16:45.442Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-13T04:16:45.442Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-13T02:16:45.442Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-13T04:16:45.442Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-13T07:06:27.296Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-25",
    "referenceNumber": "DSP-BGMI-0025",
    "tournamentId": "trn-3",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-2",
    "organizationName": "Storm Esports",
    "teamId": "team-300",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team25",
    "captain": "Player25",
    "game": "BGMI",
    "type": "Incorrect Placement",
    "priority": "High",
    "status": "Resolved — No Change",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-13T19:55:41.478Z",
    "createdAt": "2026-08-11T22:35:26.154Z",
    "evidence": [],
    "linkedResult": {
      "placement": 15,
      "kills": 8,
      "points": 10
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+2",
      "projectedRankChange": "3th → 3rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-12T00:35:26.154Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-13T21:55:41.478Z"
    },
    "history": [
      {
        "timestamp": "2026-08-11T22:35:26.154Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-12T00:35:26.154Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-13T19:55:41.478Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-26",
    "referenceNumber": "DSP-Valorant-0026",
    "tournamentId": "trn-3",
    "tournamentName": "Valorant Masters Season 4",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-1",
    "organizationName": "Storm Esports",
    "teamId": "team-300",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team26",
    "captain": "Player26",
    "game": "Valorant",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Escalated",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-09-06T13:41:52.620Z",
    "createdAt": "2026-09-05T05:11:33.661Z",
    "evidence": [
      {
        "id": "ev-26-1",
        "url": "https://picsum.photos/seed/ev126/800/600",
        "thumbnail": "https://picsum.photos/seed/ev126/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-05T05:11:33.661Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-26-2",
        "url": "https://picsum.photos/seed/ev226/800/600",
        "thumbnail": "https://picsum.photos/seed/ev226/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-05T05:11:33.661Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-05T05:11:33.661Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-06T13:41:52.620Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-09-05T03:11:33.661Z"
    }
  },
  {
    "id": "dsp-27",
    "referenceNumber": "DSP-PUBG-0027",
    "tournamentId": "trn-4",
    "tournamentName": "PUBG Masters Season 1",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-1",
    "organizationName": "Global Gaming",
    "teamId": "team-200",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team27",
    "captain": "Player27",
    "game": "PUBG",
    "type": "Code of Conduct Violation",
    "priority": "Normal",
    "status": "Under Review",
    "description": "Dispute regarding code of conduct violation. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-09T19:02:33.246Z",
    "createdAt": "2026-09-07T20:27:08.371Z",
    "evidence": [
      {
        "id": "ev-27-1",
        "url": "https://picsum.photos/seed/ev127/800/600",
        "thumbnail": "https://picsum.photos/seed/ev127/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-07T20:27:08.371Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-27-2",
        "url": "https://picsum.photos/seed/ev227/800/600",
        "thumbnail": "https://picsum.photos/seed/ev227/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-07T20:27:08.371Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-07T22:27:08.371Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-07T20:27:08.371Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-07T22:27:08.371Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-09T19:02:33.246Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-28",
    "referenceNumber": "DSP-PUBG-0028",
    "tournamentId": "trn-4",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-3",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team28",
    "captain": "Player28",
    "game": "PUBG",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Dismissed",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-08-16T08:30:16.384Z",
    "createdAt": "2026-08-15T09:32:02.342Z",
    "evidence": [
      {
        "id": "ev-28-1",
        "url": "https://picsum.photos/seed/ev128/800/600",
        "thumbnail": "https://picsum.photos/seed/ev128/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-15T09:32:02.342Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-28-2",
        "url": "https://picsum.photos/seed/ev228/800/600",
        "thumbnail": "https://picsum.photos/seed/ev228/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-15T09:32:02.342Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-16T10:30:16.384Z"
    },
    "history": [
      {
        "timestamp": "2026-08-15T09:32:02.342Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-16T08:30:16.384Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-08-15T07:32:02.342Z"
    }
  },
  {
    "id": "dsp-29",
    "referenceNumber": "DSP-PUBG-0029",
    "tournamentId": "trn-2",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-3",
    "organizationName": "Storm Esports",
    "teamId": "team-300",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team29",
    "captain": "Player29",
    "game": "PUBG",
    "type": "Organizer Conduct Complaint",
    "priority": "High",
    "status": "Resolved — Correction Made",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-07T06:16:17.731Z",
    "createdAt": "2026-09-06T10:03:42.869Z",
    "evidence": [
      {
        "id": "ev-29-1",
        "url": "https://picsum.photos/seed/ev129/800/600",
        "thumbnail": "https://picsum.photos/seed/ev129/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-06T10:03:42.869Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-29-2",
        "url": "https://picsum.photos/seed/ev229/800/600",
        "thumbnail": "https://picsum.photos/seed/ev229/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-06T10:03:42.869Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-06T12:03:42.869Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — Correction Made",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-09-07T08:16:17.731Z"
    },
    "history": [
      {
        "timestamp": "2026-09-06T10:03:42.869Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-06T12:03:42.869Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-07T06:16:17.731Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-30",
    "referenceNumber": "DSP-PUBG-0030",
    "tournamentId": "trn-3",
    "tournamentName": "PUBG Masters Season 2",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-1",
    "organizationName": "Elite Tournaments",
    "teamId": "team-200",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team30",
    "captain": "Player30",
    "game": "PUBG",
    "type": "Unauthorized Player in Lobby",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding unauthorized player in lobby. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-19T00:23:46.795Z",
    "createdAt": "2026-08-18T11:10:23.065Z",
    "evidence": [
      {
        "id": "ev-30-1",
        "url": "https://picsum.photos/seed/ev130/800/600",
        "thumbnail": "https://picsum.photos/seed/ev130/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-18T11:10:23.065Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-18T11:10:23.065Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-19T00:23:46.795Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-31",
    "referenceNumber": "DSP-PUBG-0031",
    "tournamentId": "trn-5",
    "tournamentName": "PUBG Masters Season 3",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-2",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team31",
    "captain": "Player31",
    "game": "PUBG",
    "type": "Unauthorized Player in Lobby",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding unauthorized player in lobby. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-26T09:34:36.471Z",
    "createdAt": "2026-08-25T03:58:09.060Z",
    "evidence": [
      {
        "id": "ev-31-1",
        "url": "https://picsum.photos/seed/ev131/800/600",
        "thumbnail": "https://picsum.photos/seed/ev131/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-25T03:58:09.060Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-25T05:58:09.060Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-25T03:58:09.060Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-25T05:58:09.060Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-26T09:34:36.471Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-32",
    "referenceNumber": "DSP-Free-0032",
    "tournamentId": "trn-2",
    "tournamentName": "Free Fire MAX Masters Season 2",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-4",
    "organizationName": "Hydra Events",
    "teamId": "team-100",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team32",
    "captain": "Player32",
    "game": "Free Fire MAX",
    "type": "Incorrect Placement",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-09-10T13:11:15.085Z",
    "createdAt": "2026-09-09T00:46:31.802Z",
    "evidence": [
      {
        "id": "ev-32-1",
        "url": "https://picsum.photos/seed/ev132/800/600",
        "thumbnail": "https://picsum.photos/seed/ev132/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-09T00:46:31.802Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-32-2",
        "url": "https://picsum.photos/seed/ev232/800/600",
        "thumbnail": "https://picsum.photos/seed/ev232/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-09T00:46:31.802Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": {
      "placement": 1,
      "kills": 8,
      "points": 50
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+2",
      "projectedRankChange": "2th → 2rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-09T00:46:31.802Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-10T13:11:15.085Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-33",
    "referenceNumber": "DSP-Free-0033",
    "tournamentId": "trn-5",
    "tournamentName": "Free Fire MAX Masters Season 4",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-3",
    "organizationName": "NexGen Play",
    "teamId": "team-100",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team33",
    "captain": "Player33",
    "game": "Free Fire MAX",
    "type": "Technical Issue Not Addressed",
    "priority": "Normal",
    "status": "Pending Evidence",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-22T04:01:16.848Z",
    "createdAt": "2026-08-20T21:28:03.786Z",
    "evidence": [
      {
        "id": "ev-33-1",
        "url": "https://picsum.photos/seed/ev133/800/600",
        "thumbnail": "https://picsum.photos/seed/ev133/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-20T21:28:03.786Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-20T23:28:03.786Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-20T21:28:03.786Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-20T23:28:03.786Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-22T04:01:16.848Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-34",
    "referenceNumber": "DSP-Free-0034",
    "tournamentId": "trn-2",
    "tournamentName": "Free Fire MAX Masters Season 4",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-3",
    "organizationName": "Elite Tournaments",
    "teamId": "team-300",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team34",
    "captain": "Player34",
    "game": "Free Fire MAX",
    "type": "Technical Issue Not Addressed",
    "priority": "Normal",
    "status": "Dismissed",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-28T21:01:14.547Z",
    "createdAt": "2026-08-28T07:03:54.237Z",
    "evidence": [
      {
        "id": "ev-34-1",
        "url": "https://picsum.photos/seed/ev134/800/600",
        "thumbnail": "https://picsum.photos/seed/ev134/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-28T07:03:54.237Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-28T23:01:14.547Z"
    },
    "history": [
      {
        "timestamp": "2026-08-28T07:03:54.237Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-28T21:01:14.547Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-35",
    "referenceNumber": "DSP-COD-0035",
    "tournamentId": "trn-2",
    "tournamentName": "COD Mobile Masters Season 3",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-1",
    "organizationName": "Global Gaming",
    "teamId": "team-200",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team35",
    "captain": "Player35",
    "game": "COD Mobile",
    "type": "Room Credential Issue",
    "priority": "High",
    "status": "Dismissed",
    "description": "Dispute regarding room credential issue. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-23T09:43:40.426Z",
    "createdAt": "2026-08-22T10:37:23.671Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-23T11:43:40.426Z"
    },
    "history": [
      {
        "timestamp": "2026-08-22T10:37:23.671Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-23T09:43:40.426Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-36",
    "referenceNumber": "DSP-Valorant-0036",
    "tournamentId": "trn-3",
    "tournamentName": "Valorant Masters Season 2",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-4",
    "organizationName": "NexGen Play",
    "teamId": "team-300",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team36",
    "captain": "Player36",
    "game": "Valorant",
    "type": "Organizer Conduct Complaint",
    "priority": "High",
    "status": "Resolved — No Change",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-18T04:42:13.441Z",
    "createdAt": "2026-08-17T23:57:52.129Z",
    "evidence": [
      {
        "id": "ev-36-1",
        "url": "https://picsum.photos/seed/ev136/800/600",
        "thumbnail": "https://picsum.photos/seed/ev136/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-17T23:57:52.129Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-18T06:42:13.441Z"
    },
    "history": [
      {
        "timestamp": "2026-08-17T23:57:52.129Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-18T04:42:13.441Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-37",
    "referenceNumber": "DSP-COD-0037",
    "tournamentId": "trn-5",
    "tournamentName": "COD Mobile Masters Season 1",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-2",
    "organizationName": "Elite Tournaments",
    "teamId": "team-200",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team37",
    "captain": "Player37",
    "game": "COD Mobile",
    "type": "Room Credential Issue",
    "priority": "High",
    "status": "Resolved — No Change",
    "description": "Dispute regarding room credential issue. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-10T00:58:48.286Z",
    "createdAt": "2026-09-09T19:20:50.141Z",
    "evidence": [
      {
        "id": "ev-37-1",
        "url": "https://picsum.photos/seed/ev137/800/600",
        "thumbnail": "https://picsum.photos/seed/ev137/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-09T19:20:50.141Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-09T21:20:50.141Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-09-10T02:58:48.286Z"
    },
    "history": [
      {
        "timestamp": "2026-09-09T19:20:50.141Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-09T21:20:50.141Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-10T00:58:48.286Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-38",
    "referenceNumber": "DSP-BGMI-0038",
    "tournamentId": "trn-4",
    "tournamentName": "BGMI Masters Season 3",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-5",
    "organizationName": "NexGen Play",
    "teamId": "team-200",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team38",
    "captain": "Player38",
    "game": "BGMI",
    "type": "Room Credential Issue",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding room credential issue. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Other",
    "escalatedAt": "2026-08-17T04:04:33.403Z",
    "createdAt": "2026-08-16T11:13:55.689Z",
    "evidence": [
      {
        "id": "ev-38-1",
        "url": "https://picsum.photos/seed/ev138/800/600",
        "thumbnail": "https://picsum.photos/seed/ev138/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-16T11:13:55.689Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-38-2",
        "url": "https://picsum.photos/seed/ev238/800/600",
        "thumbnail": "https://picsum.photos/seed/ev238/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-16T11:13:55.689Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-16T11:13:55.689Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-17T04:04:33.403Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Other"
      }
    ]
  },
  {
    "id": "dsp-39",
    "referenceNumber": "DSP-COD-0039",
    "tournamentId": "trn-4",
    "tournamentName": "COD Mobile Masters Season 3",
    "tournamentSlug": "masters-season-2",
    "organizationId": "org-4",
    "organizationName": "Hydra Events",
    "teamId": "team-200",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team39",
    "captain": "Player39",
    "game": "COD Mobile",
    "type": "Incorrect Placement",
    "priority": "High",
    "status": "Escalated",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-08-12T18:10:47.456Z",
    "createdAt": "2026-08-12T14:00:06.249Z",
    "evidence": [
      {
        "id": "ev-39-1",
        "url": "https://picsum.photos/seed/ev139/800/600",
        "thumbnail": "https://picsum.photos/seed/ev139/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-12T14:00:06.249Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-39-2",
        "url": "https://picsum.photos/seed/ev239/800/600",
        "thumbnail": "https://picsum.photos/seed/ev239/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-12T14:00:06.249Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": {
      "placement": 15,
      "kills": 8,
      "points": 10
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+8",
      "projectedRankChange": "5th → 1rd",
      "advancementImpact": "No advancement impact"
    },
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-12T14:00:06.249Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-12T18:10:47.456Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-40",
    "referenceNumber": "DSP-BGMI-0040",
    "tournamentId": "trn-3",
    "tournamentName": "BGMI Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-1",
    "organizationName": "Hydra Events",
    "teamId": "team-300",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team40",
    "captain": "Player40",
    "game": "BGMI",
    "type": "Technical Issue Not Addressed",
    "priority": "Normal",
    "status": "Resolved — No Change",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-17T06:22:42.602Z",
    "createdAt": "2026-08-17T04:15:23.049Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-17T06:15:23.049Z"
    },
    "superAdminResolution": {
      "resolution": "Resolved — No Change",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-17T08:22:42.602Z"
    },
    "history": [
      {
        "timestamp": "2026-08-17T04:15:23.049Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-17T06:15:23.049Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-17T06:22:42.602Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-41",
    "referenceNumber": "DSP-Valorant-0041",
    "tournamentId": "trn-3",
    "tournamentName": "Valorant Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-4",
    "organizationName": "Global Gaming",
    "teamId": "team-100",
    "teamName": "Team Charlie",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team41",
    "captain": "Player41",
    "game": "Valorant",
    "type": "Disqualification Appeal",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding disqualification appeal. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "DQ Appeal",
    "escalatedAt": "2026-09-09T10:20:52.968Z",
    "createdAt": "2026-09-08T18:04:41.212Z",
    "evidence": [
      {
        "id": "ev-41-1",
        "url": "https://picsum.photos/seed/ev141/800/600",
        "thumbnail": "https://picsum.photos/seed/ev141/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-08T18:04:41.212Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-08T18:04:41.212Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-09T10:20:52.968Z",
        "actor": "Team Captain",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: DQ Appeal"
      }
    ],
    "dqStatus": {
      "isDisqualified": true,
      "reason": "Using restricted items in lobby.",
      "issuedBy": "Tournament Director",
      "issuedAt": "2026-09-08T16:04:41.212Z"
    }
  },
  {
    "id": "dsp-42",
    "referenceNumber": "DSP-Free-0042",
    "tournamentId": "trn-1",
    "tournamentName": "Free Fire MAX Masters Season 3",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-5",
    "organizationName": "Storm Esports",
    "teamId": "team-200",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team42",
    "captain": "Player42",
    "game": "Free Fire MAX",
    "type": "Code of Conduct Violation",
    "priority": "High",
    "status": "Under Review",
    "description": "Dispute regarding code of conduct violation. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-05T08:26:19.560Z",
    "createdAt": "2026-09-03T18:28:16.544Z",
    "evidence": [
      {
        "id": "ev-42-1",
        "url": "https://picsum.photos/seed/ev142/800/600",
        "thumbnail": "https://picsum.photos/seed/ev142/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-03T18:28:16.544Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-03T20:28:16.544Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-03T18:28:16.544Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-03T20:28:16.544Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-05T08:26:19.560Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-43",
    "referenceNumber": "DSP-PUBG-0043",
    "tournamentId": "trn-2",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-4",
    "organizationName": "Storm Esports",
    "teamId": "team-300",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team43",
    "captain": "Player43",
    "game": "PUBG",
    "type": "Organizer Conduct Complaint",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding organizer conduct complaint. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-08T01:29:22.939Z",
    "createdAt": "2026-09-06T02:43:12.061Z",
    "evidence": [
      {
        "id": "ev-43-1",
        "url": "https://picsum.photos/seed/ev143/800/600",
        "thumbnail": "https://picsum.photos/seed/ev143/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-06T02:43:12.061Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-43-2",
        "url": "https://picsum.photos/seed/ev243/800/600",
        "thumbnail": "https://picsum.photos/seed/ev243/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-06T02:43:12.061Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-06T04:43:12.061Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-06T02:43:12.061Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-06T04:43:12.061Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-08T01:29:22.939Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-44",
    "referenceNumber": "DSP-Valorant-0044",
    "tournamentId": "trn-2",
    "tournamentName": "Valorant Masters Season 1",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-1",
    "organizationName": "Hydra Events",
    "teamId": "team-100",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team44",
    "captain": "Player44",
    "game": "Valorant",
    "type": "Other",
    "priority": "High",
    "status": "Pending Evidence",
    "description": "Dispute regarding other. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-08-30T10:13:18.641Z",
    "createdAt": "2026-08-29T22:45:18.523Z",
    "evidence": [
      {
        "id": "ev-44-1",
        "url": "https://picsum.photos/seed/ev144/800/600",
        "thumbnail": "https://picsum.photos/seed/ev144/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-29T22:45:18.523Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-29T22:45:18.523Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-30T10:13:18.641Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-45",
    "referenceNumber": "DSP-COD-0045",
    "tournamentId": "trn-4",
    "tournamentName": "COD Mobile Masters Season 2",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-3",
    "organizationName": "Global Gaming",
    "teamId": "team-300",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team45",
    "captain": "Player45",
    "game": "COD Mobile",
    "type": "Incorrect Kill Count",
    "priority": "Critical",
    "status": "Escalated",
    "description": "Dispute regarding incorrect kill count. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Correct our kill count.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-06T12:51:52.713Z",
    "createdAt": "2026-09-04T18:23:25.087Z",
    "evidence": [],
    "linkedResult": {
      "placement": 1,
      "kills": 5,
      "points": 50
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+4",
      "projectedRankChange": "2th → 2rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-09-04T20:23:25.087Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-09-04T18:23:25.087Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-04T20:23:25.087Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-06T12:51:52.713Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-46",
    "referenceNumber": "DSP-Free-0046",
    "tournamentId": "trn-3",
    "tournamentName": "Free Fire MAX Masters Season 4",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-5",
    "organizationName": "NexGen Play",
    "teamId": "team-300",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team46",
    "captain": "Player46",
    "game": "Free Fire MAX",
    "type": "Room Credential Issue",
    "priority": "Normal",
    "status": "Dismissed",
    "description": "Dispute regarding room credential issue. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-31T12:04:13.619Z",
    "createdAt": "2026-08-30T00:48:52.732Z",
    "evidence": [
      {
        "id": "ev-46-1",
        "url": "https://picsum.photos/seed/ev146/800/600",
        "thumbnail": "https://picsum.photos/seed/ev146/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-30T00:48:52.732Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-46-2",
        "url": "https://picsum.photos/seed/ev246/800/600",
        "thumbnail": "https://picsum.photos/seed/ev246/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-30T00:48:52.732Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-30T02:48:52.732Z"
    },
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-08-31T14:04:13.619Z"
    },
    "history": [
      {
        "timestamp": "2026-08-30T00:48:52.732Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-30T02:48:52.732Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-31T12:04:13.619Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-47",
    "referenceNumber": "DSP-PUBG-0047",
    "tournamentId": "trn-4",
    "tournamentName": "PUBG Masters Season 4",
    "tournamentSlug": "masters-season-3",
    "organizationId": "org-4",
    "organizationName": "Elite Tournaments",
    "teamId": "team-200",
    "teamName": "Team Delta",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team47",
    "captain": "Player47",
    "game": "PUBG",
    "type": "Unauthorized Player in Lobby",
    "priority": "Critical",
    "status": "Pending Evidence",
    "description": "Dispute regarding unauthorized player in lobby. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-08-27T20:41:17.480Z",
    "createdAt": "2026-08-27T09:02:35.077Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": null,
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-27T09:02:35.077Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-27T20:41:17.480Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-48",
    "referenceNumber": "DSP-PUBG-0048",
    "tournamentId": "trn-3",
    "tournamentName": "PUBG Masters Season 1",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-3",
    "organizationName": "Global Gaming",
    "teamId": "team-300",
    "teamName": "Team Alpha",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team48",
    "captain": "Player48",
    "game": "PUBG",
    "type": "Technical Issue Not Addressed",
    "priority": "Normal",
    "status": "Pending Evidence",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-09-01T13:24:29.078Z",
    "createdAt": "2026-08-31T06:33:27.036Z",
    "evidence": [
      {
        "id": "ev-48-1",
        "url": "https://picsum.photos/seed/ev148/800/600",
        "thumbnail": "https://picsum.photos/seed/ev148/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-31T06:33:27.036Z",
        "description": "End of match results screen"
      },
      {
        "id": "ev-48-2",
        "url": "https://picsum.photos/seed/ev248/800/600",
        "thumbnail": "https://picsum.photos/seed/ev248/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-08-31T06:33:27.036Z",
        "description": "Lobby screenshot"
      }
    ],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-31T08:33:27.036Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-31T06:33:27.036Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-31T08:33:27.036Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-09-01T13:24:29.078Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  },
  {
    "id": "dsp-49",
    "referenceNumber": "DSP-BGMI-0049",
    "tournamentId": "trn-4",
    "tournamentName": "BGMI Masters Season 2",
    "tournamentSlug": "masters-season-4",
    "organizationId": "org-2",
    "organizationName": "Elite Tournaments",
    "teamId": "team-200",
    "teamName": "Team Bravo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team49",
    "captain": "Player49",
    "game": "BGMI",
    "type": "Incorrect Placement",
    "priority": "High",
    "status": "Dismissed",
    "description": "Dispute regarding incorrect placement. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Conflict of Interest",
    "escalatedAt": "2026-09-10T23:50:01.401Z",
    "createdAt": "2026-09-10T13:04:13.784Z",
    "evidence": [
      {
        "id": "ev-49-1",
        "url": "https://picsum.photos/seed/ev149/800/600",
        "thumbnail": "https://picsum.photos/seed/ev149/200/150",
        "type": "Screenshot",
        "submittedBy": "Team Captain",
        "submittedAt": "2026-09-10T13:04:13.784Z",
        "description": "End of match results screen"
      }
    ],
    "linkedResult": {
      "placement": 2,
      "kills": 2,
      "points": 20
    },
    "leaderboardImpact": {
      "projectedPointsChange": "+4",
      "projectedRankChange": "3th → 2rd",
      "advancementImpact": "Potentially changes qualification"
    },
    "directorResolution": null,
    "superAdminResolution": {
      "resolution": "Dismissed",
      "note": "Super Admin decision applied based on evidence provided.",
      "resolvedBy": "System Super Admin",
      "resolvedAt": "2026-09-11T01:50:01.401Z"
    },
    "history": [
      {
        "timestamp": "2026-09-10T13:04:13.784Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-09-10T23:50:01.401Z",
        "actor": "Org Admin",
        "previousStatus": "Open",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Conflict of Interest"
      }
    ]
  },
  {
    "id": "dsp-50",
    "referenceNumber": "DSP-PUBG-0050",
    "tournamentId": "trn-1",
    "tournamentName": "PUBG Masters Season 1",
    "tournamentSlug": "masters-season-1",
    "organizationId": "org-1",
    "organizationName": "Hydra Events",
    "teamId": "team-300",
    "teamName": "Team Echo",
    "teamLogo": "https://api.dicebear.com/7.x/initials/svg?seed=Team50",
    "captain": "Player50",
    "game": "PUBG",
    "type": "Technical Issue Not Addressed",
    "priority": "Critical",
    "status": "Under Review",
    "description": "Dispute regarding technical issue not addressed. Need urgent assistance as this affects our standing.",
    "requestedResolution": "Review and correct the issue.",
    "escalationReason": "Captain Appeal",
    "escalatedAt": "2026-08-30T01:21:04.039Z",
    "createdAt": "2026-08-29T12:06:06.055Z",
    "evidence": [],
    "linkedResult": null,
    "leaderboardImpact": null,
    "directorResolution": {
      "decision": "Resolved — No Change",
      "note": "Reviewed evidence. The published results match the logs.",
      "resolvedBy": "Tournament Director",
      "resolvedAt": "2026-08-29T14:06:06.055Z"
    },
    "superAdminResolution": null,
    "history": [
      {
        "timestamp": "2026-08-29T12:06:06.055Z",
        "actor": "Team Captain",
        "previousStatus": "None",
        "newStatus": "Open",
        "note": "Dispute submitted"
      },
      {
        "timestamp": "2026-08-29T14:06:06.055Z",
        "actor": "Tournament Director",
        "previousStatus": "Under Review",
        "newStatus": "Resolved — No Change",
        "note": "Reviewed evidence. The published results match the logs."
      },
      {
        "timestamp": "2026-08-30T01:21:04.039Z",
        "actor": "Team Captain",
        "previousStatus": "Resolved — No Change",
        "newStatus": "Escalated",
        "note": "Escalated to Super Admin: Captain Appeal"
      }
    ]
  }
];
