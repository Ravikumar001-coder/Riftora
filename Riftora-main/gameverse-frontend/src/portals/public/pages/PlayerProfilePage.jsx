import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayerHero } from '../components/player/PlayerHero';
import { PlayerStats } from '../components/player/PlayerStats';
import { PlayerTabs } from '../components/player/PlayerTabs';
import { PlayerTeam } from '../components/player/PlayerTeam';
import { PlayerAchievements } from '../components/player/PlayerAchievements';
import { PlayerAbout } from '../components/player/PlayerAbout';
import { TournamentCard } from '../components/explore/TournamentCard';
import { usePlayer } from '../../../features/players/api/usePlayer';
import { usePlayerTournaments } from '../../../features/players/api/usePlayerTournaments';
import { usePlayerAchievements } from '../../../features/players/api/usePlayerAchievements';
import { AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlayerProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data
  const { data: player, isLoading: isLoadingPlayer, error: playerError } = usePlayer(username);
  const { data: tournaments, isLoading: isLoadingTournaments } = usePlayerTournaments(username);
  const { data: achievements, isLoading: isLoadingAchievements } = usePlayerAchievements(username);

  // Group tournaments
  const liveTournaments = tournaments?.filter(t => t.status === 'live') || [];
  const upcomingTournaments = tournaments?.filter(t => t.status === 'upcoming' || t.status === 'registration_open') || [];
  const completedTournaments = tournaments?.filter(t => t.status === 'completed') || [];

  if (playerError) {
    const status = playerError.response?.status;
    
    if (status === 403) {
      return (
        <>
          <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-rajdhani">Private Profile</h1>
            <p className="text-slate-400 max-w-md mb-8 text-lg">
              {playerError.response?.data?.error?.message || "This player's profile is not public."}
            </p>
            <div className="flex gap-4">
              <Link to="/explore" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Explore Tournaments
              </Link>
              <Link to="/" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all">
                Go Home
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-rajdhani">Player Not Found</h1>
          <p className="text-slate-400 max-w-md mb-8 text-lg">
            We couldn't find this player. The player may have changed their username, deleted their profile, or the link may be incorrect.
          </p>
          <div className="flex gap-4">
            <Link to="/explore" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Explore Tournaments
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
        {player?.teamId && <PlayerTeam player={player} />}
        
        {renderTournamentSection('🔴 Competing Live', 'Watch the player compete in real-time.', liveTournaments)}
        {renderTournamentSection('Upcoming Tournaments', 'Competitions starting soon.', upcomingTournaments)}
        {renderTournamentSection('Recent Results', 'Recently completed tournaments.', completedTournaments)}

        {achievements?.length > 0 && (
          <div className="mb-12 border-t border-white/5 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Featured Achievements</h2>
            <PlayerAchievements achievements={achievements.slice(0, 3)} isLoading={isLoadingAchievements} />
          </div>
        )}
      </motion.div>
    );
  };

  const renderTournaments = () => {
    if (isLoadingTournaments) return renderTournamentsLoading();
    if (tournaments.length === 0) return renderEmptyTournaments("This player hasn't participated in any tournaments yet.");

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderTournamentSection('🔴 Competing Live', 'Watch the player compete in real-time.', liveTournaments)}
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

  const renderAchievements = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <PlayerAchievements achievements={achievements} isLoading={isLoadingAchievements} />
      </motion.div>
    );
  };

  return (
    <>
      <div className="min-h-screen pb-20 w-full overflow-x-hidden">
        <PlayerHero player={player || {}} isLoading={isLoadingPlayer} />
        
        {!isLoadingPlayer && player && (
          <div className="container mx-auto px-4 lg:px-8 mt-12">
            <PlayerStats stats={player.stats} />
            <PlayerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-8">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'tournaments' && renderTournaments()}
              {activeTab === 'results' && renderResults()}
              {activeTab === 'achievements' && renderAchievements()}
              {activeTab === 'about' && <PlayerAbout player={player} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
