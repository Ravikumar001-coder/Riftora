import React from 'react';
import { Settings, Trophy, Shield, List, Map, Gamepad2, Users, AlertTriangle, BarChart, GitBranch, Crosshair } from 'lucide-react';

export function GameConfigSidebar({ activeTab, setActiveTab, isFreeFire }) {
  
  const SECTIONS = [
    { id: 'basic', label: 'Basic Info', icon: Settings, status: 'complete' },
    { id: 'format', label: 'Match Format', icon: Trophy, status: 'complete' },
    { id: 'structure', label: 'Tournament Structure', icon: GitBranch, status: 'complete' },
    { id: 'scoring', label: 'Scoring System', icon: Shield, status: 'warning' },
    { id: 'tiebreakers', label: 'Tiebreaker Hierarchy', icon: List, status: 'complete' },
    { id: 'maps', label: 'Map Pool / Rotation', icon: Map, status: 'incomplete' },
    { id: 'in_game', label: 'In-Game Rules', icon: Gamepad2, status: 'incomplete' },
    { id: 'roster', label: 'Roster Rules', icon: Users, status: 'incomplete' },
    { id: 'lobby', label: 'Lobby / Room Rules', icon: Gamepad2, status: 'incomplete' },
    { id: 'advancement', label: 'Advancement Rules', icon: GitBranch, status: 'incomplete' },
    { id: 'match', label: 'Match Rules', icon: Trophy, status: 'incomplete' },
    { id: 'results', label: 'Result / Dispute Rules', icon: AlertTriangle, status: 'incomplete' },
  ];

  if (isFreeFire) {
    SECTIONS.splice(6, 0, { id: 'championRush', label: 'Champion Rush', icon: Crosshair, status: 'incomplete' });
  }

  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left w-full
              ${isActive 
                ? 'bg-gradient-to-r from-blue-900/40 to-blue-600/10 border border-blue-500/50 text-white shadow-[inset_4px_0_0_0_#3b82f6]' 
                : 'bg-slate-900/40 border border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }
            `}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 truncate">
              {index + 1}. {section.label}
            </div>
            
            {/* Status indicators based on the specification */}
            {section.status === 'complete' && !isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
            )}
            {section.status === 'warning' && !isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
            )}
            {section.status === 'incomplete' && !isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0"></div>
            )}
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_5px_#3b82f6]"></div>}
          </button>
        );
      })}
    </div>
  );
}
