import React from 'react';
import { Trophy, Info } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';

export function PrizePoolHero({ currency, amount, status }) {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <div className="gameverse-card relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-8 md:p-12 text-center flex flex-col items-center justify-center mb-12">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />
      
      <Badge className="bg-slate-800 text-blue-400 hover:bg-slate-700 font-medium tracking-wider mb-6 border border-blue-500/30">
        TOTAL PRIZE POOL
      </Badge>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 tracking-tight">
          {formattedAmount}
        </h1>
        <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
      </div>
      
      <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
        Official Tournament Rewards
      </p>

      {status && (
        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
          <Info className="w-4 h-4" />
          Status: <span className="text-white font-medium">{status}</span>
        </div>
      )}
    </div>
  );
}
