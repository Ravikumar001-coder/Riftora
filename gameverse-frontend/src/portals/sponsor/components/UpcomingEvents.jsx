import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UpcomingEvents({ events, tournamentSlug }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Upcoming Events</h2>
        <Link to={`/t/${tournamentSlug}/schedule`} className="text-xs text-blue-400 hover:text-blue-300">View Schedule &rarr;</Link>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium">{event.title}</h3>
                <p className="text-xs text-slate-400">{event.subtitle}</p>
              </div>
              <div className="flex items-center text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded">
                <Calendar className="w-3 h-3 mr-1.5" />
                {event.time}
              </div>
            </div>
            
            <div className="mt-3 flex items-start gap-2 text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
              <Tag className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Placement: {event.placement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
