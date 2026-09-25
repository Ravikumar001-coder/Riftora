import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';

export function OBSSponsorPage() {
  const { tournamentId, token } = useParams();
  
  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'sponsor', token);
  const { data: tournament, isLoading: isTournamentLoading, isError: isTournamentError } = useTournament(tournamentId);

  const isLoading = isConfigLoading || isTournamentLoading;
  const isError = isConfigError || isTournamentError;

  // Handle transparent background directly
  useEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

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

  const config = overlayConfig ? { ...defaultOverlayConfigs.sponsor, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.sponsor;
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
        className={`${getAnimationClasses()} max-w-sm w-full text-center`}
        style={{ 
          transform: `scale(${config.scale / 100})`, 
          opacity: config.opacity / 100, 
          transformOrigin: config.position.includes('Top') ? 'top' : config.position.includes('Bottom') ? 'bottom' : 'center',
        }}
      >
        {config.showCampaignText && (
          <div className="bg-blue-600 text-white text-[10px] font-bold py-1 px-4 rounded-t-lg inline-block uppercase tracking-wider drop-shadow-md">
            Powered By
          </div>
        )}
        <div className={`px-8 py-5 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border flex items-center justify-center gap-4 backdrop-blur-md ${bgColor} ${borderColor} ${config.showCampaignText ? 'rounded-tl-none' : ''}`}>
          {config.showLogo && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shrink-0 shadow-inner" />
          )}
          <span className={`text-2xl font-black uppercase tracking-wider ${textColor}`}>
            {config.currentSponsor || 'Sponsor'}
          </span>
        </div>
      </div>
    </div>
  );
}
