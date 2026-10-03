import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function RegistrationOverview({ overview }) {
  if (!overview) return null;

  const total = overview.pending + overview.approved + overview.rejected + overview.waitlisted;
  
  const getPercentage = (value) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden h-[340px] flex flex-col">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">REGISTRATION OVERVIEW</span>
      </div>
      
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
              <span className="text-sm font-bold text-amber-500">{overview.pending}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${getPercentage(overview.pending)}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</span>
              <span className="text-sm font-bold text-emerald-400">{overview.approved}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${getPercentage(overview.approved)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waitlisted</span>
              <span className="text-sm font-bold text-blue-400">{overview.waitlisted}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${getPercentage(overview.waitlisted)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
              <span className="text-sm font-bold text-red-400">{overview.rejected}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${getPercentage(overview.rejected)}%` }}></div>
            </div>
          </div>

        </div>

        <Link 
          to="/manage/t1/registrations" 
          className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700 flex items-center justify-center"
        >
          Review Registrations
        </Link>
      </div>
    </div>
  );
}
