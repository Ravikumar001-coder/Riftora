import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTournamentBySlug } from '../../../features/tournaments/api/useTournamentQueries';
import { Button } from '../../../components/ui/button';
import { TournamentHero } from '../components/tournament/TournamentHero';
import { TournamentQuickInfo } from '../components/tournament/TournamentQuickInfo';
import { TournamentTabs } from '../components/tournament/TournamentTabs';
import { TournamentLivePanel } from '../components/tournament/TournamentLivePanel';
import { TournamentPrizePreview } from '../components/tournament/TournamentPrizePreview';
import { TournamentTeamsPreview } from '../components/tournament/TournamentTeamsPreview';
import { TournamentSchedulePreview } from '../components/tournament/TournamentSchedulePreview';
import { TournamentRulesPreview } from '../components/tournament/TournamentRulesPreview';
import { TournamentRoadmapPreview } from '../components/tournament/TournamentRoadmapPreview';
import { TournamentScheduleView } from '../components/tournament/schedule/TournamentScheduleView';
import { TournamentLeaderboardView } from '../components/tournament/leaderboard/TournamentLeaderboardView';
import { TournamentResultsView } from '../components/tournament/results/TournamentResultsView';
import { TournamentTeamsView } from '../components/tournament/teams/TournamentTeamsView';
import { TournamentRulesView } from '../components/tournament/rules/TournamentRulesView';
import { TournamentPrizesView } from '../components/tournament/prizes/TournamentPrizesView';
import { TournamentWatchView } from '../components/tournament/watch/TournamentWatchView';
export function TournamentOverviewPage() {
  const { tournamentSlug, tab } = useParams();
  const navigate = useNavigate();
  
  // Default to 'overview' if no tab is provided, or validate the tab
  const validTabs = ['overview', 'schedule', 'leaderboard', 'results', 'teams', 'rules', 'prizes', 'watch'];
  const activeTab = tab && validTabs.includes(tab) ? tab : 'overview';

  const handleTabChange = (newTab) => {
    if (newTab === 'overview') {
      navigate(`/t/${tournamentSlug}`);
    } else {
      navigate(`/t/${tournamentSlug}/${newTab}`);
    }
  };

  const { data: tournament, isLoading, error } = useGetTournamentBySlug(tournamentSlug);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error || !tournament) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-slate-400">!</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">404 Tournament Not Found</h1>
          <p className="text-slate-400 max-w-md text-center mb-8">
            We couldn't find this tournament. The tournament may have been removed, 
            renamed, or the link may be incorrect.
          </p>
          <div className="flex gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => navigate('/explore')}
            >
              Explore Tournaments
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-slate-300"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </>
    );
  }

  const themeStyles = React.useMemo(() => {
    if (!tournament) return {};
    
    const styles = {};
    
    // 1. Font Family override
    if (tournament.primaryFont) {
      styles['--font-sans'] = `"${tournament.primaryFont}", sans-serif`;
      styles['fontFamily'] = `"${tournament.primaryFont}", sans-serif`;
    }

    // 2. Button and Highlight Colors (Mapping tailwind's blue to primary/accent)
    const pColor = tournament.primaryColor || '#2563EB'; // default blue-600
    const aColor = tournament.accentColor || '#3B82F6';  // default blue-500
    
    styles['--color-blue-400'] = aColor;
    styles['--color-blue-500'] = aColor;
    styles['--color-blue-600'] = pColor;
    styles['--color-blue-700'] = pColor;
    styles['--color-blue-900'] = pColor;

    // 3. Card Styles and Header Background (Light / Dark / Custom)
    if (tournament.themeType === 'LIGHT') {
      styles['--color-slate-950'] = '#ffffff'; // main bg
      styles['--color-slate-900'] = '#f8fafc'; // card bg
      styles['--color-slate-800'] = '#e2e8f0'; // borders/accents
      styles['--color-slate-700'] = '#cbd5e1'; 
      styles['--color-slate-400'] = '#475569'; // sub text
      styles['--color-slate-300'] = '#334155'; // body text
      styles['--color-white'] = '#0f172a';     // primary text (overrides text-white)
      styles['color'] = '#0f172a';
      styles['background'] = '#ffffff';
    } else if (tournament.themeType === 'CUSTOM' && tournament.secondaryColor) {
      // Use secondary color for cards
      styles['--color-slate-900'] = tournament.secondaryColor;
      // We could shade it for 950, but we'll leave 950 as default or also secondary
    }

    return styles;
  }, [tournament]);

  return (
    <div style={themeStyles} className={`min-h-screen ${tournament?.themeType === 'LIGHT' ? 'bg-white' : 'bg-[#071426]'}`}>
      <>
      <TournamentHero tournament={tournament} />
      
      <TournamentTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        hasStream={!!tournament.stream} 
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {tournament.description && (
                <div className="gameverse-card rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">About Tournament</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {tournament.description}
                  </p>
                </div>
              )}
              
              {/* Quick Info */}
              <TournamentQuickInfo tournament={tournament} />
              
              {/* Roadmap */}
              <TournamentRoadmapPreview tournament={tournament} />
              
              {/* Live Panel */}
              <TournamentLivePanel tournament={tournament} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TournamentTeamsPreview tournament={tournament} />
                <TournamentPrizePreview tournament={tournament} />
              </div>
            </div>
            
            <div className="space-y-6">
              <TournamentSchedulePreview tournament={tournament} />
              <TournamentRulesPreview tournament={tournament} />
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <TournamentScheduleView tournament={tournament} />
        )}

        {activeTab === 'leaderboard' && (
          <TournamentLeaderboardView tournament={tournament} />
        )}

        {activeTab === 'results' && (
          <TournamentResultsView tournament={tournament} />
        )}

        {activeTab === 'teams' && (
          <TournamentTeamsView tournament={tournament} />
        )}

        {activeTab === 'rules' && (
          <TournamentRulesView tournament={tournament} />
        )}

        {activeTab === 'prizes' && (
          <TournamentPrizesView tournament={tournament} />
        )}

        {activeTab === 'watch' && (
          <TournamentWatchView tournament={tournament} />
        )}

        {activeTab !== 'overview' && activeTab !== 'schedule' && activeTab !== 'leaderboard' && activeTab !== 'results' && activeTab !== 'teams' && activeTab !== 'rules' && activeTab !== 'prizes' && activeTab !== 'watch' && (
          <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-white mb-2 capitalize">{activeTab}</h3>
            <p className="text-slate-400 max-w-sm">
              The {activeTab} section will be displayed here. The overview gives you a preview of all tournament information.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 border-slate-700 bg-slate-800/50 text-slate-300"
              onClick={() => handleTabChange('overview')}
            >
              Back to Overview
            </Button>
          </div>
        )}
      </main>
    </>
    </div>
  );
}
