import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import { useTournamentPrizes, useTournamentResults } from '../../../../../features/tournaments/api/useTournamentDetails';
import { PrizePoolHero } from './PrizePoolHero';
import { PrizeDistribution } from './PrizeDistribution';
import { SpecialAwards } from './SpecialAwards';
import { PrizeTerms } from './PrizeTerms';
import { Button } from '../../../../../components/ui/button';

export function TournamentPrizesView({ tournament }) {
  const { tournamentSlug } = useParams();
  
  const { data: prizesData, isLoading: isLoadingPrizes } = useTournamentPrizes(tournamentSlug);
  const { data: resultsData } = useTournamentResults(tournamentSlug);

  if (isLoadingPrizes) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse mb-12 border border-white/5"></div>
        <div className="h-8 w-48 bg-slate-800/50 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-32 bg-slate-800/50 rounded-xl animate-pulse border border-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!prizesData || (!prizesData.distribution && !prizesData.totalPrizePool)) {
    return (
      <div className="gameverse-card flex flex-col items-center justify-center p-16 text-center border border-white/5 rounded-2xl bg-slate-900/50">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Prize Pool Coming Soon</h3>
        <p className="text-slate-400 max-w-md mb-8">
          The official prize pool for this tournament has not been announced yet.
        </p>
        <Link to={`/t/${tournamentSlug}`}>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            View Tournament Overview
          </Button>
        </Link>
      </div>
    );
  }

  // Handle old array format fallback just in case
  const isLegacyArray = Array.isArray(prizesData);

  if (isLegacyArray) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PrizePoolHero 
          amount={0} 
          currency="INR" 
          status="ESTIMATED"
        />
        <PrizeDistribution 
          distribution={prizesData.map((p, i) => ({ id: i.toString(), ...p }))} 
          currency="INR" 
          results={resultsData} 
        />
      </div>
    );
  }

  // Modern structured format
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {prizesData.totalPrizePool && (
        <PrizePoolHero 
          amount={prizesData.totalPrizePool} 
          currency={prizesData.currency}
          status={prizesData.status}
        />
      )}

      {prizesData.distribution && prizesData.distribution.length > 0 && (
        <PrizeDistribution 
          distribution={prizesData.distribution} 
          currency={prizesData.currency}
          results={resultsData}
        />
      )}

      <SpecialAwards 
        awards={prizesData.specialAwards} 
        nonCashPrizes={prizesData.nonCashPrizes}
        currency={prizesData.currency}
      />

      {prizesData.prizeTerms && (
        <PrizeTerms terms={prizesData.prizeTerms} />
      )}

      {/* Results CTA if completed */}
      {resultsData && (
        <div className="mt-12 flex justify-center">
          <Link to={`/t/${tournamentSlug}/results`}>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-6 rounded-xl group">
              View Final Tournament Results
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
