import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTournament } from '../../../features/tournaments/api/useTournament';
import { Loader2, AlertCircle, Save, RotateCcw, MonitorPlay, CheckCircle2 } from 'lucide-react';
import { OverlayHeader } from '../components/overlays/OverlayHeader';
import { OverlaySelector } from '../components/overlays/OverlaySelector';
import { OverlayConfigPanel } from '../components/overlays/OverlayConfigPanel';
import { OverlayPreview } from '../components/overlays/OverlayPreview';
import { defaultOverlayConfigs } from '../components/overlays/overlayDefaults';
import { useOverlays, useInitializeOverlays, useRegenerateOverlayToken, useUpdateOverlayConfig } from '../../../features/command-center/api/useOverlayQueries';

export function OverlayControlPage() {
  const { tournamentId } = useParams();
  const { data: tournament, isLoading, isError } = useTournament(tournamentId);

  const [selectedOverlay, setSelectedOverlay] = useState('leaderboard');
  const [configs, setConfigs] = useState(defaultOverlayConfigs);
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // removed localStorage initialization

  const { data: serverOverlays } = useOverlays(tournamentId);

  // Map server overlays to local configs
  useEffect(() => {
    if (serverOverlays && serverOverlays.length > 0) {
      setConfigs(prev => {
        const next = { ...prev };
        serverOverlays.forEach(so => {
          let localId;
          switch (so.overlayType) {
            case 'leaderboard_full': localId = 'leaderboard'; break;
            case 'top10': localId = 'top10'; break;
            case 'match_info_bar': localId = 'matchbar'; break;
            case 'sponsor_banner': localId = 'sponsor'; break;
            case 'result_splash': localId = 'result'; break;
            case 'grand_finale': localId = 'finale'; break;
          }
          if (localId && next[localId]) {
            try {
              const style = so.styleCfg ? JSON.parse(so.styleCfg) : {};
              const pos = so.positionCfg ? JSON.parse(so.positionCfg) : {};
              next[localId] = {
                ...defaultOverlayConfigs[localId],
                ...style,
                ...pos,
                enabled: so.isVisible,
                overlayId: so.overlayId,
                overlayUrl: so.overlayUrl,
                token: so.token,
              };
            } catch(e) {
              console.error("Failed to parse config for", localId, e);
            }
          }
        });
        return next;
      });
    }
  }, [serverOverlays]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      
      switch(e.key.toLowerCase()) {
        case '1': setSelectedOverlay('leaderboard'); break;
        case '2': setSelectedOverlay('top10'); break;
        case '3': setSelectedOverlay('matchbar'); break;
        case '4': setSelectedOverlay('sponsor'); break;
        case '5': setSelectedOverlay('result'); break;
        case '6': setSelectedOverlay('finale'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { mutate: initializeOverlays, isPending: isInitLoading } = useInitializeOverlays();
  const { mutate: regenerateToken, isPending: isRegeneratingToken } = useRegenerateOverlayToken();
  const { mutate: updateConfig, isPending: isSaving } = useUpdateOverlayConfig();

  const handleInitializeOverlays = () => {
    initializeOverlays({ tournamentId }, {
      onSuccess: () => {
        showToast("✓ Overlay URLs generated successfully");
      },
      onError: (err) => {
        showToast("Error generating overlay URLs");
        console.error(err);
      }
    });
  };

  const handleConfigChange = (newOverlayConfig) => {
    setConfigs(prev => ({
      ...prev,
      [selectedOverlay]: newOverlayConfig
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    const overlayData = configs[selectedOverlay];
    if (!overlayData || !overlayData.overlayId) {
       showToast("Overlay must be initialized first");
       return;
    }

    const payload = {
       isVisible: overlayData.enabled,
       positionCfg: JSON.stringify({
           position: overlayData.position,
           scale: overlayData.scale,
           opacity: overlayData.opacity
       }),
       styleCfg: JSON.stringify(overlayData) // Just dumping the whole config for now
    };

    updateConfig({ tournamentId, overlayId: overlayData.overlayId, configPayload: payload }, {
      onSuccess: () => {
        setIsDirty(false);
        showToast(`✓ ${selectedOverlay} configuration saved`);
      },
      onError: (err) => {
        showToast("Error saving configuration");
        console.error(err);
      }
    });
  };

  const handleReset = () => {
    if (window.confirm("Discard changes? Your unsaved overlay configuration will be lost.")) {
      // Revert to server data or defaults
      if (serverOverlays && serverOverlays.length > 0) {
        setConfigs(prev => {
          const next = { ...prev };
          serverOverlays.forEach(so => {
            let localId;
            switch (so.overlayType) {
              case 'leaderboard_full': localId = 'leaderboard'; break;
              case 'top10': localId = 'top10'; break;
              case 'match_info_bar': localId = 'matchbar'; break;
              case 'sponsor_banner': localId = 'sponsor'; break;
              case 'match_result': localId = 'result'; break;
              case 'tournament_winner': localId = 'finale'; break;
            }
            if (localId && next[localId]) {
              try {
                  const style = so.styleCfg ? JSON.parse(so.styleCfg) : {};
                  const pos = so.positionCfg ? JSON.parse(so.positionCfg) : {};
                  next[localId] = {
                      ...defaultOverlayConfigs[localId],
                      ...style,
                      ...pos,
                      enabled: so.isVisible,
                      overlayId: so.overlayId,
                      overlayUrl: so.overlayUrl,
                      token: so.token,
                  };
              } catch(e){}
            }
          });
          return next;
        });
      }
      setIsDirty(false);
      showToast("↻ Configuration reset");
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Reset to Defaults? This will overwrite your current configuration.")) {
      setConfigs(defaultOverlayConfigs);
      setIsDirty(true);
      showToast("Configuration reset to Riftora Defaults");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
          <h2 className="text-xl font-bold text-white mb-2">Loading Workspace...</h2>
        </div>
      </>
    );
  }

  if (isError || !tournament) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Tournament Not Found</h2>
            <p className="text-slate-400 text-sm mb-6">
              We couldn't load overlay configuration for this tournament.
            </p>
            <Link 
              to={`/dashboard`} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950 relative">
      <OverlayHeader tournament={tournament} tournamentId={tournamentId} configs={configs} />

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
        <div className="max-w-[1800px] mx-auto h-full min-h-[600px]">
          
          {/* Responsive Grid Layout */}
          <div className="flex flex-col xl:flex-row gap-6 h-full">
            
            {/* Left Sidebar: Overlay Selector */}
            <div className="w-full xl:w-64 shrink-0 flex flex-col">
              <OverlaySelector 
                selectedOverlay={selectedOverlay} 
                setSelectedOverlay={setSelectedOverlay} 
                configs={configs}
              />
            </div>

            {/* Middle: Configuration Panel */}
            <div className="w-full xl:w-96 shrink-0 flex flex-col h-[500px] xl:h-auto">
              <OverlayConfigPanel 
                selectedOverlay={selectedOverlay}
                config={configs[selectedOverlay] || {}}
                onChange={handleConfigChange}
                onRegenerateToken={() => {
                  if (configs[selectedOverlay]?.overlayId) {
                    if (window.confirm("Are you sure? This will invalidate the current URL. OBS will need to be updated.")) {
                      regenerateToken({
                        tournamentId,
                        overlayId: configs[selectedOverlay].overlayId
                      }, {
                        onSuccess: () => {
                          showToast("✓ Token regenerated successfully");
                        },
                        onError: (err) => {
                          showToast("Error regenerating token");
                          console.error(err);
                        }
                      });
                    }
                  }
                }}
                isRegenerating={isRegeneratingToken}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="w-full xl:flex-1 flex flex-col h-[500px] xl:h-auto">
              {serverOverlays && serverOverlays.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center mb-6 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Overlays Not Initialized</h3>
                  <p className="text-sm text-slate-400 mb-4">You need to generate overlay URLs for this tournament before they can be used in OBS.</p>
                  <button 
                    onClick={handleInitializeOverlays}
                    disabled={isInitLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    {isInitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MonitorPlay className="w-4 h-4" />}
                    Generate Overlay URLs
                  </button>
                </div>
              )}
              <OverlayPreview 
                selectedOverlay={selectedOverlay}
                config={configs[selectedOverlay] || {}}
                tournamentId={tournamentId}
              />
            </div>
            
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 md:px-6 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.2)] sticky bottom-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleResetToDefaults}
            className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
          >
            Reset to Defaults
          </button>
          
          {isDirty && (
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            disabled={!isDirty}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${isDirty ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-900 text-slate-600 cursor-not-allowed'}`}
          >
            <RotateCcw className="w-4 h-4" />
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg ${isDirty ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-[60] animate-in fade-in slide-in-from-bottom-4">
          {toastMessage.includes('✓') ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : toastMessage.includes('↻') ? (
            <RotateCcw className="w-5 h-5 text-blue-500" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          )}
          <span className="text-sm font-bold">{toastMessage.replace(/[✓↻]/g, '')}</span>
        </div>
      )}
    </div>
  );
}
