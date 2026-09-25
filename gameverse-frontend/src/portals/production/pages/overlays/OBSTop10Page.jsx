import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';
import { useOverlayWebSocket } from '../../../../features/command-center/api/useOverlayWebSocket';
import { useOverlayRefreshListener } from '../../../../features/command-center/api/useOverlayRefreshListener';
import { usePublicLeaderboard } from '../../../../features/leaderboard/api/useLeaderboardQueries';
import { getThemeVariables } from '../../utils/themeUtils';

const Top10Row = ({ team, config, isLight }) => {
  const [flashClass, setFlashClass] = useState('');
  const prevRank = React.useRef(team.rank);

  useEffect(() => {
    if (prevRank.current !== team.rank) {
      if (team.rank < prevRank.current) {
        setFlashClass('bg-emerald-500/30 transition-none');
      } else if (team.rank > prevRank.current) {
        setFlashClass('bg-red-500/30 transition-none');
      }
      prevRank.current = team.rank;
      
      const timer = setTimeout(() => {
        setFlashClass('transition-colors duration-600 ease-out');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [team.rank]);

  const isLeader = team.rank === 1;

  const renderMovement = (movement) => {
    switch(movement) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
      case 'new': return <span className="text-[9px] font-bold text-amber-500 uppercase">New</span>;
      case 'same':
      default: return <Minus className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <tr className={`border-b last:border-b-0 ${isLight ? 'border-slate-100' : 'border-slate-800/50'} ${isLeader ? (isLight ? 'bg-blue-50/50' : 'bg-blue-900/20') : ''} ${flashClass}`}>
      {config.showRank && (
        <td className="py-2.5">
          {isLeader ? (
            <span className="font-black text-amber-500 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">01</span>
          ) : (
            <span className={`font-bold ${isLight ? 'text-slate-400' : 'text-slate-300'} [text-shadow:_0_1px_2px_rgba(0,0,0,1)]`}>
              {team.rank.toString().padStart(2, '0')}
            </span>
          )}
        </td>
      )}
      <td className="py-2.5 text-center">
        {renderMovement(team.movement)}
      </td>
      <td className="py-2.5 flex items-center gap-3">
        {config.showTeamLogo && (
          <div 
            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black shrink-0 overflow-hidden ${isLeader ? 'bg-amber-500/20 text-amber-500' : ''}`}
            style={!isLeader ? { 
              backgroundColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)', 
              color: 'var(--theme-primary)' 
            } : {}}
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
      {config.showKills && (
        <td className="py-2.5 text-center font-medium [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">
          {team.kills}
        </td>
      )}
      {config.showTotal && (
        <td className="py-2.5 text-right font-black text-blue-400 text-base [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">
          {team.pts}
        </td>
      )}
    </tr>
  );
};

export function OBSTop10Page() {
  const { tournamentId, token } = useParams();
  
  useOverlayRefreshListener(tournamentId);

  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'top10', token);
  const { data: tournament, isLoading: isTournamentLoading, isError: isTournamentError } = useTournament(tournamentId);

  const isLoading = isConfigLoading || isTournamentLoading;
  const isError = isConfigError || isTournamentError;

  // Handle transparent background directly and dynamic fonts
  useEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';

    // Load font family from config or tournament branding
    const fontFamily = config?.fontFamily || (tournament?.branding?.fontFamily) || 'Inter';
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
    };
  }, [config?.fontFamily, tournament?.branding?.fontFamily]);

  if (isLoading) {
    return null;
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

  const config = overlayConfig ? { ...defaultOverlayConfigs.top10, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.top10;
  if (!config.enabled) {
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

  const fallbackTop10 = [
    { rank: 1, name: 'Team Phoenix', kills: 32, pts: 80, tag: 'PHX', logoUrl: null, movement: 'up' },
    { rank: 2, name: 'Cyber Ninjas', kills: 29, pts: 71, tag: 'CYB', logoUrl: null, movement: 'same' },
    { rank: 3, name: 'Rogue Squad', kills: 26, pts: 65, tag: 'ROG', logoUrl: null, movement: 'up' },
    { rank: 4, name: 'Velocity X', kills: 24, pts: 61, tag: 'VLX', logoUrl: null, movement: 'down' },
    { rank: 5, name: 'Nova Esports', kills: 21, pts: 57, tag: 'NVA', logoUrl: null, movement: 'same' },
    { rank: 6, name: 'Hydra Gaming', kills: 19, pts: 52, tag: 'HYD', logoUrl: null, movement: 'up' },
    { rank: 7, name: 'Storm Kings', kills: 17, pts: 48, tag: 'STM', logoUrl: null, movement: 'down' },
    { rank: 8, name: 'Alpha Strike', kills: 15, pts: 43, tag: 'ALP', logoUrl: null, movement: 'down' },
    { rank: 9, name: 'Omega Force', kills: 14, pts: 39, tag: 'OMG', logoUrl: null, movement: 'same' },
    { rank: 10, name: 'Nexus Prime', kills: 12, pts: 34, tag: 'NXP', logoUrl: null, movement: 'new' },
  ];

  let displayTop10 = fallbackTop10;
  if (activeData && activeData.entries && activeData.entries.length > 0) {
      displayTop10 = activeData.entries.slice(0, 10).map(entry => {
          let movement = 'same';
          if (entry.rankChange > 0) movement = 'up';
          else if (entry.rankChange < 0) movement = 'down';
          
          return {
              rank: entry.currentRank,
              name: entry.teamName,
              kills: entry.totalKills || 0,
              pts: entry.totalPoints || 0,
              tag: entry.teamTag,
              logoUrl: entry.logoUrl,
              movement: movement
          };
      });
  }

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
    const base = 'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none';
    switch (config.animation) {
      case 'Fade': return `${base} animate-in fade-in motion-reduce:animate-none`;
      case 'Slide': return `${base} animate-in slide-in-from-bottom-8 fade-in motion-reduce:animate-none`;
      case 'Pop': return `${base} animate-in zoom-in-95 fade-in motion-reduce:animate-none`;
      case 'None': default: return '';
    }
  };

  const isLight = config.theme === 'Light';
  const bgColor = isLight ? 'bg-white/95' : 'bg-slate-900/95';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const borderColor = isLight ? 'border-slate-200' : 'border-slate-700/50';

  const renderMovement = (movement) => {
    switch(movement) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
      case 'new': return <span className="text-[9px] font-bold text-amber-500 uppercase">New</span>;
      case 'same':
      default: return <Minus className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

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
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <div className={`rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md border ${bgColor} ${borderColor} ${textColor}`}>
          
          {/* Header */}
          <div 
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
          >
            <div>
              <h2 className="text-[10px] font-black tracking-widest text-blue-100 uppercase mb-0.5 [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
                RIFTORA
              </h2>
              <h1 className="text-xl font-black tracking-widest text-white uppercase drop-shadow-md [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">
                TOP 10
              </h1>
            </div>
            <div className="text-right">
              {config.showTournamentName && (
                <div className="text-[10px] font-bold text-blue-100 uppercase tracking-wider [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
                  {tournament.name}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="p-4 bg-black/40">
            <table className="w-full text-sm [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-200/50 text-slate-100' : 'border-slate-700/50 text-slate-300'}`}>
                  {config.showRank && <th className="text-left pb-2 w-8 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">#</th>}
                  <th className="text-center pb-2 w-8 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">+/-</th>
                  <th className="text-left pb-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">TEAM</th>
                  {config.showKills && <th className="text-center pb-2 px-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">KILLS</th>}
                  {config.showTotal && <th className="text-right pb-2 font-bold text-[10px] tracking-widest text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">TOTAL</th>}
                </tr>
              </thead>
              <tbody className="text-white font-medium">
                {displayTop10.slice(0, Math.min(config.numTeams || 10, 10)).map((t, i) => (
                  <Top10Row key={t.name} team={t} config={config} isLight={isLight} />
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
