import React from 'react';
import { Trophy, CalendarDays, ClipboardList, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrganizerStatsGrid({ stats }) {
  const statCards = [
    {
      title: 'Active Tournaments',
      value: stats.activeTournaments,
      subtitle: 'Currently running',
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      link: '/explore'
    },
    {
      title: 'Upcoming Tournaments',
      value: stats.upcomingTournaments,
      subtitle: 'Next 30 days',
      icon: CalendarDays,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      link: '/explore'
    },
    {
      title: 'Pending Registrations',
      value: stats.pendingRegistrations,
      subtitle: 'Require review',
      icon: ClipboardList,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      link: '/manage/t1/registrations'
    },
    {
      title: 'Live Events',
      value: stats.liveEvents,
      subtitle: 'Currently live',
      icon: Radio,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      link: '/command-center/t1',
      pulse: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Link 
          key={index} 
          to={stat.link}
          className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all group block hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/50"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-slate-400 font-medium text-sm group-hover:text-slate-300 transition-colors">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.border} border`}>
              <stat.icon className={`w-4 h-4 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight group-hover:text-amber-500 transition-colors">{stat.value}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">{stat.subtitle}</p>
        </Link>
      ))}
    </div>
  );
}
