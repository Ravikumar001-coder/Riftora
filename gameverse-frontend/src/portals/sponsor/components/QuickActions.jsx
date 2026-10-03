import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, PlayCircle, BarChart3, Bell } from 'lucide-react';

export function QuickActions({ tournamentSlug }) {
  const actions = [
    { label: 'View Tournament', icon: <ExternalLink className="w-4 h-4" />, to: `/t/${tournamentSlug}` },
    { label: 'Watch Live', icon: <PlayCircle className="w-4 h-4" />, to: `/t/${tournamentSlug}/watch`, primary: true },
    { label: 'View Schedule', icon: <Calendar className="w-4 h-4" />, to: `/t/${tournamentSlug}/schedule` },
    { label: 'View Leaderboard', icon: <BarChart3 className="w-4 h-4" />, to: `/t/${tournamentSlug}/leaderboard` },
    { label: 'Notifications', icon: <Bell className="w-4 h-4" />, to: `/notifications` },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-5">Quick Actions</h2>
      
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <Link 
            key={idx} 
            to={action.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
              action.primary 
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
