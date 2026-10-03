import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Calendar, Eye, Activity, Bookmark } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../../store/authStore';
import { useToggleBookmark } from '../../../../features/tournaments/api/useTournamentBookmarks';

export function TournamentCard({ tournament }) {
  const { isAuthenticated } = useAuthStore();
  const toggleBookmark = useToggleBookmark();

  const handleBookmark = (e) => {
    e.preventDefault(); // Prevent navigating to tournament details
    if (!isAuthenticated) {
      // You could redirect to login here
      return;
    }
    toggleBookmark.mutate({ 
      tournamentId: tournament.tournamentId || tournament.id, 
      isBookmarked: tournament.isBookmarked 
    });
  };
  const isLive = tournament.status === 'live';
  const isRegOpen = tournament.status === 'registration_open';
  const isCompleted = tournament.status === 'completed';
  const isUpcoming = tournament.status === 'upcoming';

  const formattedDate = new Date(tournament.startsAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gameverse-card group flex flex-col h-full overflow-hidden block"
    >
      {/* Banner */}
      <Link to={`/t/${tournament.slug}`} className="relative h-48 w-full block overflow-hidden rounded-t-xl -mt-6 -mx-6 mb-4">
        <img
          src={tournament.banner}
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-80" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {isLive && (
            <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </span>
          )}
          {isRegOpen && (
            <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              REG OPEN
            </span>
          )}
          {isUpcoming && (
            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              UPCOMING
            </span>
          )}
          {isCompleted && (
            <span className="bg-gray-500/20 text-gray-400 border border-gray-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              COMPLETED
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        {isAuthenticated && (
          <button 
            onClick={handleBookmark}
            className="absolute top-3 left-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all z-10"
          >
            <Bookmark 
              className={cn(
                "w-5 h-5 transition-colors",
                tournament.isBookmarked ? "fill-blue-500 text-blue-500" : "text-white"
              )} 
            />
          </button>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        {/* Game & Org */}
        <div className="flex items-center justify-between mb-3 text-xs font-medium text-slate-400">
          <span className="text-blue-400 tracking-wider uppercase">{tournament.game}</span>
          <Link to={`/organizations/${tournament.organization.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <img src={tournament.organizationLogo} alt={tournament.organization} className="w-5 h-5 rounded-full" />
            {tournament.organization}
          </Link>
        </div>

        {/* Title */}
        <Link to={`/t/${tournament.slug}`}>
          <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani hover:text-blue-400 transition-colors line-clamp-2">
            {tournament.name}
          </h3>
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
          <div className="inner-element flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Prize Pool</p>
              <p className="text-sm font-semibold text-white">{tournament.prizePoolString}</p>
            </div>
          </div>
          <div className="inner-element flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Teams</p>
              <p className="text-sm font-semibold text-white">{tournament.teamsRegistered} <span className="text-slate-500 text-xs">/ {tournament.maxTeams}</span></p>
            </div>
          </div>
          <div className="inner-element flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Starts</p>
              <p className="text-sm font-semibold text-white">{formattedDate}</p>
            </div>
          </div>
          <div className="inner-element flex items-center gap-2">
            {isLive ? (
              <Eye className="w-4 h-4 text-red-400" />
            ) : (
              <Activity className="w-4 h-4 text-emerald-400" />
            )}
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{isLive ? 'Viewers' : 'Entry'}</p>
              <p className="text-sm font-semibold text-white">
                {isLive ? tournament.viewers.toLocaleString() : tournament.entryType}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          {isLive ? (
            <Link
              to={`/t/${tournament.slug}/watch`}
              className="w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold text-sm text-center flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              WATCH LIVE
            </Link>
          ) : isRegOpen ? (
            <Link
              to={`/t/${tournament.slug}`}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm text-center flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              VIEW & REGISTER
            </Link>
          ) : (
             <Link
              to={`/t/${tournament.slug}`}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm text-center flex items-center justify-center transition-all"
            >
              VIEW TOURNAMENT
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
