import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, AlertTriangle, Play, MapPin, CalendarDays, Sword, Map, Users } from 'lucide-react';
import { CredentialCard } from '../../../../features/command-center/components/CredentialCard';

export function NextMatchCard({ match }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(match?.checkedIn || false);
  const [checkInState, setCheckInState] = useState(match?.status); // 'Scheduled', 'CheckInOpen', 'Live', 'Completed'

  useEffect(() => {
    if (!match) return;

    const calculateTimeLeft = () => {
      const difference = new Date(match.date).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('00:00:00');
        setCheckInState('Live');
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );

      // Check-in opens 60 mins before match
      if (difference <= 60 * 60 * 1000 && !isCheckedIn) {
        setCheckInState('CheckInOpen');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [match, isCheckedIn]);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // In a real app, you would dispatch a toast here.
  };

  if (!match) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 lg:mb-0 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <CalendarDays className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">NO UPCOMING MATCH</h3>
        <p className="text-slate-400 mb-6 max-w-sm">
          You don't have a match scheduled yet. Explore tournaments and find your next competition.
        </p>
        <Link to="/explore" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors border border-blue-500">
          Explore Tournaments
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-1 relative overflow-hidden h-full flex flex-col">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300 tracking-wider">NEXT MATCH</span>
          </div>
          
          {checkInState !== 'Live' ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-mono text-white font-medium">IN {timeLeft}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-bold text-red-500 tracking-wider">LIVE NOW</span>
            </div>
          )}
        </div>

        {/* Tournament Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white leading-tight flex items-center gap-2">
              <span className="text-xl">🔥</span> {match.tournamentName}
            </span>
          </div>
          <span className="text-sm text-slate-400 font-medium">
            {match.stage ? `${match.stage} • ${match.game}` : match.game}
          </span>
        </div>

        {/* Dynamic Match Format Banner */}
        {match.matchType === 'BATTLE_ROYALE' ? (
          <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="text-sm font-bold text-white mb-1">{match.groupInfo}</div>
                <div className="text-xs text-slate-400 font-medium">Match #{match.matchNumber} ({match.mapName})</div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg whitespace-nowrap">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Your Slot:</span>
                <span className="text-sm font-black text-white">#{match.yourSlot}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {match.totalSlots} Teams Lobby
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Room credentials unlock at check-in
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-8 bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
            <div className="flex-1 text-center">
              <div className="text-base sm:text-lg font-bold text-white truncate px-2">{match.myTeam}</div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mb-1 z-10">
                <Sword className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">VS</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-base sm:text-lg font-bold text-slate-300 truncate px-2">{match.opponentTeam}</div>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 text-slate-300 text-sm bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/50">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span className="truncate">Today, {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-slate-300 text-sm bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/50">
            {match.matchType === 'BATTLE_ROYALE' ? (
              <>
                <Map className="w-4 h-4 text-slate-400" />
                <span className="truncate">{match.mapName} • {match.mode}</span>
              </>
            ) : (
              <>
                <Map className="w-4 h-4 text-slate-400" />
                <span className="truncate">{match.mode || 'Custom Room'}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2.5 text-slate-300 text-sm bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/50">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate">Lobby {match.lobby}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300 text-sm bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/50">
            {match.matchType === 'BATTLE_ROYALE' ? (
              <>
                <Users className="w-4 h-4 text-slate-400" />
                <span className="truncate">Slot {match.yourSlot} • 4/4 Ready</span>
              </>
            ) : (
              <>
                <Sword className="w-4 h-4 text-slate-400" />
                <span className="truncate">Server / Custom Room #{match.lobby}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          {/* Check-in State & Actions */}
          {isCheckedIn ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl font-medium w-full">
                <CheckCircle2 className="w-5 h-5" />
                ✓ Checked In
              </div>
              <Link to={`/tournaments/${match.tournamentId}/my-matches`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 w-full">
                View Match <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : checkInState === 'CheckInOpen' ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button onClick={handleCheckIn} className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] w-full">
                <AlertTriangle className="w-5 h-5" />
                Check In Now
              </button>
              <Link to={`/tournaments/${match.tournamentId}/my-matches`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 w-full">
                View Match
              </Link>
            </div>
          ) : checkInState === 'Live' ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link to={`/tournaments/${match.tournamentId}/my-matches`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] w-full">
                <Play className="w-5 h-5" />
                Join Match
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 text-center py-3 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-xl font-medium text-sm w-full">
                Check-in opens 1 hour before match
              </div>
              <Link to={`/tournaments/${match.tournamentId}/my-matches`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 w-full">
                View Match
              </Link>
            </div>
          )}
        </div>

        {/* Credential Card - Displayed if match is approaching or live */}
        {match.matchType === 'BATTLE_ROYALE' && (checkInState === 'Live' || isCheckedIn) && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <CredentialCard 
              matchId={match.id}
              matchNumber={match.matchNumber}
              roundNumber={match.round || 1}
              scheduledStart={new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              slotNumber={match.yourSlot}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Trophy icon component since we can't export multiple lucide icons cleanly in a single go if they clash
const TrophyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
)
