import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export function WatchUpcomingState({ tournament }) {
  const navigate = useNavigate();
  
  // Format the date if startsAt is available
  const formattedDate = tournament.startsAt 
    ? new Date(tournament.startsAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
    
  const formattedTime = tournament.startsAt
    ? new Date(tournament.startsAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    : null;

  return (
    <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-8">
      <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
        <Calendar className="w-10 h-10 text-blue-400" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4 uppercase">
        Broadcast Starting Soon
      </h2>
      
      <p className="text-lg text-slate-300 mb-8 max-w-lg">
        The official tournament broadcast is scheduled to begin soon. 
        Check back when the tournament goes live to catch all the action.
      </p>

      {formattedDate && formattedTime && (
        <div className="bg-[#0b1b36] border border-white/10 rounded-xl p-6 mb-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 text-slate-300 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white text-xl font-bold">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>{formattedTime}</span>
          </div>
        </div>
      )}

      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        onClick={() => navigate(`/t/${tournament.slug}/schedule`)}
      >
        View Tournament Schedule <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
