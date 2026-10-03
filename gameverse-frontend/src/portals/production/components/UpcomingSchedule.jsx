import React from 'react';
import { Calendar } from 'lucide-react';

export function UpcomingSchedule({ schedule }) {
  if (!schedule) return null;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Run of Show
        </h3>
        <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded">Today</span>
      </div>

      <div className="relative pl-3 flex-1 overflow-y-auto custom-scrollbar">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10"></div>

        <div className="space-y-4">
          {schedule.map((item, index) => {
            const isLive = item.status === 'LIVE';
            const isNext = item.status === 'NEXT';
            const isUpcoming = item.status === 'SCHEDULED' || item.status === 'UPCOMING';

            return (
              <div key={item.id} className="relative pl-8">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 bg-slate-950 ${
                  isLive ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                  isNext ? 'border-amber-500 bg-amber-500' :
                  'border-slate-600'
                }`}></div>

                <div className={`p-3 rounded-xl border ${
                  isLive ? 'bg-red-500/10 border-red-500/20' :
                  isNext ? 'bg-amber-500/10 border-amber-500/20' :
                  'bg-slate-950/50 border-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">
                      {item.number ? `Match ${item.number}` : item.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      isLive ? 'bg-red-500 text-white' :
                      isNext ? 'bg-amber-500/20 text-amber-400' :
                      'text-slate-500'
                    }`}>
                      {item.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.phase}</span>
                    {item.map && <span>{item.map} • {item.lobby}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
