import React from 'react';
import { cn } from '../../../../lib/utils';
import { 
  LayoutGrid, 
  CalendarDays, 
  Trophy, 
  Medal, 
  Users, 
  FileText, 
  Gift 
} from 'lucide-react';

export function TournamentTabs({ activeTab, onTabChange, hasStream }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'results', label: 'Results', icon: <Medal className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    { id: 'rules', label: 'Rules', icon: <FileText className="w-4 h-4" /> },
    { id: 'prizes', label: 'Prizes', icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <div className="border-b border-white/10 overflow-x-auto no-scrollbar">
      <div className="container mx-auto px-4 flex min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === tab.id 
                ? "border-blue-500 text-white" 
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
