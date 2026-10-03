import React from 'react';
import { Trophy, CalendarDays, ClipboardList, Radio, FileEdit } from 'lucide-react';
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
      title: 'Draft Tournaments',
      value: stats.draftTournaments || 0,
      subtitle: 'Not published yet',
      icon: FileEdit,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
      border: 'border-slate-400/20',
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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Link 
          key={index} 
          to={stat.link}
          className="bg-[#111423] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all group block hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50"
        >
          <div className="flex flex-col h-full justify-between gap-4">
            {/* Top Row: Title and Icon */}
            <div className="flex items-start justify-between">
              <h3 className="text-slate-400 font-semibold text-sm group-hover:text-slate-300 transition-colors">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-4 h-4 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            
            {/* Bottom Row: Value and Subtitle */}
            <div className="mt-2">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white tracking-tight">{stat.value}</span>
              </div>
              <p className="text-xs font-medium text-slate-500">{stat.subtitle}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
