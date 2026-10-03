import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoOff, ArrowRight } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { WatchLiveState } from './WatchLiveState';
import { WatchUpcomingState } from './WatchUpcomingState';
import { WatchOfflineState } from './WatchOfflineState';
import { WatchEndedState } from './WatchEndedState';

export function TournamentWatchView({ tournament }) {
  const navigate = useNavigate();

  // Determine Broadcast State
  if (!tournament.stream) {
    return (
      <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-8">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
          <VideoOff className="w-10 h-10 text-slate-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4 uppercase">
          Broadcast Not Available
        </h2>
        
        <p className="text-lg text-slate-400 mb-8 max-w-lg">
          A public broadcast has not been configured for this tournament yet.
        </p>

        <Button 
          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold"
          onClick={() => navigate(`/t/${tournament.slug}`)}
        >
          View Tournament <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Handle actual states from the backend data
  switch (tournament.status?.toLowerCase()) {
    case 'live':
    case 'in_progress':
      return <WatchLiveState tournament={tournament} />;
    
    case 'upcoming':
    case 'registration':
      return <WatchUpcomingState tournament={tournament} />;
    
    case 'completed':
    case 'ended':
      return <WatchEndedState tournament={tournament} />;
    
    case 'offline':
      return <WatchOfflineState tournament={tournament} />;
      
    default:
      // Fallback if status isn't clear but there's a stream URL
      return <WatchOfflineState tournament={tournament} />;
  }
}
