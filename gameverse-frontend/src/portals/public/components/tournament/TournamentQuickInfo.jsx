import React, { useEffect, useState } from 'react';
import { Calendar, Users, Trophy, Target, Gamepad2, Ticket } from 'lucide-react';
import { useStompStore } from '../../../../store/stompStore';

export function TournamentQuickInfo({ tournament }) {
  const { subscribe, unsubscribe } = useStompStore();
  const [teamsRegistered, setTeamsRegistered] = useState(tournament?.teamsRegistered || 0);

  useEffect(() => {
    if (tournament) {
      setTeamsRegistered(tournament.teamsRegistered || 0);
      const topic = `/topic/tournament.${tournament.tournamentId}.registrations`;
      subscribe(topic, (data) => {
        if (data && typeof data.teamsRegistered === 'number') {
          setTeamsRegistered(data.teamsRegistered);
        }
      });
      return () => unsubscribe(topic);
    }
  }, [tournament, subscribe, unsubscribe]);

  if (!tournament) return null;

  const quickStats = [
    {
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      label: "Start Date",
      value: new Date(tournament.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      label: "Game",
      value: tournament.game
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      label: "Teams",
      value: `${teamsRegistered} / ${tournament.totalTeamSlots || tournament.maxTeams || 0}`,
      subValue: tournament.status === 'registration_open' ? 'Registration Open' : 'Registration Closed'
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      label: "Prize Pool",
      value: tournament.prizePoolString
    },
    {
      icon: <Ticket className="w-5 h-5 text-pink-400" />,
      label: "Entry Fee",
      value: tournament.entryFee === 0 ? "Free" : `₹${tournament.entryFee}`
    },
    {
      icon: <Target className="w-5 h-5 text-orange-400" />,
      label: "Format",
      value: tournament.format
    }
  ];

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-6">Tournament Info</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-sm font-bold text-white">
              {stat.value}
            </div>
            {stat.subValue && (
              <div className="text-xs text-slate-500 mt-1">{stat.subValue}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
