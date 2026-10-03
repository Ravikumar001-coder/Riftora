import React from 'react';
import { Calendar, Trophy, Gamepad2, Hash } from 'lucide-react';

export function DashboardStatsGrid({ stats }) {
  const statCards = [
    {
      title: 'Upcoming',
      value: stats.upcomingMatches,
      subtitle: 'Next 7 days',
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Tournaments',
      value: stats.registeredTournaments,
      subtitle: 'Registered',
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Matches',
      value: stats.matchesThisSeason,
      subtitle: 'This season',
      icon: Gamepad2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Ranking',
      value: `#${stats.regionalRanking}`,
      subtitle: 'Regional',
      icon: Hash,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:bg-slate-800/80 transition-colors group cursor-default">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-slate-400 font-medium text-sm">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
