import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Shield } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function PlayerCard({ player }) {
  const isCaptain = player.teamRole === 'Captain';
  
  return (
    <Link 
      to={`/profile/${player.username}`}
      className="gameverse-card p-6 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
      
      <div className="relative mb-4">
        <div className={cn(
          "w-20 h-20 rounded-2xl overflow-hidden border-2",
          isCaptain ? "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "border-white/10 group-hover:border-blue-500/50"
        )}>
          <img 
            src={player.avatar} 
            alt={player.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        {isCaptain && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-[#0A1930] shadow-lg rotate-12">
            <Crown className="w-5 h-5 fill-current" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-white font-rajdhani mb-1 group-hover:text-blue-400 transition-colors">
        {player.displayName}
      </h3>
      <p className="text-sm text-slate-400 mb-3">@{player.username}</p>
      
      <div className="mt-auto pt-4 w-full border-t border-white/5 flex items-center justify-center gap-2">
        {isCaptain ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Captain
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {player.teamRole}
          </span>
        )}
      </div>
    </Link>
  );
}
