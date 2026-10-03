import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Trophy, Gamepad2, ChevronLeft, MapPin, CheckCircle, Clock, Video, Medal, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

export function TournamentHero({ tournament }) {
  const navigate = useNavigate();
  
  if (!tournament) return null;

  // Status mapping
  const statusConfig = {
    upcoming: { label: 'UPCOMING', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    registration_open: { label: '● REGISTRATION OPEN', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
    registration_closed: { label: 'REGISTRATION CLOSED', class: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    live: { label: '🔴 LIVE NOW', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
    completed: { label: '✓ COMPLETED', class: 'bg-slate-800 text-slate-300 border-slate-700' },
    postponed: { label: '⚠ POSTPONED', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    cancelled: { label: 'CANCELLED', class: 'bg-red-900/20 text-red-400 border-red-900/30' },
  };

  const currentStatus = statusConfig[tournament.status] || statusConfig.upcoming;

  // Render CTA based on status
  const renderCTA = () => {
    switch (tournament.status) {
      case 'registration_open':
        if (tournament.isFull && tournament.waitlistEnabled) {
          return (
            <Button 
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow-[0_0_15px_rgba(202,138,4,0.4)]"
              onClick={() => navigate(`/tournaments/${tournament.tournamentId || tournament.id}/register`)}
            >
              Join Waitlist
            </Button>
          );
        }
        return (
          <Button 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            onClick={() => navigate(`/tournaments/${tournament.tournamentId || tournament.id}/register`)}
          >
            Register Now
          </Button>
        );
      case 'live':
        return (
          <Button 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            onClick={() => navigate(`/t/${tournament.slug}/watch`)}
          >
            <Video className="w-4 h-4 mr-2" /> Watch Live
          </Button>
        );
      case 'completed':
        return (
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            onClick={() => navigate(`/t/${tournament.slug}/results`)}
          >
            <Trophy className="w-4 h-4 mr-2" /> View Results
          </Button>
        );
      case 'upcoming':
      case 'registration_closed':
        return (
          <Button disabled className="w-full sm:w-auto bg-slate-800 text-slate-400 cursor-not-allowed">
            Registration Closed
          </Button>
        );
      case 'postponed':
        return (
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          >
            <Clock className="w-4 h-4 mr-2" /> View Updated Schedule
          </Button>
        );
      default:
        return null;
    }
  };

  const dateStr = tournament.start_date || tournament.startDate;
  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
  const banner = tournament.banner_url || tournament.bannerUrl;
  const gameName = tournament.game_name || tournament.gameName || 'TBA';

  return (
    <div className="relative pt-24 pb-10 overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a]/80 via-[#040d1a]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040d1a]/60 via-transparent to-[#040d1a]/60 z-10" />
        {banner ? (
          <img 
            src={banner} 
            alt={`${tournament.name} banner`} 
            className="w-full h-full object-cover opacity-30 object-center"
          />
        ) : (
          <div className="w-full h-full bg-[#040d1a]/40" />
        )}
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-end">
          
          <div className="flex gap-6 items-end flex-1">
            {(tournament.logo_url || tournament.logoUrl) && (
              <img 
                src={tournament.logo_url || tournament.logoUrl} 
                alt={`${tournament.name} logo`}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-2xl border border-slate-700/50 bg-slate-900"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={cn("px-3 py-1 text-xs font-bold border", currentStatus.class)}>
                  {currentStatus.label}
                </Badge>
                {(tournament.tournamentTier || tournament.tournament_tier) && (
                  <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300">
                    {tournament.tournamentTier || tournament.tournament_tier} Tier
                  </Badge>
                )}
                {(tournament.tournamentType || tournament.tournament_type) && (
                  <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300">
                    {tournament.tournamentType || tournament.tournament_type}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {tournament.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mb-8">
              <div className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>{gameName}</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Starts {formattedDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {renderCTA()}
              
              {tournament.status === 'live' && (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                  onClick={() => navigate(`/t/${tournament.slug}/leaderboard`)}
                >
                  View Leaderboard
                </Button>
              )}
              
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
                Share
              </Button>
            </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4 min-w-[280px]">
            {tournament.organization && (
              <div className="gameverse-card p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-blue-500/50 transition-colors"
                   onClick={() => navigate(`/organizations/${tournament.organizationSlug}`)}>
                <img 
                  src={tournament.organizationLogo} 
                  alt={tournament.organization} 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Organized by</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    {tournament.organization}
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
              </div>
            )}
            
            {tournament.status === 'completed' && tournament.champion && (
              <div className="gameverse-card p-4 rounded-xl flex items-center gap-3 border-yellow-500/30 bg-yellow-500/5">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Medal className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-yellow-400/80 mb-0.5">Tournament Champion</div>
                  <div className="text-sm font-bold text-white cursor-pointer hover:text-yellow-400 transition-colors"
                       onClick={() => navigate(`/teams/${tournament.champion.teamSlug}`)}>
                    {tournament.champion.teamName}
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
