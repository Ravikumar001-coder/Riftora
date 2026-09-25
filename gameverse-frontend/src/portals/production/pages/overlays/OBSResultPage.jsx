import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle, Trophy, Crosshair, Star } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';

export function OBSResultPage() {
  const { tournamentId, token } = useParams();
  
  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'match_result', token);
  const { data: tournament, isLoading: isTournamentLoading, isError: isTournamentError } = useTournament(tournamentId);

  const isLoading = isConfigLoading || isTournamentLoading;
  const isError = isConfigError || isTournamentError;

  useEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  if (isLoading) return null;

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

  const config = overlayConfig ? { ...defaultOverlayConfigs.result, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.result;
  if (!config.enabled) {
    return <div className="w-full h-screen bg-transparent" />;
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

  return (
    <div className={`w-full h-screen bg-transparent overflow-hidden p-[4%] md:p-[6%] flex ${getPositionClasses()}`}>
      <OverlayConnectionStatus tournamentId={tournamentId} />
      <div 
        className={`${getAnimationClasses()} max-w-xl w-full`}
        style={{ 
          transform: `scale(${config.scale / 100})`, 
          opacity: config.opacity / 100, 
          transformOrigin: config.position.includes('Top') ? 'top' : config.position.includes('Bottom') ? 'bottom' : 'center',
        }}
      >
        <div className={`rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md border ${bgColor} ${borderColor} ${textColor}`}>
          
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 text-center">
            {config.showMatchNumber && (
              <div className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1 opacity-90 drop-shadow">
                MATCH 04 • ERANGEL
              </div>
            )}
            <h1 className="text-3xl font-black tracking-widest text-white uppercase drop-shadow-md">
              MATCH COMPLETE
            </h1>
          </div>

          <div className="p-8 text-center flex flex-col items-center">
            
            {config.showWinningTeam && (
              <div className="mb-8 w-full">
                <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex justify-center items-center gap-2">
                  <Trophy className="w-4 h-4" /> 1st Place
                </div>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-black shrink-0 border border-amber-500/30 shadow-inner">
                    P
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600">
                    TEAM PHOENIX
                  </h2>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto mb-8">
              {config.showPlacement && (
                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700/50'}`}>
                  <span className="text-3xl font-black mb-1">15</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Placement</span>
                </div>
              )}
              {config.showKills && (
                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700/50'}`}>
                  <span className="text-3xl font-black mb-1 flex items-center gap-1.5">11 <Crosshair className="w-4 h-4 opacity-50" /></span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Kills</span>
                </div>
              )}
              {config.showTotal && (
                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/30 border-blue-500/30'}`}>
                  <span className={`text-3xl font-black mb-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>26</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isLight ? 'text-blue-500' : 'text-blue-400'}`}>Total Points</span>
                </div>
              )}
            </div>

            {config.showMvp && (
              <div className={`inline-flex items-center gap-4 px-4 py-2 rounded-full border shadow-sm ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Star className="w-3 h-3" /> Match MVP</span>
                  <span className="font-bold text-sm">PHX_Slayer</span>
                </div>
                <div className={`px-2.5 py-1 rounded text-xs font-black ${isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'}`}>
                  7 Elims
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
