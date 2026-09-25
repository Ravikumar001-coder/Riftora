import React from 'react';
import { Star, Gift } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';

export function SpecialAwards({ awards, nonCashPrizes, currency }) {
  if ((!awards || awards.length === 0) && (!nonCashPrizes || nonCashPrizes.length === 0)) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
        Special Awards
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cash Special Awards */}
        {awards && awards.map((award) => (
          <div key={award.id} className="gameverse-card p-6 rounded-xl border border-white/5 bg-slate-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">{award.title}</h3>
                <div className="text-xl font-bold text-indigo-400">
                  {formatCurrency(award.amount)}
                </div>
              </div>
            </div>
            {award.description && (
              <p className="text-sm text-slate-400">{award.description}</p>
            )}
          </div>
        ))}

        {/* Non-Cash Prizes */}
        {nonCashPrizes && nonCashPrizes.map((prize) => (
          <div key={prize.id} className="gameverse-card p-6 rounded-xl border border-white/5 bg-slate-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">{prize.title}</h3>
                {prize.sponsor && (
                  <Badge variant="outline" className="mt-1 border-white/10 text-slate-400 text-xs px-2 py-0 h-5">
                    By {prize.sponsor}
                  </Badge>
                )}
              </div>
            </div>
            {prize.description && (
              <p className="text-sm text-slate-400">{prize.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
