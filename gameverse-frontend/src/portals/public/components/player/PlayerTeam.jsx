import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function PlayerTeam({ player }) {
  if (!player.teamId) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Current Team</h2>
      <Link 
        to={`/teams/${player.teamSlug}`}
        className="gameverse-card p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-500/50 transition-all w-full max-w-2xl"
      >
        <div className="w-24 h-24 rounded-2xl bg-[#0A1930] border-2 border-white/10 group-hover:border-blue-500/50 overflow-hidden shrink-0 transition-all">
          <img 
            src={player.teamLogo} 
            alt={`${player.teamName} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white font-rajdhani mb-2 group-hover:text-blue-400 transition-colors">
            {player.teamName}
          </h3>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" />
              {player.teamRole || 'Player'}
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
