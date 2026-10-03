import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetTournament } from '../../tournaments/api/useTournamentQueries';

export function GraphicRenderPage() {
  const { type, tournamentId, targetId } = useParams();
  const [searchParams] = useSearchParams();
  const watermark = searchParams.get('watermark') !== 'false';
  
  const { data: tournament } = useGetTournament(tournamentId);
  
  const themeStyles = React.useMemo(() => {
    if (!tournament) return {};
    const styles = {};
    if (tournament.primaryFont) {
      styles['fontFamily'] = `"${tournament.primaryFont}", sans-serif`;
    }
    const pColor = tournament.primaryColor || '#2563EB'; 
    const sColor = tournament.secondaryColor || '#1E40AF';
    styles['--color-primary'] = pColor;
    styles['--color-secondary'] = sColor;
    return styles;
  }, [tournament]);

  // Here we would fetch the specific data needed (e.g. match details) based on targetId
  // For the sake of the requirement, we will mock a Match Result render
  
  return (
    <div id="graphic-container" style={themeStyles} className="w-[1920px] h-[1080px] bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center font-sans text-white">
      {/* Background Graphic/Brand Color */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
           background: `radial-gradient(circle at center, var(--color-primary), var(--color-secondary), transparent)`
        }} 
      />
      
      {/* Content */}
      <div className="z-10 text-center w-full px-24">
        {/* Tournament Brand Header */}
        {tournament && (
          <div className="absolute top-12 left-12 flex items-center gap-6 bg-slate-900/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            {tournament.logoUrl && (
              <img src={tournament.logoUrl} alt="Logo" className="w-24 h-24 object-contain" />
            )}
            <div className="text-left">
              <h2 className="text-4xl font-bold">{tournament.name}</h2>
              {tournament.organization?.name && (
                 <p className="text-xl text-slate-400 mt-2">by {tournament.organization.name}</p>
              )}
            </div>
          </div>
        )}

        <h1 
          className="text-8xl font-black uppercase tracking-widest text-transparent bg-clip-text mb-8 mt-24"
          style={{ backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` }}
        >
          {type === 'match-result' ? 'Match Result' : type.replace('-', ' ').toUpperCase()}
        </h1>
        
        <div className="flex items-center justify-center gap-16 mt-16">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-2xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold mb-6">
              TEAM A
            </div>
            <span className="text-7xl font-black text-emerald-400">3</span>
          </div>
          
          <span className="text-6xl font-bold text-slate-600">VS</span>
          
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-2xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold mb-6">
              TEAM B
            </div>
            <span className="text-7xl font-black text-red-400">1</span>
          </div>
        </div>
      </div>
      
      {/* Watermark */}
      {watermark && (
        <div className="absolute bottom-8 right-8 text-2xl font-bold text-white/30 tracking-wider">
          POWERED BY GAMEVERSE
        </div>
      )}
    </div>
  );
}
