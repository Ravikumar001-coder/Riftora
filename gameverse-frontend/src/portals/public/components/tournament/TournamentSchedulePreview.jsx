import React from 'react';
import { CalendarDays, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTournamentSchedule } from '../../../../features/tournaments/api/useTournamentDetails';

export function TournamentSchedulePreview({ tournament }) {
  const navigate = useNavigate();
  const { data: schedule, isLoading } = useTournamentSchedule(tournament.slug);

  if (isLoading || !schedule || schedule.length === 0) return null;

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-400" />
          Schedule Preview
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => navigate(`/t/${tournament.slug}/schedule`)}
        >
          View Full Schedule
        </Button>
      </div>

      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {schedule.slice(0, 3).map((match, index) => {
          const isCompleted = match.status === 'COMPLETED';
          const isInProgress = match.status === 'IN_PROGRESS';
          
          return (
            <div key={match.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#071426] bg-[#0b1b36] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-slate-500" />
                ) : isInProgress ? (
                  <PlayCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-white/5 bg-white/5 group-hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-white text-sm">{match.title}</div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isCompleted ? 'bg-slate-800 text-slate-400' :
                    isInProgress ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {match.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mb-2">{match.round}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
