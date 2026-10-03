import React from 'react';
import { Gift, Trophy } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTournamentPrizes } from '../../../../features/tournaments/api/useTournamentDetails';

export function TournamentPrizePreview({ tournament }) {
  const navigate = useNavigate();
  const { data: prizes, isLoading } = useTournamentPrizes(tournament.slug);

  if (isLoading || !prizes) return null;
  const isLegacyArray = Array.isArray(prizes);
  const distribution = isLegacyArray ? prizes : (prizes.distribution || []);
  if (distribution.length === 0) return null;

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-400" />
          Prize Distribution
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => navigate(`/t/${tournament.slug}/prizes`)}
        >
          View All
        </Button>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg text-center">
        <div className="text-sm text-pink-400 font-medium mb-1">TOTAL PRIZE POOL</div>
        <div className="text-3xl font-bold text-white">{tournament.prizePoolString}</div>
      </div>

      <div className="space-y-3">
        {distribution.slice(0, 3).map((prize, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                index === 1 ? 'bg-slate-300/20 text-slate-300' :
                'bg-amber-700/20 text-amber-500'
              }`}>
                {index === 0 ? <Trophy className="w-4 h-4" /> : <span className="text-sm font-bold">{index + 1}</span>}
              </div>
              <span className="font-medium text-slate-200">{prize.place} Place</span>
            </div>
            <div className="font-bold text-white">{prize.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
