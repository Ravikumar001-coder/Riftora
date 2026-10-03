import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Gamepad2, Medal, User, PlusCircle } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { icon: Search, label: 'Find Tournament', path: '/explore' },
    { icon: Users, label: 'My Team', path: '/teams/my-team/manage' },
    { icon: PlusCircle, label: 'Create Team', path: '/teams/create' },
    { icon: Gamepad2, label: 'My Matches', path: '/tournaments/t1/my-matches' },
    { icon: Medal, label: 'My Results', path: '/t/riftora-championship/results' },
    { icon: User, label: 'Edit Profile', path: '/profile/me#edit' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-800/60">
        <span className="text-sm font-bold text-slate-300 tracking-wider">QUICK ACTIONS</span>
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            to={action.path}
            className="flex items-center gap-3 p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-400 text-slate-400 transition-colors">
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
