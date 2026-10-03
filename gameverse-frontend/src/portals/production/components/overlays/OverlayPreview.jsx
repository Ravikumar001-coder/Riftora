import React from 'react';
import { Eye, Monitor, ExternalLink, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicLeaderboard } from '../../../../features/leaderboard/api/useLeaderboardQueries';
import { useTournament } from '../../../../features/tournaments/api/useTournament';
import { getThemeVariables } from '../../utils/themeUtils';

export function OverlayPreview({ selectedOverlay, config, tournamentId }) {
  const { data: activeData } = usePublicLeaderboard(tournamentId, { refetchInterval: 15000 });
  const { data: tournament } = useTournament(tournamentId);

  // Fallback / Mock data for previewing when no live data exists
  const fallbackTeams = [
    { currentRank: 1, teamName: 'Team Phoenix', totalPoints: 80, totalKills: 32, avgPlacement: 48, teamTag: 'PHX', logoUrl: null },
    { currentRank: 2, teamName: 'Cyber Ninjas', totalPoints: 71, totalKills: 29, avgPlacement: 42, teamTag: 'CYB', logoUrl: null },
    { currentRank: 3, teamName: 'Rogue Squad', totalPoints: 65, totalKills: 26, avgPlacement: 39, teamTag: 'ROG', logoUrl: null },
    { currentRank: 4, teamName: 'Storm Kings', totalPoints: 58, totalKills: 22, avgPlacement: 36, teamTag: 'STM', logoUrl: null },
    { currentRank: 5, teamName: 'Hydra', totalPoints: 52, totalKills: 20, avgPlacement: 32, teamTag: 'HYD', logoUrl: null },
  ];

  const teamsToDisplay = (activeData && activeData.entries && activeData.entries.length > 0) 
    ? activeData.entries 
    : fallbackTeams;

  const renderLeaderboard = () => (
    <div 
      className={`bg-slate-900/90 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl w-full max-w-sm mx-auto backdrop-blur flex flex-col ${config.theme === 'Light' ? 'bg-white/90 text-slate-900' : 'text-white'}`}
      style={getThemeVariables(tournament)}
    >
      <div className="p-3 text-center" style={{ backgroundColor: 'var(--theme-primary)' }}>
        <h3 className="font-black tracking-widest text-white text-sm">TOURNAMENT STANDINGS</h3>
      </div>
      <div className="p-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              {config.showRank && <th className="text-left pb-2 w-8">#</th>}
              <th className="text-left pb-2">TEAM</th>
              {config.showPlacement && <th className="text-center pb-2 px-1">PLC</th>}
              {config.showKills && <th className="text-center pb-2 px-1">KILLS</th>}
              {config.showTotal && <th className="text-right pb-2 font-bold">TOTAL</th>}
            </tr>
          </thead>
          <tbody>
            {teamsToDisplay.slice(0, Math.min(config.rowsVisible || 5, 5)).map((t, i) => (
              <tr key={i} className="border-b border-slate-800/50">
                {config.showRank && <td className="py-2 font-bold">{t.currentRank}</td>}
                <td className="py-2 flex items-center gap-2">
                  {config.showTeamLogo && (
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0"
                      style={{ 
                        backgroundColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)', 
                        color: 'var(--theme-primary)' 
                      }}
                    >
                      {t.logoUrl ? (
                        <img src={t.logoUrl} alt={t.teamTag} className="w-full h-full object-cover" />
                      ) : (
                        <span>{t.teamTag || t.teamName.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  )}
                  {config.showTeamName && <span className="font-bold truncate">{t.teamName}</span>}
                </td>
                {config.showPlacement && <td className="py-2 text-center text-slate-400">{t.avgPlacement}</td>}
                {config.showKills && <td className="py-2 text-center text-slate-400">{t.totalKills}</td>}
                {config.showTotal && <td className="py-2 text-right font-black" style={{ color: 'var(--theme-accent)' }}>{t.totalPoints}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTop10 = () => (
    <div 
      className={`bg-slate-900/90 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl w-full max-w-md mx-auto backdrop-blur p-4 ${config.theme === 'Light' ? 'bg-white/90 text-slate-900' : 'text-white'}`}
      style={getThemeVariables(tournament)}
    >
      <h3 className="font-black text-xl mb-4 tracking-wider text-center" style={{ color: 'var(--theme-accent)' }}>TOP TEAMS</h3>
      <div className="grid grid-cols-2 gap-2">
        {teamsToDisplay.slice(0, Math.min(config.numTeams || 4, 4)).map((t, i) => (
          <div key={i} className="bg-slate-800 p-2 rounded flex items-center justify-between border border-slate-700/50">
            <div className="flex items-center gap-2">
              {config.showRank && <span className="text-xs font-bold text-slate-500 w-4">{t.currentRank}</span>}
              {config.showTeamLogo && (
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0"
                  style={{ 
                    backgroundColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)', 
                    color: 'var(--theme-primary)' 
                  }}
                >
                  {t.logoUrl ? (
                    <img src={t.logoUrl} alt={t.teamTag} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.teamTag || t.teamName.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
              )}
              <span className="text-sm font-bold truncate max-w-[80px]">{t.teamName}</span>
            </div>
            <div className="text-right">
              {config.showTotal && <div className="text-sm font-black text-white">{t.totalPoints} pts</div>}
              {config.showKills && <div className="text-[10px] text-slate-400">{t.totalKills} kills</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMatchBar = () => (
    <div 
      className={`w-full max-w-2xl mx-auto backdrop-blur rounded-lg overflow-hidden shadow-2xl border border-slate-700/50 flex ${config.theme === 'Light' ? 'bg-white/90 text-slate-900' : 'bg-slate-900/90 text-white'}`}
      style={getThemeVariables(tournament)}
    >
      <div className="px-4 py-2 flex items-center justify-center" style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
        {config.showTournamentName && <span className="font-black text-white text-sm whitespace-nowrap">{tournament?.tournamentName || 'RIFTORA CHAMPIONSHIP'}</span>}
      </div>
      <div className="flex-1 px-4 py-2 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-4 text-slate-300">
          {config.showMatchNumber && <span>MATCH 04</span>}
          {config.showMap && <span>ERANGEL</span>}
          {config.showLobby && <span>LOBBY A</span>}
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          {config.showTeamCount && <span>16 TEAMS</span>}
          {config.showMatchStatus && <span style={{ color: 'var(--theme-accent)' }}>IN PROGRESS</span>}
          {config.showMatchTimer && <span className="font-mono text-white text-sm">42:18</span>}
        </div>
      </div>
    </div>
  );

  const renderSponsor = () => (
    <div className="w-full max-w-xs mx-auto text-center" style={getThemeVariables(tournament)}>
      {config.showCampaignText && (
        <div 
          className="text-white text-[10px] font-bold py-1 px-3 rounded-t-lg inline-block uppercase tracking-wider"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          Powered By
        </div>
      )}
      <div className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center justify-center gap-3 ${config.theme === 'Light' ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-700/50'}`}>
        {config.showLogo && <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom right, var(--theme-primary), var(--theme-secondary))' }} />}
        <span className={`text-xl font-black ${config.theme === 'Light' ? 'text-slate-900' : 'text-white'}`}>
          {config.currentSponsor || 'Sponsor'}
        </span>
      </div>
    </div>
  );

  const renderResult = () => (
    <div 
      className={`bg-slate-900/90 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl w-full max-w-md mx-auto backdrop-blur ${config.theme === 'Light' ? 'bg-white/90 text-slate-900' : 'text-white'}`}
      style={getThemeVariables(tournament)}
    >
      <div className="p-4 text-center" style={{ backgroundColor: 'var(--theme-primary)' }}>
        {config.showMatchNumber && <div className="text-[10px] uppercase font-bold text-white/80 tracking-widest mb-1">MATCH 04 COMPLETE</div>}
        <h3 className="font-black tracking-widest text-white text-2xl">WINNER CHICKEN DINNER</h3>
      </div>
      <div className="p-6 text-center">
        {config.showWinningTeam && (
          <div className="mb-6">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">1st Place</span>
            <h2 className="text-3xl font-black mt-1" style={{ color: 'var(--theme-accent)' }}>TEAM PHOENIX</h2>
          </div>
        )}
        
        <div className="flex justify-center gap-6 mb-6">
          {config.showPlacement && (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black">15</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">Placement</span>
            </div>
          )}
          {config.showKills && (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black">11</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">Kills</span>
            </div>
          )}
          {config.showTotal && (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black" style={{ color: 'var(--theme-accent)' }}>26</span>
              <span className="text-[10px] uppercase font-bold mt-1" style={{ color: 'var(--theme-accent)', opacity: 0.7 }}>Total Points</span>
            </div>
          )}
        </div>

        {config.showMvp && (
          <div className="bg-slate-800/50 rounded-lg p-3 inline-flex items-center gap-3 border border-slate-700/50">
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Match MVP</div>
              <div className="font-bold text-sm">PHX_Slayer</div>
            </div>
            <div className="bg-slate-900 rounded px-2 py-1 text-xs font-black">7 Eliminations</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFinale = () => (
    <div className="w-full max-w-lg mx-auto text-center" style={getThemeVariables(tournament)}>
      {config.showTournamentName && (
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest drop-shadow-lg">
          {tournament?.tournamentName || 'RIFTORA CHAMPIONSHIP 2026'}
        </h3>
      )}
      <div 
        className="border rounded-2xl p-8 backdrop-blur-md"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2), rgba(var(--theme-secondary-rgb, 30, 58, 138), 0.2))',
          borderColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.3)',
          boxShadow: '0 0 50px rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)'
        }}
      >
        <h2 className="text-4xl font-black tracking-widest mb-6 drop-shadow-md" style={{ color: 'var(--theme-primary)' }}>CHAMPIONS</h2>
        
        {config.showChampion && (
          <div className="mb-6">
            <h1 className="text-5xl font-black text-white drop-shadow-lg">TEAM PHOENIX</h1>
          </div>
        )}
        
        {config.showPrize && (
          <div 
            className="inline-block font-black text-2xl px-6 py-2 rounded-xl mb-6 shadow-lg text-white"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            ₹10,00,000
          </div>
        )}

        {config.showRunnerUp && (
          <div 
            className="text-sm font-bold text-slate-300 mt-4 border-t pt-4"
            style={{ borderColor: 'rgba(var(--theme-primary-rgb, 37, 99, 235), 0.2)' }}
          >
            Runner Up: <span className="text-white">Cyber Ninjas</span>
          </div>
        )}
      </div>
    </div>
  );

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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/80 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          Broadcast Preview
        </h2>
        
        <div className="flex gap-2">
          <Link 
            to={`/overlay/${tournamentId}/${selectedOverlay}`}
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Standalone
          </Link>
          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
            Full
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-950 overflow-hidden relative flex flex-col">
        {/* Aspect Ratio Container 16:9 */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-center items-center overflow-hidden">
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-2xl border border-slate-800 ring-1 ring-white/5">
            {/* Checkerboard pattern for transparency indication */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
            
            {/* Fake game background image to show transparency */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-30" />
            
            {/* Safe Area Guides */}
            <div className="absolute inset-[5%] border border-emerald-500/20 border-dashed pointer-events-none" />
            <div className="absolute inset-[10%] border border-amber-500/20 border-dashed pointer-events-none" />

            {!config.enabled ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <Monitor className="w-12 h-12 text-slate-600 mb-3" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Overlay Disabled</span>
              </div>
            ) : (
              <div className={`absolute inset-0 p-8 flex ${getPositionClasses()}`}>
                <div 
                  style={{ transform: `scale(${config.scale / 100})`, opacity: config.opacity / 100, transformOrigin: 'inherit' }}
                  className="transition-all duration-300"
                >
                  {selectedOverlay === 'leaderboard' && renderLeaderboard()}
                  {selectedOverlay === 'top10' && renderTop10()}
                  {selectedOverlay === 'matchbar' && renderMatchBar()}
                  {selectedOverlay === 'sponsor' && renderSponsor()}
                  {selectedOverlay === 'result' && renderResult()}
                  {selectedOverlay === 'finale' && renderFinale()}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-900 border-t border-slate-800 text-center flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">1920x1080 (16:9)</span>
          <span className="text-xs text-slate-500 font-mono">Preview rendering</span>
        </div>
      </div>
    </div>
  );
}
