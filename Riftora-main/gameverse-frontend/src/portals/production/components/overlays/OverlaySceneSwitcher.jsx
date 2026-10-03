import React from 'react';
import { MonitorPlay, Trophy, Timer, Swords } from 'lucide-react';

const defaultScenes = [
  { 
    id: 'in_game',
    name: 'In-Game',
    icon: <Swords className="w-4 h-4" />,
    description: 'Leaderboard & Match Info',
    state: { leaderboard: true, matchbar: true, top10: false, sponsor: false, result: false, finale: false }
  },
  {
    id: 'break',
    name: 'Break Screen',
    icon: <Timer className="w-4 h-4" />,
    description: 'Sponsor, Match Info & Top 10',
    state: { leaderboard: false, matchbar: true, top10: true, sponsor: true, result: false, finale: false }
  },
  {
    id: 'result',
    name: 'Match Result',
    icon: <MonitorPlay className="w-4 h-4" />,
    description: 'Post-match results',
    state: { leaderboard: false, matchbar: false, top10: false, sponsor: false, result: true, finale: false }
  },
  {
    id: 'finale',
    name: 'Grand Finale',
    icon: <Trophy className="w-4 h-4" />,
    description: 'Tournament Winner screen',
    state: { leaderboard: false, matchbar: false, top10: false, sponsor: false, result: false, finale: true }
  }
];

export function OverlaySceneSwitcher({ onApplyScene, isApplying }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full shrink-0 mt-4 xl:mt-0 xl:w-64">
      <div className="p-3 border-b border-slate-800/50 bg-slate-900/80">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Scenes</h2>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
        {defaultScenes.map(scene => (
          <button
            key={scene.id}
            onClick={() => onApplyScene(scene)}
            disabled={isApplying}
            className="w-full p-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-blue-500/30 transition-all text-left flex flex-col gap-1 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 flex items-center gap-2">
                {scene.icon}
                {scene.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              {scene.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
