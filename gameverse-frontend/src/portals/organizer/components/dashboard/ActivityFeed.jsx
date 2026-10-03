import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, User, AlertTriangle, ChevronRight } from 'lucide-react';

export function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center flex flex-col justify-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No recent activity</h3>
        <p className="text-slate-500 text-sm">Tournament and organization activity will appear here.</p>
      </div>
    );
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'check': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'zap': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'user': return <User className="w-4 h-4 text-blue-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Check className="w-4 h-4 text-slate-400" />;
    }
  };

  const getIconBg = (iconName) => {
    switch (iconName) {
      case 'check': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'zap': return 'bg-amber-500/10 border-amber-500/20';
      case 'user': return 'bg-blue-500/10 border-blue-500/20';
      case 'alert': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between shrink-0">
        <span className="text-sm font-bold text-slate-300 tracking-wider">RECENT ACTIVITY</span>
        <Link to="/notifications" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="p-5 sm:p-6 flex-1 pr-2">
        <div className="flex flex-col gap-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-px bg-slate-800"></div>
              )}
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 z-10 ${getIconBg(activity.icon)}`}>
                {getIcon(activity.icon)}
              </div>
              
              <div className="flex-1 pt-1 min-w-0">
                <p className="text-sm font-bold text-white mb-0.5 break-words">{activity.title}</p>
                <p className="text-xs font-medium text-amber-500 mb-1">{activity.context}</p>
                <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
