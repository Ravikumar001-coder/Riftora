import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle, Clock } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';
import { useOverlayWebSocket } from '../../../../features/command-center/api/useOverlayWebSocket';
import { useOverlayRefreshListener } from '../../../../features/command-center/api/useOverlayRefreshListener';

import { getThemeVariables } from '../../utils/themeUtils';

export function OBSMatchBarPage() {
  const { tournamentId, token } = useParams();
  
  useOverlayRefreshListener(tournamentId);

  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'match_info_bar', token);
  const { data: tournament, isLoading: isTournamentLoading, isError: isTournamentError } = useTournament(tournamentId);

  // Timer state for demo live mock
  const [elapsedSeconds, setElapsedSeconds] = useState(522); // 08:42

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

  let parsedStyle = {};
  let parsedPosition = {};
  if (overlayConfig) {
    try { parsedStyle = overlayConfig.styleCfg ? JSON.parse(overlayConfig.styleCfg) : {}; } catch (e) {}
    try { parsedPosition = overlayConfig.positionCfg ? JSON.parse(overlayConfig.positionCfg) : {}; } catch (e) {}
  }

  const config = overlayConfig ? { ...defaultOverlayConfigs.matchbar, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.matchbar;
  // Timer mock increment
  useEffect(() => {
    if (config.enabled && config.showMatchTimer) {
      const interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [config.enabled, config.showMatchTimer]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  if (!config.enabled) {
    return <div className="w-full h-screen bg-transparent" />;
  }

  // Live data state from STOMP subscription
  const [liveMatches, setLiveMatches] = useState(null);
  const { subscribeToTopic } = useOverlayWebSocket(tournamentId);

  useEffect(() => {
    // The server returns a list of matches, we will pick the currently LIVE one, or the upcoming one
    const unsubscribe = subscribeToTopic('match_status_changed', (data) => {
      setLiveMatches(data);
    });
    return unsubscribe;
  }, [subscribeToTopic]);

  // Mock data for match bar
  const fallbackMatch = {
    number: '03',
    map: 'ERANGEL',
    phase: 'ROUND 2',
    status: 'LIVE' // UPCOMING, LIVE, PAUSED, COMPLETED, CANCELLED
  };

  let displayMatch = fallbackMatch;
  if (liveMatches && Array.isArray(liveMatches) && liveMatches.length > 0) {
      // Find the currently live match, or paused, or the next upcoming one
      const activeMatch = liveMatches.find(m => m.status === 'LIVE' || m.status === 'PAUSED') 
          || liveMatches.find(m => m.status === 'UPCOMING') 
          || liveMatches[0];
          
      displayMatch = {
          number: activeMatch.matchNumber ? String(activeMatch.matchNumber).padStart(2, '0') : '01',
          map: activeMatch.matchLabel || 'UNKNOWN',
          phase: activeMatch.roundNumber ? `ROUND ${activeMatch.roundNumber}` : '',
          status: activeMatch.status || 'UPCOMING'
      };
  }

  const getPositionClasses = () => {
    switch (config.position) {
      case 'Top Left': return 'items-start justify-start';
      case 'Top Center': return 'items-start justify-center';
      case 'Top Right': return 'items-start justify-end';
      case 'Bottom Left': return 'items-end justify-start';
      case 'Bottom Center': return 'items-end justify-center';
      case 'Bottom Right': return 'items-end justify-end';
      case 'Center': default: return 'items-end justify-center'; // Matchbars default to bottom naturally
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

  const renderStatus = () => {
    if (!config.showMatchStatus) return null;
    
    let statusClass = 'text-slate-400';
    let statusText = displayMatch.status;
    let icon = null;

    if (statusText === 'LIVE') {
      statusClass = 'text-red-500';
      icon = <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1.5" />;
    } else if (statusText === 'UPCOMING') {
      statusClass = 'text-amber-500';
    } else if (statusText === 'COMPLETED') {
      statusClass = 'text-emerald-500';
    }

    return (
      <div className={`flex items-center font-black tracking-widest ${statusClass}`}>
        {icon}
        {statusText}
      </div>
    );
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
        className={`${getAnimationClasses()} w-full`}
        style={{ 
          transform: `scale(${config.scale / 100})`, 
          opacity: config.opacity / 100, 
          transformOrigin: config.position.includes('Top') ? 'top' : config.position.includes('Bottom') ? 'bottom' : 'center',
          maxWidth: '1200px'
        }}
      >
        <div className={`rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md border ${bgColor} ${borderColor} ${textColor} flex items-stretch h-14 md:h-16 lg:h-18`}>
          
          {/* Brand Block */}
          <div 
            className="px-6 flex flex-col justify-center shrink-0 border-r border-white/20"
            style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
          >
            <h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase drop-shadow-md [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">
              RIFTORA
            </h2>
          </div>

          {/* Context Block */}
          <div className="flex-1 px-4 md:px-6 flex items-center gap-4 md:gap-8 overflow-hidden text-sm md:text-base font-black tracking-widest uppercase truncate whitespace-nowrap bg-black/40">
            
            {config.showMatchNumber && (
              <div className="flex items-center [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
                <span className={isLight ? 'text-slate-200 mr-2' : 'text-slate-300 mr-2'}>MATCH</span>
                <span className="text-white">{displayMatch.number}</span>
              </div>
            )}
            
            {(config.showMatchNumber && config.showMap) && <div className={`w-px h-6 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />}

            {config.showMap && (
              <div className={`[text-shadow:_0_1px_2px_rgba(0,0,0,0.8)] ${isLight ? 'text-slate-100' : 'text-slate-100'}`}>
                {displayMatch.map}
              </div>
            )}

            {(config.showMap && config.showLobby) && <div className={`w-px h-6 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />}

            {config.showLobby && (
              <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                {displayMatch.phase}
              </div>
            )}
            
            {config.showTournamentName && (
              <>
                <div className={`w-px h-6 ${isLight ? 'bg-slate-300' : 'bg-slate-700'} hidden lg:block`} />
                <div className={`hidden lg:block truncate ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                  {tournament.name}
                </div>
              </>
            )}
          </div>

          {/* Status Block */}
          <div className={`px-4 md:px-6 flex flex-col justify-center items-end shrink-0 border-l ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900'}`}>
            <div className="flex items-center gap-4 md:gap-6 text-sm md:text-base">
              {renderStatus()}
              
              {config.showMatchTimer && mockMatch.status === 'LIVE' && (
                <div className={`flex items-center gap-2 font-mono font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Clock className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  {formatTime(elapsedSeconds)}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
