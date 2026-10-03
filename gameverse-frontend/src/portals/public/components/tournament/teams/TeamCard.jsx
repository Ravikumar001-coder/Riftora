import React from 'react';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

export function TeamCard({ team, rank }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'QUALIFIED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ELIMINATED': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'ACTIVE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div 
      className="gameverse-card group flex flex-col relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] cursor-pointer"
      onClick={() => navigate(`/teams/${team.slug}`)}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0"></div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Header: Logo, Name, and Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <span className="text-2xl font-bold text-slate-400">{team.tag}</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={team.name}>
                {team.name}
              </h3>
              <p className="text-slate-400 text-sm mt-1">[{team.tag}]</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          {team.group && (
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-lg border border-white/5">
              <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Group</span>
              <span className="text-white font-semibold">{team.group}</span>
            </div>
          )}
          {team.rank && (
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-lg border border-white/5">
              <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Rank</span>
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>#{team.rank}</span>
              </div>
            </div>
          )}
          {team.players && (
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-lg border border-white/5">
              <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Roster</span>
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{team.players} Players</span>
              </div>
            </div>
          )}
          {team.org && (
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-lg border border-white/5">
              <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Org</span>
              <span className="text-white font-semibold truncate" title={team.org}>{team.org}</span>
            </div>
          )}
        </div>

        {/* Footer: Status and Action */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <Badge className={cn("px-2.5 py-1 text-xs border font-semibold tracking-wide uppercase", getStatusColor(team.status))}>
            {team.status}
          </Badge>
          <div className="text-blue-400 text-sm font-medium group-hover:underline flex items-center gap-1">
            View Profile &rarr;
          </div>
        </div>
      </div>
    </div>
  );
}
