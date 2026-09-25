import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export function WatchEndedState({ tournament }) {
  const navigate = useNavigate();

  return (
    <div className="gameverse-card rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-8">
      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
        <CheckCircle className="w-10 h-10 text-slate-400" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4 uppercase">
        Broadcast Ended
      </h2>
      
      <p className="text-lg text-slate-400 mb-8 max-w-lg">
        The live broadcast for this tournament has officially concluded. 
        Thank you for watching! Check the results page to see the final standings.
      </p>

      <Button 
        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold"
        onClick={() => navigate(`/t/${tournament.slug}/results`)}
      >
        View Tournament Results <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
