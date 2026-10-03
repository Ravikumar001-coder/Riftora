export const defaultOverlayConfigs = {
  leaderboard: {
    enabled: true,
    scale: 100,
    opacity: 100,
    position: 'Center',
    theme: 'Dark',
    rowsVisible: 10,
    showRank: true,
    showTeamLogo: true,
    showTeamName: true,
    showPlacement: true,
    showKills: true,
    showTotal: true
  },
  top10: {
    enabled: true,
    scale: 100,
    opacity: 100,
    position: 'Center',
    theme: 'Dark',
    numTeams: 10,
    showTeamLogo: true,
    showRank: true,
    showKills: true,
    showTotal: true,
    animation: 'Slide'
  },
  matchbar: {
    enabled: true,
    scale: 100,
    opacity: 100,
    position: 'Top Center',
    theme: 'Dark',
    showTournamentName: true,
    showMatchNumber: true,
    showMap: true,
    showLobby: true,
    showMatchStatus: true,
    showTeamCount: true,
    showMatchTimer: true
  },
  sponsor: {
    enabled: false,
    scale: 100,
    opacity: 100,
    position: 'Bottom Right',
    theme: 'Light',
    currentSponsor: 'Nova Gaming',
    rotation: true,
    duration: 8,
    showLogo: true,
    showCampaignText: true,
    animation: 'Fade'
  },
  result: {
    enabled: false,
    scale: 100,
    opacity: 100,
    position: 'Center',
    theme: 'Dark',
    showMatchNumber: true,
    showMap: true,
    showWinningTeam: true,
    showPlacement: true,
    showKills: true,
    showTotal: true,
    showMvp: true,
    animation: 'Pop'
  },
  finale: {
    enabled: false,
    scale: 100,
    opacity: 100,
    position: 'Center',
    theme: 'Dark',
    showChampion: true,
    showRunnerUp: true,
    showPrize: true,
    showTournamentName: true,
    showTrophy: true,
    animation: 'Fade',
    duration: 15
  }
};

export const overlayTypes = [
  { id: 'leaderboard', name: 'Leaderboard', description: 'Live tournament standings' },
  { id: 'top10', name: 'Top 10', description: 'Top performing teams' },
  { id: 'matchbar', name: 'Match Bar', description: 'Current match information' },
  { id: 'sponsor', name: 'Sponsor', description: 'Sponsor branding' },
  { id: 'result', name: 'Result', description: 'Match result presentation' },
  { id: 'finale', name: 'Finale', description: 'Championship finale' }
];

export const getStatus = (id, config) => {
  if (!config) return 'DISABLED';
  if (!config.enabled) return 'DISABLED';
  
  if (id === 'sponsor') {
    if (!config.currentSponsor) return 'NEEDS ATTENTION';
    return 'READY';
  }
  
  return 'READY';
};
