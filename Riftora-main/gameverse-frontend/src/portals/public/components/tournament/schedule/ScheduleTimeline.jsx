import React from 'react';
import { Check, Circle, Play } from 'lucide-react';

export function ScheduleTimeline({ matches }) {
  // Extract unique stages
  const stages = [...new Set(matches.map(m => m.stage))];
  
  // Determine status of each stage
  const stageStatuses = stages.map(stage => {
    const stageMatches = matches.filter(m => m.stage === stage);
    const hasLive = stageMatches.some(m => m.status === 'IN_PROGRESS');
    const allCompleted = stageMatches.every(m => m.status === 'COMPLETED');
    
    if (hasLive) return { stage, status: 'LIVE' };
    if (allCompleted) return { stage, status: 'COMPLETED' };
    return { stage, status: 'UPCOMING' };
  });

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5 mb-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center min-w-max">
        <div className="flex flex-col items-center mr-8">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Registration</span>
        </div>
        
        {stageStatuses.map((s, idx) => (
          <React.Fragment key={s.stage}>
            <div className={`w-16 h-[2px] ${s.status === 'COMPLETED' ? 'bg-emerald-500/50' : 'bg-white/10'} -mt-6`} />
            
            <div className="flex flex-col items-center mx-8 relative group">
              {s.status === 'COMPLETED' && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Check className="w-4 h-4" />
                </div>
              )}
              {s.status === 'LIVE' && (
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center mb-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20" />
                  <Play className="w-3 h-3 fill-current" />
                </div>
              )}
              {s.status === 'UPCOMING' && (
                <div className="w-8 h-8 rounded-full bg-white/5 text-slate-500 border border-white/10 flex items-center justify-center mb-2">
                  <Circle className="w-3 h-3" />
                </div>
              )}
              
              <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                s.status === 'COMPLETED' ? 'text-emerald-400' :
                s.status === 'LIVE' ? 'text-red-400' : 'text-slate-500'
              }`}>
                {s.stage}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
