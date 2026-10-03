import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { usePublicOverlay } from '../../../../features/command-center/api/useOverlayQueries';
import { AlertCircle, Trophy, Medal, Star } from 'lucide-react';
import { defaultOverlayConfigs } from '../../components/overlays/overlayDefaults';
import { OverlayConnectionStatus } from '../../components/overlays/OverlayConnectionStatus';

export function OBSFinalePage() {
  const { tournamentId, token } = useParams();
  
  const { data: overlayConfig, isLoading: isConfigLoading, isError: isConfigError, error: configError } = usePublicOverlay(tournamentId, 'tournament_winner', token);
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

  const config = overlayConfig ? { ...defaultOverlayConfigs.finale, ...parsedStyle, ...parsedPosition, enabled: overlayConfig.isVisible } : defaultOverlayConfigs.finale;
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
    const base = 'transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none';
    switch (config.animation) {
      case 'Fade': return `${base} animate-in fade-in motion-reduce:animate-none`;
      case 'Slide': return `${base} animate-in slide-in-from-bottom-12 fade-in motion-reduce:animate-none`;
      case 'Pop': return `${base} animate-in zoom-in-90 fade-in motion-reduce:animate-none`;
      case 'None': default: return '';
    }
  };

  const isLight = config.theme === 'Light';
  const bgColor = isLight ? 'bg-white/95' : 'bg-slate-900/95';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const borderColor = isLight ? 'border-amber-500/30' : 'border-amber-500/30';

  const mockStandings = [
    { rank: 1, name: 'Team Phoenix', pts: 186, logo: 'P' },
    { rank: 2, name: 'Cyber Ninjas', pts: 174, logo: 'C' },
    { rank: 3, name: 'Alpha Wolves', pts: 169, logo: 'A' },
    { rank: 4, name: 'Nova Esports', pts: 161, logo: 'N' },
    { rank: 5, name: 'Shadow Squad', pts: 154, logo: 'S' },
  ];

  return (
    <div className={`w-full h-screen bg-transparent overflow-hidden p-[4%] md:p-[6%] flex ${getPositionClasses()}`}>
      <OverlayConnectionStatus tournamentId={tournamentId} />
      <div 
        className={`${getAnimationClasses()} max-w-2xl w-full text-center`}
        style={{ 
          transform: `scale(${config.scale / 100})`, 
          opacity: config.opacity / 100, 
          transformOrigin: config.position.includes('Top') ? 'top' : config.position.includes('Bottom') ? 'bottom' : 'center',
        }}
      >
        
        {config.showTournamentName && (
          <h3 className="text-xl md:text-2xl font-black text-white mb-3 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {tournament.name}
          </h3>
        )}

        <div className={`rounded-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(245,158,11,0.25)] backdrop-blur-xl border ${bgColor} ${borderColor} bg-gradient-to-b ${isLight ? 'from-amber-50/50 to-white/90' : 'from-amber-900/20 to-slate-900/95'}`}>
          
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-widest mb-8 drop-shadow-sm uppercase">
            CHAMPIONS
          </h2>
          
          {config.showChampion && (
            <div className="flex flex-col items-center justify-center mb-8 relative">
              
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              
              <div className="relative flex flex-col items-center justify-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-5xl font-black shrink-0 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  P
                </div>
                <div>
                  <h1 className={`text-5xl md:text-6xl font-black uppercase tracking-wider drop-shadow-md ${textColor}`}>
                    TEAM PHOENIX
                  </h1>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className={`px-6 py-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950/50 border-slate-800'} shadow-lg`}>
              <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Tournament Score
              </span>
              <span className={`text-4xl font-black ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                186 <span className="text-xl">PTS</span>
              </span>
            </div>
            
            {config.showPrize && (
              <div className="px-6 py-3 rounded-xl border border-amber-500/30 bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-80">
                  Champion Prize
                </span>
                <span className="text-4xl font-black">
                  ₹5,00,000
                </span>
              </div>
            )}
          </div>

          {config.showRunnerUp && (
            <div className={`mt-8 pt-8 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Final Standings
              </h4>
              <div className="flex flex-col gap-2 max-w-sm mx-auto">
                {mockStandings.slice(0, 5).map((t, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-2 rounded ${i === 0 ? (isLight ? 'bg-amber-50' : 'bg-amber-900/20 border border-amber-500/20') : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black ${i === 0 ? 'text-amber-500' : i === 1 ? (isLight ? 'text-slate-400' : 'text-slate-300') : i === 2 ? 'text-amber-700' : (isLight ? 'text-slate-400' : 'text-slate-500')}`}>
                        {t.rank.toString().padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-bold uppercase tracking-wider ${i === 0 ? (isLight ? 'text-amber-600' : 'text-amber-400') : textColor}`}>
                        {t.name}
                      </span>
                    </div>
                    <span className={`text-sm font-black ${i === 0 ? 'text-amber-500' : (isLight ? 'text-blue-600' : 'text-blue-400')}`}>
                      {t.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
