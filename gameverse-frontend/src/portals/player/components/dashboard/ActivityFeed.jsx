import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trophy, Users, Megaphone, ChevronRight } from 'lucide-react';

export function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No recent activity</h3>
        <p className="text-slate-500 text-sm">Tournament and team updates will appear here.</p>
      </div>
    );
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'bell': return <Bell className="w-4 h-4 text-blue-400" />;
      case 'trophy': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'users': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'megaphone': return <Megaphone className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getIconBg = (iconName) => {
    switch (iconName) {
      case 'bell': return 'bg-blue-500/10 border-blue-500/20';
      case 'trophy': return 'bg-amber-500/10 border-amber-500/20';
      case 'users': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'megaphone': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">RECENT ACTIVITY</span>
        <Link to="/notifications" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="p-5 sm:p-6 flex flex-col gap-5">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4 relative">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[15px] top-[32px] bottom-[-20px] w-px bg-slate-800"></div>
            )}
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 z-10 ${getIconBg(activity.icon)}`}>
              {getIcon(activity.icon)}
            </div>
            
            <div className="flex-1 pt-1 min-w-0">
              <p className="text-sm font-medium text-white mb-0.5 break-words">{activity.title}</p>
              <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
