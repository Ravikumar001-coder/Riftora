import React, { useState } from 'react';
import { Trophy, CheckCircle2, ChevronDown, ChevronUp, Clock, Star } from 'lucide-react';
import { MatchResultDetail } from './MatchResultDetail';
import { Link } from 'react-router-dom';
import { Badge } from '../../../../../components/ui/badge';
import { cn } from '../../../../../lib/utils';

export function MatchResultCard({ match }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="gameverse-card rounded-xl border border-white/5 bg-slate-900/50 mb-4 transition-all duration-300">
      <div 
        className={cn(
          "p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-xl",
          isExpanded ? "rounded-b-none border-b border-white/5" : ""
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex flex-col gap-1 w-32 shrink-0">
            <span className="text-sm font-bold text-white">{match.name}</span>
            <span className="text-xs text-slate-400">{match.stage}</span>
          </div>

          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 py-1 px-2.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </Badge>

          {match.winner && (
            <div className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10 sm:ml-auto">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <Link 
                to={`/teams/${match.winner.teamSlug}`}
                className="flex items-center gap-2 group"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={match.winner.logo} alt={match.winner.team} className="w-5 h-5 rounded bg-white/10" />
                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  {match.winner.team}
                </span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end border-t sm:border-0 border-white/5 pt-4 sm:pt-0">
          <div className="flex items-center gap-4 sm:border-r border-white/10 sm:pr-4">
            {match.stats?.points && (
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Points</span>
                <span className="font-bold text-blue-300 text-sm">{match.stats.points}</span>
              </div>
            )}
            {match.stats?.eliminations && (
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Elims</span>
                <span className="font-bold text-slate-200 text-sm">{match.stats.eliminations}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {match.vodUrl && (
              <a
                href={match.vodTimestampSeconds ? `${match.vodUrl}&t=${match.vodTimestampSeconds}s` : match.vodUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                WATCH REPLAY
              </a>
            )}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          {match.mvp && (
            <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-slate-900/80 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
              <span className="text-xs text-slate-400 font-medium">MATCH MVP:</span>
              <span className="text-sm font-bold text-white">{match.mvp.name}</span>
              <span className="text-xs text-slate-500 hidden sm:inline">({match.mvp.team})</span>
              <span className="text-xs font-semibold text-blue-400 ml-auto bg-blue-500/10 px-2 py-0.5 rounded">{match.mvp.stat}</span>
            </div>
          )}
          
          <MatchResultDetail standings={match.standings} />
        </div>
      )}
    </div>
  );
}
