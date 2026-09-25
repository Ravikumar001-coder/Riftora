import React from 'react';
import { Button } from '../../../../../components/ui/button';

export function LeaderboardFilters({ 
  stages, 
  selectedStage, 
  setSelectedStage,
  groups,
  selectedGroup,
  setSelectedGroup,
  matches,
  selectedMatch,
  setSelectedMatch
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8 bg-[#0b1b36]/30 p-4 rounded-xl border border-white/5">
      
      {/* Stage Filter */}
      {stages && stages.length > 0 && (
        <div className="flex-1">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 block font-bold">Stage</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStage('Overall')}
                className={`h-8 text-xs ${selectedStage === 'Overall' ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
             >
               Overall
             </Button>
             {stages.map(stage => (
               <Button
                  key={stage}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                  className={`h-8 text-xs ${selectedStage === stage ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
               >
                 {stage}
               </Button>
             ))}
          </div>
        </div>
      )}

      {/* Group Filter */}
      {groups && groups.length > 0 && selectedStage !== 'Overall' && (
        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 block font-bold">Group</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGroup('All')}
                className={`h-8 text-xs ${selectedGroup === 'All' ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
             >
               All Groups
             </Button>
             {groups.map(group => (
               <Button
                  key={group}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                  className={`h-8 text-xs ${selectedGroup === group ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
               >
                 {group}
               </Button>
             ))}
          </div>
        </div>
      )}

      {/* Match Range Filter */}
      {matches && matches.length > 0 && selectedStage !== 'Overall' && (
        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 block font-bold">Matches</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMatch('All')}
                className={`h-8 text-xs ${selectedMatch === 'All' ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
             >
               Overall
             </Button>
             {matches.map(m => (
               <Button
                  key={m.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMatch(m.id)}
                  className={`h-8 text-xs ${selectedMatch === m.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent border-white/10 text-slate-300 hover:bg-white/10'}`}
               >
                 Match {m.number}
               </Button>
             ))}
          </div>
        </div>
      )}

    </div>
  );
}
