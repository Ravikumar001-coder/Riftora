import React, { useEffect, useState } from 'react';
import { Calendar, Users, Trophy, Target, Gamepad2, Ticket } from 'lucide-react';
import { useStompStore } from '../../../../store/stompStore';

export function TournamentQuickInfo({ tournament }) {
  const { subscribe, unsubscribe } = useStompStore();
  const [teamsRegistered, setTeamsRegistered] = useState((tournament?.slots_taken !== undefined ? tournament.slots_taken : tournament?.slotsTaken) || 0);

  useEffect(() => {
    if (tournament) {
      setTeamsRegistered((tournament.slots_taken !== undefined ? tournament.slots_taken : tournament.slotsTaken) || 0);
      const tid = tournament.tournament_id || tournament.tournamentId;
      if (tid) {
        const topic = `/topic/tournament.${tid}.registrations`;
        subscribe(topic, (data) => {
          if (data && (typeof data.slotsTaken === 'number' || typeof data.slots_taken === 'number')) {
            setTeamsRegistered(data.slots_taken !== undefined ? data.slots_taken : data.slotsTaken);
          }
        });
        return () => unsubscribe(topic);
      }
    }
  }, [tournament, subscribe, unsubscribe]);

  if (!tournament) return null;

  const startDate = tournament.start_date || tournament.startDate;
  const gameName = tournament.game_name || tournament.gameName || 'TBA';
  const totalSlots = tournament.total_team_slots || tournament.totalTeamSlots || 0;
  const prizeTotal = tournament.prize_pool_total || tournament.prizePoolTotal || 0;
  const currency = tournament.prize_currency || tournament.prizeCurrency || '₹';
  const entryFee = tournament.entry_fee !== undefined ? tournament.entry_fee : tournament.entryFee;
  const formatType = tournament.format_type || tournament.formatType || 'TBD';

  const quickStats = [
    {
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      label: "Start Date",
      value: startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      label: "Game",
      value: gameName
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      label: "Teams",
      value: `${teamsRegistered} / ${totalSlots}`,
      subValue: tournament.status === 'PUBLISHED' ? 'Registration Open' : 'Registration Closed'
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      label: "Prize Pool",
      value: prizeTotal > 0 ? `${currency}${prizeTotal.toLocaleString()}` : 'TBA'
    },
    {
      icon: <Ticket className="w-5 h-5 text-pink-400" />,
      label: "Entry Fee",
      value: (!entryFee || entryFee === 0) ? "Free" : `${currency}${entryFee}`
    },
    {
      icon: <Target className="w-5 h-5 text-orange-400" />,
      label: "Format",
      value: formatType.replace(/_/g, ' ').toUpperCase()
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
