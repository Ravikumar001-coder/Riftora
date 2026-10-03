import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

export function UpcomingSchedule({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No upcoming schedule</h3>
        <p className="text-slate-500 text-sm">Your operational schedule is clear.</p>
      </div>
    );
  }

  // Group by date
  const groupedSchedule = schedule.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">UPCOMING SCHEDULE</span>
        <Link to="/organizations/hydra-esports/manage/tournaments" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View Master Schedule <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="p-5 sm:p-6 flex flex-col gap-6">
        {Object.entries(groupedSchedule).map(([date, items]) => (
          <div key={date}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              {date}
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <Link 
                  key={item.id} 
                  to={item.link}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-slate-700 transition-colors group"
                >
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.time}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-0.5">{item.tournament}</h4>
                    <p className="text-xs font-medium text-amber-500">{item.context}</p>
                  </div>
                  
                  {item.details && (
                    <div className="text-xs text-slate-400 font-medium shrink-0">
                      {item.details}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
