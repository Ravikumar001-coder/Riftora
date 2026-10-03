import React from 'react';
import { cn } from '../../../../lib/utils';
import { LayoutGrid, Users, Trophy, Medal, Info } from 'lucide-react';

export function TeamTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'results', label: 'Results', icon: Medal },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex items-center min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2",
                isActive 
                  ? "border-blue-500 text-white" 
                  : "border-transparent text-slate-400 hover:text-white hover:border-white/20"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "")} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
