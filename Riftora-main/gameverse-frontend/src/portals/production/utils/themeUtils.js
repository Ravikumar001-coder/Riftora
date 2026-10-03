export const getThemeVariables = (tournament) => {
  if (!tournament) return {};

  const themeType = tournament.themeType || 'USE_ORG';

  // Fallbacks if CUSTOM or USE_ORG is selected
  const customPrimary = tournament.primaryColor || '#2563eb';
  const customSecondary = tournament.secondaryColor || '#1e3a8a';
  const customAccent = tournament.accentColor || '#3b82f6';

  switch (themeType) {
    case 'DARK_PRO':
      return {
        '--theme-primary': '#eab308', // Gold
        '--theme-secondary': '#1f2937', // Dark Grey
        '--theme-accent': '#fef08a',
      };
    case 'NEON_CYBER':
      return {
        '--theme-primary': '#06b6d4', // Cyan
        '--theme-secondary': '#7e22ce', // Purple
        '--theme-accent': '#a855f7',
      };
    case 'CLEAN_LIGHT':
      return {
        '--theme-primary': '#0f172a', // Slate 900
        '--theme-secondary': '#cbd5e1', // Slate 300
        '--theme-accent': '#64748b',
      };
    case 'FIRE_RED':
      return {
        '--theme-primary': '#ef4444', // Red 500
        '--theme-secondary': '#9a3412', // Orange 800
        '--theme-accent': '#f97316',
      };
    case 'CUSTOM':
    case 'USE_ORG':
    default:
      return {
        '--theme-primary': customPrimary,
        '--theme-secondary': customSecondary,
        '--theme-accent': customAccent,
      };
  }
};
