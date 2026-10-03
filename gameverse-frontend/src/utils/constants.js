export const SUPPORTED_GAMES = {
  BGMI: 'BGMI',
  FREE_FIRE: 'Free Fire'
};

export const GAME_ROADMAP_DEFAULTS = {
  'BGMI': {
    stages: [
      { name: 'Qualifiers', type: 'qualifiers', order: 1, teamCapacity: 1000, matchCount: 3, advanceCount: 256 },
      { name: 'Quarter Finals', type: 'quarter_finals', order: 2, teamCapacity: 256, matchCount: 4, advanceCount: 64 },
      { name: 'Semi Finals', type: 'semi_finals', order: 3, teamCapacity: 64, matchCount: 5, advanceCount: 16 },
      { name: 'Grand Finals', type: 'grand_finals', order: 4, teamCapacity: 16, matchCount: 6, advanceCount: 1 }
    ]
  },
  'Free Fire': {
    stages: [
      { name: 'Qualifiers', type: 'qualifiers', order: 1, teamCapacity: 576, matchCount: 3, advanceCount: 144 },
      { name: 'Quarter Finals', type: 'quarter_finals', order: 2, teamCapacity: 144, matchCount: 4, advanceCount: 36 },
      { name: 'Semi Finals', type: 'semi_finals', order: 3, teamCapacity: 36, matchCount: 5, advanceCount: 12 },
      { name: 'Grand Finals', type: 'grand_finals', order: 4, teamCapacity: 12, matchCount: 6, advanceCount: 1 }
    ]
  }
};
export const SCORING_DEFAULTS = {
  'BGMI': {
    killPoints: 1,
    placementPoints: {
      1: 10, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 1,
      9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0
    }
  },
  'Free Fire': {
    killPoints: 1,
    placementPoints: {
      1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3,
      9: 2, 10: 1, 11: 0, 12: 0
    }
  }
};

export const TIEBREAKER_DEFAULTS = [
  { id: 'TOTAL_POINTS', label: 'Total Points', defaultEnabled: true, order: 1 },
  { id: 'MATCH_WINS', label: 'Match Wins (WWCD/Booyah)', defaultEnabled: true, order: 2 },
  { id: 'PLACEMENT_POINTS', label: 'Placement Points', defaultEnabled: true, order: 3 },
  { id: 'KILL_POINTS', label: 'Kill Points', defaultEnabled: true, order: 4 },
  { id: 'LAST_MATCH_PLACEMENT', label: 'Last Match Placement', defaultEnabled: true, order: 5 }
];

export const MAP_DEFAULTS = {
  'BGMI': ['Erangel', 'Miramar', 'Sanhok', 'Vikendi'],
  'Free Fire': ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'Nexterra']
};
