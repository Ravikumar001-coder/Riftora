import React from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle2, ArrowLeft, Clock, Shield, Users } from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useTournamentById } from '../api/useTournamentById';
import { useGetMyRegistrationForTournament, useGetRegistrationRoster } from '../api/useRegistrationQueries';
import { usePlayerScheduleQueries } from '../api/usePlayerScheduleQueries';
import { Calendar } from 'lucide-react';

export function MyRegistrationPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const { data: tournament, isLoading: isTourneyLoading } = useTournamentById(tournamentId);
  const { data: registration, isLoading: isRegistrationLoading } = useGetMyRegistrationForTournament(tournamentId);
  const { data: roster, isLoading: isRosterLoading } = useGetRegistrationRoster(registration?.registrationId);
  const { getPlayerSchedule } = usePlayerScheduleQueries(tournamentId);
  const { data: myMatches, isLoading: isMatchesLoading } = getPlayerSchedule;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isTourneyLoading || isRegistrationLoading || isRosterLoading || isMatchesLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tournament not found</h1>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </>
    );
  }

  if (!registration) {
    return (
      <>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white mb-2">No Registration Found</h1>
          <p className="text-slate-400 mb-8">You haven't registered any teams for this tournament yet.</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(`/t/${tournament.slug || tournament.tournamentId || tournament.id}`)}>
              View Tournament
            </Button>
            <Button onClick={() => navigate(`/tournaments/${tournament.tournamentId || tournament.id}/register`)}>
              Register Now
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link to={`/t/${tournament.slug || tournament.id}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Tournament
            </Link>
            <h1 className="text-3xl font-black text-white mb-2">My Registration</h1>
            <p className="text-slate-400">{tournament.name}</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Status Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Registration Status</p>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Registered
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">Success</Badge>
              </h2>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Submitted On</p>
            <p className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              {new Date(registration.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Team Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Registered Team
            </h3>
            
            {registration ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                  {registration.teamLogo ? (
                    <img src={registration.teamLogo} alt={registration.teamName} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Shield className="w-10 h-10 text-slate-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">{registration.teamName}</h4>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">{registration.teamTag}</Badge>
                    <span className="text-slate-500 text-sm">•</span>
                    <span className="text-slate-400 text-sm">{tournament.game}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Team details not found.</p>
            )}
          </div>

          <div className="p-6 bg-slate-900/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Registered Roster
            </h4>
            {isRosterLoading ? (
              <div className="text-slate-400">Loading roster...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {roster?.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                      {member.profileUrl ? (
                         <img src={member.profileUrl} alt={member.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                         member.name?.charAt(0) || i+1
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{member.name || member.inGameName}</p>
                      <p className="text-slate-500 text-xs capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* My Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              My Schedule
            </h3>
          </div>
          <div className="p-6">
            {!myMatches ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">Schedule Not Published</p>
                <p className="text-sm text-slate-500">The tournament director has not yet published the match schedule. You will be notified when it is available.</p>
              </div>
            ) : myMatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">You do not have any matches scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myMatches.map(match => (
                  <div key={match.matchId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Round {match.roundNumber} - Match {match.matchNumber}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(match.scheduledStart).toLocaleString()}
                        </span>
                        {match.matchLabel && (
                          <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700 text-slate-300">
                            {match.matchLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      {/* Find which slot this team is in */}
                      {match.slots.filter(s => s.teamId === registration?.team?.teamId).map(slot => (
                        <div key={slot.slotId} className="text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Your Assignment</p>
                          <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-none">
                            {slot.slotLabel || `Slot ${slot.slotNumber}`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
