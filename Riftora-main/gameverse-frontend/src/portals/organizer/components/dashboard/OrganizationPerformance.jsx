import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function OrganizationPerformance({ performance, orgSlug }) {
  if (!performance) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden flex-1 flex flex-col h-full">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">ORGANIZATION PERFORMANCE</span>
        <Link to={`/organizations/${orgSlug}/manage/analytics`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View Analytics <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tournaments</div>
            <div className="text-2xl font-bold text-white">{performance.tournaments_completed ?? performance.tournamentsCompleted ?? 0}</div>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Participants</div>
            <div className="text-2xl font-bold text-white">{(performance.total_participants ?? performance.totalParticipants ?? 0).toLocaleString()}</div>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Registration</div>
            <div className="text-2xl font-bold text-white">{performance.average_registration ?? performance.averageRegistration ?? 0} <span className="text-sm font-medium text-slate-500">teams</span></div>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Completion</div>
            <div className="text-2xl font-bold text-emerald-400">{performance.tournament_completion ?? performance.tournamentCompletion ?? 0}%</div>
          </div>
        </div>

        {/* CSS Chart representation of trend */}
        <div className="mt-auto pt-4 border-t border-slate-800/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth Trend</span>
            <span className="text-xs font-bold text-emerald-400">+12% this month</span>
          </div>
          <div className="h-16 flex items-end justify-between gap-2">
            {[30, 45, 25, 60, 50, 80, 70, 100].map((val, i) => (
              <div 
                key={i}
                className="w-full bg-blue-600/30 rounded-t-sm hover:bg-blue-500/50 transition-colors cursor-crosshair"
                style={{ height: `${val}%` }}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
