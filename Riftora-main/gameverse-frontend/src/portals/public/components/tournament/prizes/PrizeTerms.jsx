import React from 'react';
import { ScrollText } from 'lucide-react';

export function PrizeTerms({ terms }) {
  if (!terms) return null;

  return (
    <div className="gameverse-card p-6 md:p-8 rounded-xl border border-white/5 bg-slate-900/50 mt-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Prize Terms & Conditions
        </h2>
      </div>
      
      <p className="text-slate-400 leading-relaxed text-sm max-w-4xl">
        {terms}
      </p>
    </div>
  );
}
