import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TeamHero } from '../components/team/TeamHero';
import { TeamStats } from '../components/team/TeamStats';
import { TeamTabs } from '../components/team/TeamTabs';
import { TeamRoster } from '../components/team/TeamRoster';
import { TeamAbout } from '../components/team/TeamAbout';
import { TournamentCard } from '../components/explore/TournamentCard';
import { useGetTeamBySlug, useGetTeamTournaments } from '../../../features/teams/api/useTeamQueries';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function TeamProfilePage() {
  const { teamSlug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data
  const { data: team, isLoading: isLoadingTeam, error: teamError } = useGetTeamBySlug(teamSlug);
  const roster = team?.roster || [];
  const isLoadingRoster = isLoadingTeam;
  const { data: tournaments, isLoading: isLoadingTournaments } = useGetTeamTournaments(team?.teamId);

  // Group tournaments
  const liveTournaments = tournaments?.filter(t => t.status === 'live') || [];
  const upcomingTournaments = tournaments?.filter(t => t.status === 'upcoming' || t.status === 'registration_open') || [];
  const completedTournaments = tournaments?.filter(t => t.status === 'completed') || [];

  // Error State (404)
  if (teamError) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-rajdhani">404 Team Not Found</h1>
          <p className="text-slate-400 max-w-md mb-8 text-lg">
            We couldn't find this team. The team may have been removed, renamed, or the link may be incorrect.
          </p>
          <div className="flex gap-4">
            <Link to="/explore" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Explore Teams
            </Link>
            <Link to="/" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all">
              Go Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const renderTournamentSection = (title, subtitle, list) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-rajdhani flex items-center gap-2">
              {title === '🔴 Competing Live' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  Competing Live
                </>
              ) : title}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map(t => <TournamentCard key={t.id} tournament={t} />)}
        </div>
      </div>
    );
  };

  const renderTournamentsLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {[1,2,3].map(i => (
         <div key={i} className="gameverse-card h-[400px]">
           <div className="w-full h-48 bg-white/5 rounded-t-xl -mt-6 -mx-6 mb-4" />
           <div className="h-6 w-3/4 bg-white/5 rounded mb-4" />
           <div className="h-20 w-full bg-white/5 rounded" />
         </div>
      ))}
    </div>
  );

  const renderEmptyTournaments = (message) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
      <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">No Tournaments</h3>
      <p className="text-slate-400">{message}</p>
    </motion.div>
  );

  const renderOverview = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Priority sections for Overview */}
        {renderTournamentSection('🔴 Competing Live', 'Watch the team compete in real-time.', liveTournaments)}
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Featured Roster</h2>
          <TeamRoster roster={roster?.slice(0, 5)} isLoading={isLoadingRoster} />
        </div>

        {renderTournamentSection('Upcoming Tournaments', 'Competitions starting soon.', upcomingTournaments)}
        {renderTournamentSection('Recent Results', 'Recently completed tournaments.', completedTournaments)}
      </motion.div>
    );
  };

  const renderTournaments = () => {
    if (isLoadingTournaments) return renderTournamentsLoading();
    if (tournaments.length === 0) return renderEmptyTournaments("This team hasn't participated in any tournaments yet.");

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderTournamentSection('🔴 Competing Live', 'Watch the team compete in real-time.', liveTournaments)}
        {renderTournamentSection('Upcoming Tournaments', 'Competitions starting soon.', upcomingTournaments)}
        {renderTournamentSection('Completed Tournaments', 'Past tournament participation.', completedTournaments)}
      </motion.div>
    );
  };

  const renderResults = () => {
    if (isLoadingTournaments) return renderTournamentsLoading();
    if (completedTournaments.length === 0) return renderEmptyTournaments("No public tournament results are available yet.");

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderTournamentSection('Tournament History', 'Past tournament results and placements.', completedTournaments)}
      </motion.div>
    );
  };

  return (
    <>
      <div className="min-h-screen pb-20 w-full overflow-x-hidden">
        <TeamHero team={team || {}} isLoading={isLoadingTeam} />
        
        {!isLoadingTeam && team && (
          <div className="container mx-auto px-4 lg:px-8 mt-12">
            <TeamStats stats={team.stats} />
            <TeamTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-8">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'roster' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <TeamRoster roster={roster} isLoading={isLoadingRoster} />
                </motion.div>
              )}
              {activeTab === 'tournaments' && renderTournaments()}
              {activeTab === 'results' && renderResults()}
              {activeTab === 'about' && <TeamAbout team={team} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
