import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, ArrowRight, Radio } from 'lucide-react';

export function NextTournamentCard({ tournament }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!tournament || tournament.isLive) return;

    const calculateTimeLeft = () => {
      const difference = new Date(tournament.startAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
      } else {
        setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute
    return () => clearInterval(timer);
  }, [tournament]);

  if (!tournament) return null;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col relative shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>
      
      <div className="p-5 sm:p-6 flex-1 flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-slate-300 tracking-wider">NEXT TOURNAMENT</span>
          <span className="text-sm font-bold text-slate-400 uppercase">
            {new Date(tournament.startAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight mb-1">{tournament.title}</h3>
              <p className="text-sm text-slate-400 font-medium">
                {tournament.game} • {tournament.format} • {tournament.maxTeams} Teams
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-4 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="w-4 h-4" /> Registration
              </div>
              <div className="text-sm font-bold text-white">
                {tournament.registeredTeams} / {tournament.maxTeams}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                </div> 
                Status
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {tournament.status}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" /> Start
              </div>
              <div className="text-sm font-bold text-white">
                {new Date(tournament.startAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(tournament.startAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Countdown */}
        <div className="mt-auto">
          {tournament.isLive ? (
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-bold text-red-500 tracking-wider">LIVE NOW</span>
              </div>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Starts In</div>
              <div className="text-2xl font-mono text-white font-bold">{timeLeft}</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/manage/${tournament.id}/overview`} className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700 flex items-center justify-center">
              Open Tournament
            </Link>
            <Link to={`/command-center/${tournament.id}`} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <Radio className="w-4 h-4" /> Command Center
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
