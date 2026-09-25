import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight } from 'lucide-react';

export function UpcomingMatches({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No upcoming matches</h3>
        <p className="text-slate-500 text-sm">Your next match will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden mb-8">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">UPCOMING MATCHES</span>
        <Link to="/tournaments/t1/my-matches" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
          View Schedule <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="divide-y divide-slate-800/60">
        {matches.map((match) => (
          <div key={match.id} className="p-5 sm:p-6 hover:bg-slate-800/30 transition-colors group">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              
              {/* Date/Time Block */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-1 w-32 shrink-0">
                <span className={`text-sm font-bold ${match.date === 'Today' ? 'text-blue-400' : 'text-slate-300'}`}>
                  {match.date}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {match.time}
                </span>
              </div>
              
              {/* Match Details */}
              <div className="flex-1">
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{match.tournament}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
                  <span>{match.round}</span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="text-slate-300 font-medium">{match.team}</span>
                </div>
              </div>
              
              {/* Actions/Status */}
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-medium text-slate-400">{match.status}</span>
                </div>
                <Link to={`/tournaments/t1/my-matches`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700">
                  <span className="sr-only">View</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
