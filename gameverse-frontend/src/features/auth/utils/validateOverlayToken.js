const mockOverlayTokens = {
  "demo-token": {
    tournamentId: "t1", // using 't1' as the mock tournament id throughout the project
    permissions: ["leaderboard", "top10", "matchbar", "sponsor", "result", "finale"]
  },
  "t2-token": {
    tournamentId: "t2",
    permissions: ["leaderboard"]
  }
};

/**
 * Validates a token for overlay access.
 * Returns { valid: boolean, error: string }
 */
export function validateOverlayToken(token, tournamentId) {
  if (!token) {
    return { valid: false, error: 'MISSING_TOKEN' };
  }

  const tokenData = mockOverlayTokens[token];
  
  if (!tokenData) {
    return { valid: false, error: 'INVALID_TOKEN' };
  }

  if (tokenData.tournamentId !== tournamentId) {
    return { valid: false, error: 'WRONG_TOURNAMENT' };
  }

  return { valid: true, error: null };
}
