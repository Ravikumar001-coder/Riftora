import React from 'react';
import { cn } from '../../../../lib/utils';
import { PlayCircle, CheckCircle2, Calendar, Trophy } from 'lucide-react';

export function QuickStatusFilters({ currentStatus, updateFilter }) {
  const filters = [
    { id: 'all', label: 'All Tournaments', icon: Trophy, color: 'text-blue-400' },
    { id: 'live', label: 'Live Now', icon: PlayCircle, color: 'text-red-500' },
    { id: 'registration_open', label: 'Registration Open', icon: CheckCircle2, color: 'text-green-400' },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = currentStatus === filter.id;
        const Icon = filter.icon;
        
        return (
          <button
            key={filter.id}
            onClick={() => updateFilter('status', filter.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full border whitespace-nowrap transition-all duration-300",
              isActive 
                ? "bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md" 
                : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? filter.color : "text-slate-500")} />
            <span className={cn("text-sm font-semibold", isActive ? "text-white" : "")}>
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
