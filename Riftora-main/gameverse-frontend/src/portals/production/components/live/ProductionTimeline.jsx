import React, { useEffect } from 'react';
import { History } from 'lucide-react';
import { useGetAnnotations, useCreateAnnotation } from '../../../../features/broadcast/api/useAnnotationQueries';
import { useParams } from 'react-router-dom';

export function ProductionTimeline({ state, dispatch }) {
  const { tournamentId } = useParams();
  
  const { data: annotations } = useGetAnnotations(tournamentId);
  const createAnnotationMutation = useCreateAnnotation(tournamentId);

  // Sync DB annotations with local state timeline
  useEffect(() => {
    if (annotations && annotations.length > 0) {
      // Create a normalized timeline from DB annotations
      const dbTimeline = annotations.map(ann => {
        let text = ann.customLabel || 'Event';
        if (ann.label === 'match_start') text = 'Match started';
        if (ann.label === 'match_end') text = 'Match concluded';
        if (ann.label === 'chicken_dinner') text = 'Winner Winner Chicken Dinner';
        if (ann.label === 'notable_kill') text = 'Notable kill / highlight';
        if (ann.label === 'technical_pause') text = 'Technical pause called';
        
        const date = new Date(ann.createdAt);
        return {
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: ann.label.replace('_', ' ').toUpperCase(),
          text: text
        };
      });
      // Assuming we just want to merge or override. For simplicity, since the server has the truth:
      // Wait, dispatching here might cause loops if we aren't careful.
      // We will just use the DB annotations directly for rendering, and fall back to local state if needed.
    }
  }, [annotations]);

  // Use DB annotations for rendering if available, else local state
  const displayTimeline = (annotations && annotations.length > 0) 
    ? annotations.map(ann => {
        let text = ann.customLabel || 'Event';
        if (ann.label === 'match_start') text = 'Match started';
        if (ann.label === 'match_end') text = 'Match concluded';
        if (ann.label === 'chicken_dinner') text = 'Winner Winner Chicken Dinner';
        if (ann.label === 'notable_kill') text = 'Notable kill / highlight';
        if (ann.label === 'technical_pause') text = 'Technical pause called';
        
        const date = new Date(ann.createdAt);
        return {
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: ann.label.replace('_', ' ').toUpperCase(),
          text: text
        };
      })
    : state.timeline;

  const handleAddAnnotation = (label, customText) => {
    // Optimistic UI update
    dispatch({ type: 'ADD_ANNOTATION', payload: { type: label.replace('_', ' ').toUpperCase(), text: customText }});
    
    // Save to DB
    const streamDurationSecs = state.streamUptime ? parseUptimeToSeconds(state.streamUptime) : 0;
    createAnnotationMutation.mutate({
      label: label,
      customLabel: customText,
      streamTimestamp: streamDurationSecs.toString()
    });
  };

  const parseUptimeToSeconds = (uptimeStr) => {
    // expected "01:23:45"
    if (!uptimeStr) return 0;
    const parts = uptimeStr.split(':');
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex-1 flex flex-col min-h-[300px]">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <History className="w-3.5 h-3.5" />
          Broadcast Timeline
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="relative border-l border-slate-800 ml-3 space-y-6">
          {displayTimeline.map((event, index) => (
            <div key={index} className="relative pl-6">
              <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-slate-900 bg-blue-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 mb-0.5">{event.time}</span>
                <span className="text-sm text-slate-300">
                  {event.type && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mr-2 bg-slate-800 text-slate-400">
                      {event.type}
                    </span>
                  )}
                  {event.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-slate-800/50 bg-slate-900/80">
        <div className="flex gap-2 mb-2">
          <button onClick={() => handleAddAnnotation('match_start', 'Match started')} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700 transition-colors">Start</button>
          <button onClick={() => handleAddAnnotation('chicken_dinner', 'Winner Winner Chicken Dinner')} className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-500 rounded border border-amber-500/30 transition-colors">Dinner</button>
          <button onClick={() => handleAddAnnotation('notable_kill', 'Notable kill / highlight')} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700 transition-colors">Kill</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleAddAnnotation('technical_pause', 'Technical pause called')} className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 rounded border border-red-500/30 transition-colors">Pause</button>
          <button onClick={() => handleAddAnnotation('match_end', 'Match concluded')} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700 transition-colors">End</button>
        </div>
      </div>
    </div>
  );
}
