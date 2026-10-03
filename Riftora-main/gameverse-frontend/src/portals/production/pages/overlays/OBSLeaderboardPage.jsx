import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';
import { useOverlayWebSocket } from '../../../../features/command-center/api/useOverlayWebSocket';
import { useOverlayRefreshListener } from '../../../../features/command-center/api/useOverlayRefreshListener';
import { usePublicLeaderboard } from '../../../../features/leaderboard/api/useLeaderboardQueries';
import { getThemeVariables } from '../../utils/themeUtils';

const LeaderboardRow = ({ team, index, config, isLight }) => {
  const [flashClass, setFlashClass] = useState('');
  const prevRank = React.useRef(team.rank);

  useEffect(() => {
    if (prevRank.current !== team.rank) {
      if (team.rank < prevRank.current) {
        // Rank improved
        setFlashClass('bg-emerald-500/30 transition-none');
      } else if (team.rank > prevRank.current) {
        // Rank lost
        setFlashClass('bg-red-500/30 transition-none');
      }
      prevRank.current = team.rank;
      
      const timer = setTimeout(() => {
        setFlashClass('transition-colors duration-600 ease-out');
      }, 50); // Small delay to apply the background, then fade out
      return () => clearTimeout(timer);
    }
  }, [team.rank]);

  return (
    <tr className={`border-b last:border-b-0 ${isLight ? 'border-slate-200/50' : 'border-slate-800/50'} ${flashClass}`}>
      {config.showRank && (
        <td className="py-2.5">
          {team.rank === 1 ? <span className="font-black text-amber-500 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">01</span> :
           team.rank === 2 ? <span className="font-black text-slate-300 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">02</span> :
           team.rank === 3 ? <span className="font-black text-amber-600 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">03</span> :
           <span className="font-bold opacity-70 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">{team.rank.toString().padStart(2, '0')}</span>}
        </td>
      )}
      <td className="py-2.5 flex items-center gap-3">
        {config.showTeamLogo && (
          <div 
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-black shrink-0 overflow-hidden"
            style={{ 
              backgroundColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)', 
              color: 'var(--theme-primary)' 
            }}
          >
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.tag} className="w-full h-full object-cover" />
            ) : (
              <span>{team.tag || team.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
        )}
        <span className="font-bold tracking-wider [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">{team.name}</span>
      </td>
      {config.showPlacement && <td className="text-center py-2.5 font-bold [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">{team.plc}</td>}
      {config.showKills && <td className="text-center py-2.5 font-bold [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">{team.kills}</td>}
      {config.showTotal && <td className="text-right py-2.5 font-black text-blue-400 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">{team.pts}</td>}
    </tr>
  );
};

export function OBSLeaderboardPage() {
  const { tournamentId, token } = useParams();
  
  // Listen for config changes over WebSocket to trigger a query refetch
  useOverlayRefreshListener(tournamentId);

  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'leaderboard_full', token);
  const { data: tournament, isLoading: isTournamentLoading, isError: isTournamentError } = useTournament(tournamentId);

  const isLoading = isConfigLoading || isTournamentLoading;
  const isError = isConfigError || isTournamentError;

  // Handle transparent body background and dynamic fonts
  useEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    
    // Load font family from config or tournament branding
    const fontFamily = config.fontFamily || (tournament?.branding?.fontFamily) || 'Inter';
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;
    
    let link = document.getElementById('overlay-font');
    if (!link) {
      link = document.createElement('link');
      link.id = 'overlay-font';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = fontUrl;
    
    const originalFontFamily = document.body.style.fontFamily;
    document.body.style.fontFamily = `"${fontFamily}", sans-serif`;

    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
      document.body.style.fontFamily = originalFontFamily;
      // Optional: remove font link if needed
    };
  }, [config.fontFamily, tournament?.branding?.fontFamily]);

  // Diagnostic states
  if (isLoading) {
    return null; // Don't show loading spinners on broadcast overlay to prevent flashing
  }

  const renderDiagnostic = (title, message) => (
    <div className="w-full h-screen flex items-center justify-center p-8 bg-transparent">
      <div className="bg-slate-900/95 backdrop-blur border border-slate-700/50 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-1">{title}</h2>
        <p className="text-xs text-slate-400">{message}</p>
      </div>
    </div>
  );

  if (isConfigError) {
    const errorMessage = configError?.response?.data?.error?.message;
    if (errorMessage === 'OVERLAY_EXPIRED') {
      return renderDiagnostic('Overlay Expired', 'This tournament has ended and its overlays are no longer active.');
    }
    return renderDiagnostic('Invalid Overlay Token', 'This overlay token is invalid, expired, or you are trying to access the wrong tournament.');
  }

  if (isTournamentError || !tournament) {
    return renderDiagnostic('Tournament Not Found', 'The requested tournament data could not be loaded.');
  }

  let parsedStyle = {};
  let parsedPosition = {};
  if (overlayConfig) {
    try { parsedStyle = overlayConfig.styleCfg ? JSON.parse(overlayConfig.styleCfg) : {}; } catch (e) {}
    try { parsedPosition = overlayConfig.positionCfg ? JSON.parse(overlayConfig.positionCfg) : {}; } catch (e) {}
  }

  // Merge backend config with defaults, or use frontend config structure mapped to backend fields if necessary
  const config = overlayConfig ? { ...defaultOverlayConfigs.leaderboard, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.leaderboard;
  if (!config.enabled) {
    // Return empty transparent div if disabled, so OBS just shows nothing
    return <div className="w-full h-screen bg-transparent" />;
  }

  // Live data state from STOMP subscription
  const [liveData, setLiveData] = useState(null);
  const { isConnected, subscribeToTopic } = useOverlayWebSocket(tournamentId);

  useEffect(() => {
    // This subscribe call returns a cleanup function to unsubscribe
    const unsubscribe = subscribeToTopic('leaderboard', (data) => {
      setLiveData(data);
    });
    return unsubscribe;
  }, [subscribeToTopic]);

  // Polling fallback
  const isPollingEnabled = !isConnected && config.pollingFallbackEnabled;
  const { data: pollingData } = usePublicLeaderboard(tournamentId, {
    enabled: isPollingEnabled,
    refetchInterval: 15000 // 15 seconds
  });

  const activeData = (isPollingEnabled && pollingData) ? pollingData : liveData;

  // Mock data for battle royale leaderboard (used only if liveData is null or empty)
  const fallbackTeams = [
    { rank: 1, name: 'Team Phoenix', plc: 48, kills: 32, pts: 80, tag: 'PHX', logoUrl: null },
    { rank: 2, name: 'Cyber Ninjas', plc: 42, kills: 29, pts: 71, tag: 'CYB', logoUrl: null },
    { rank: 3, name: 'Rogue Squad', plc: 39, kills: 26, pts: 65, tag: 'ROG', logoUrl: null },
    { rank: 4, name: 'Velocity X', plc: 37, kills: 24, pts: 61, tag: 'VLX', logoUrl: null },
    { rank: 5, name: 'Nova Esports', plc: 36, kills: 21, pts: 57, tag: 'NVA', logoUrl: null },
    { rank: 6, name: 'Hydra Gaming', plc: 33, kills: 19, pts: 52, tag: 'HYD', logoUrl: null },
    { rank: 7, name: 'Storm Kings', plc: 31, kills: 17, pts: 48, tag: 'STM', logoUrl: null },
    { rank: 8, name: 'Alpha Strike', plc: 28, kills: 15, pts: 43, tag: 'ALP', logoUrl: null },
    { rank: 9, name: 'Omega Force', plc: 25, kills: 14, pts: 39, tag: 'OMG', logoUrl: null },
    { rank: 10, name: 'Nexus Prime', plc: 22, kills: 12, pts: 34, tag: 'NXP', logoUrl: null },
  ];

  let displayTeams = fallbackTeams;
  if (activeData && activeData.entries && activeData.entries.length > 0) {
      displayTeams = activeData.entries.map(entry => ({
          rank: entry.currentRank,
          name: entry.teamName,
          plc: entry.avgPlacement || 0,
          kills: entry.totalKills || 0,
          pts: entry.totalPoints || 0,
          tag: entry.teamTag,
          logoUrl: entry.logoUrl
      }));
  }

  // Helper to determine flex alignment based on position prop
  const getPositionClasses = () => {
    switch (config.position) {
      case 'Top Left': return 'items-start justify-start';
      case 'Top Center': return 'items-start justify-center';
      case 'Top Right': return 'items-start justify-end';
      case 'Bottom Left': return 'items-end justify-start';
      case 'Bottom Center': return 'items-end justify-center';
      case 'Bottom Right': return 'items-end justify-end';
      case 'Center': default: return 'items-center justify-center';
    }
  };

  const getAnimationClasses = () => {
    // Respect prefers-reduced-motion via Tailwind standard classes
    const base = 'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none';
    
    // Just applying simple entrance anims when component mounts (using standard Tailwind animate classes if available, otherwise manual keyframes would be needed. For simplicity, we just rely on static rendering if it's OBS since OBS loads the page).
    // The prompt says "support a restrained entrance/update animation".
    switch (config.animation) {
      case 'Fade': return `${base} animate-in fade-in motion-reduce:animate-none`;
      case 'Slide': return `${base} animate-in slide-in-from-bottom-8 fade-in motion-reduce:animate-none`;
      case 'Pop': return `${base} animate-in zoom-in-95 fade-in motion-reduce:animate-none`;
      case 'None':
      default: return '';
    }
  };

  const isLight = config.theme === 'Light';
  const bgColor = isLight ? 'bg-white/95' : 'bg-slate-900/95';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const borderColor = isLight ? 'border-slate-200' : 'border-slate-700/50';

  return (
    <div 
      className={`w-full h-screen bg-transparent overflow-hidden p-[4%] md:p-[6%] flex ${getPositionClasses()} relative`}
      style={getThemeVariables(tournament)}
    >
      <OverlayConnectionStatus tournamentId={tournamentId} />
      
      {/* Organization Logo in corner */}
      {tournament?.secondaryLogoUrl && (
        <img 
          src={tournament.secondaryLogoUrl} 
          alt="Org Logo" 
          className="absolute top-8 right-8 w-16 h-16 object-contain opacity-80" 
        />
      )}

      <div 
        className={`${getAnimationClasses()}`}
        style={{ 
          transform: `scale(${config.scale / 100})`, 
          opacity: config.opacity / 100, 
          transformOrigin: config.position.includes('Top') ? 'top' : config.position.includes('Bottom') ? 'bottom' : 'center',
          maxWidth: '550px',
          width: '100%'
        }}
      >
        <div className={`rounded-xl overflow-hidden shadow-2xl backdrop-blur-md border ${bgColor} ${borderColor} ${textColor}`}>
          
          {/* Header */}
          <div className="px-5 py-3" style={{ backgroundColor: 'var(--theme-primary)' }}>
            <h2 className="text-[11px] font-black tracking-widest text-white/90 uppercase mb-0.5 [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
              {tournament?.name}
            </h2>
            <h1 className="text-lg font-black tracking-wider text-white uppercase [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">
              OVERALL LEADERBOARD
            </h1>
          </div>

          {/* Table */}
          <div className="p-4 bg-black/40">
            <table className="w-full text-sm [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-200/50 text-slate-100' : 'border-slate-700/50 text-slate-300'}`}>
                  {config.showRank && <th className="text-left pb-2 w-10 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">#</th>}
                  <th className="text-left pb-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">TEAM</th>
                  {config.showPlacement && <th className="text-center pb-2 px-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">PLC</th>}
                  {config.showKills && <th className="text-center pb-2 px-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">KILLS</th>}
                  {config.showTotal && <th className="text-right pb-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">TOTAL</th>}
                </tr>
              </thead>
              <tbody className="text-white font-medium">
                {displayTeams.slice(0, Math.min(config.rowsVisible || 10, 10)).map((t, i) => (
                  <LeaderboardRow key={t.name} team={t} index={i} config={config} isLight={isLight} />
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
