import React from 'react';
import { Network } from 'lucide-react';

export function TournamentRoadmapPreview({ tournament }) {
  // Try to use the roadmap stages if available in the tournament data.
  // Otherwise default to the standard Multi-Stage Roadmap (Qualifiers -> Grand Finals).
  const stages = tournament.roadmapStages || [
    { id: 'qualifiers', name: 'Qualifiers', teams: 256, advancingTeams: 64, matchesPerGroup: 3 },
    { id: 'quarter_finals', name: 'Quarter Finals', teams: 64, advancingTeams: 32, matchesPerGroup: 4 },
    { id: 'semi_finals', name: 'Semi Finals', teams: 32, advancingTeams: 16, matchesPerGroup: 5 },
    { id: 'grand_finals', name: 'Grand Finals', teams: 16, advancingTeams: 1, matchesPerGroup: 6 }
  ];

  // Only render if format type is roadmap or group_stage_finals (fallback)
  if (tournament.formatType !== 'roadmap' && tournament.formatType !== 'group_stage_finals') {
    return null;
  }

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Tournament Roadmap</h3>
      </div>
      
      <div className="relative pt-2 pb-6 px-4">
        <div className="absolute top-8 bottom-12 left-[39px] w-0.5 bg-slate-800 rounded-full hidden md:block"></div>
        
        <div className="space-y-6">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="relative flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center gap-4 w-48 shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#071426] border-2 border-indigo-500/50 flex items-center justify-center font-black text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] z-10 relative">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-white text-base">{stage.name}</h4>
              </div>
              
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Starting Teams</p>
                  <p className="text-sm font-bold text-white">{stage.teams}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Advancing</p>
                  <p className="text-sm font-bold text-emerald-400">{stage.advancingTeams}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Matches / Grp</p>
                  <p className="text-sm font-bold text-blue-400">{stage.matchesPerGroup}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
