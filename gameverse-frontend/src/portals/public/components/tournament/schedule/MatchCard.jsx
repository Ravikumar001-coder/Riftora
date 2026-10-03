import React from 'react';
import { Play, Check, Pause, XCircle, Clock } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { Link } from 'react-router-dom';

const statusConfig = {
  COMPLETED: {
    icon: Check,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    label: 'COMPLETED'
  },
  IN_PROGRESS: {
    icon: Play,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'LIVE NOW'
  },
  UPCOMING: {
    icon: Clock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    label: 'UPCOMING'
  },
  SCHEDULED: {
    icon: Clock,
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20',
    label: 'SCHEDULED'
  },
  PAUSED: {
    icon: Pause,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'PAUSED'
  },
  CANCELLED: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    label: 'CANCELLED'
  }
};

export function MatchCard({ match, isHighlighted, tournamentSlug }) {
  const config = statusConfig[match.status] || statusConfig.SCHEDULED;
  const Icon = config.icon;
  
  const time = new Date(match.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`gameverse-card rounded-xl p-5 border ${isHighlighted ? config.borderColor : 'border-white/5'} transition-all hover:bg-white/[0.02]`}>
      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={`${config.bgColor} ${config.color} border-none font-bold uppercase tracking-wider text-xs px-2.5 py-1`}>
            {match.status === 'IN_PROGRESS' && <span className="animate-pulse mr-1.5 w-2 h-2 rounded-full bg-red-500 inline-block" />}
            {!['IN_PROGRESS'].includes(match.status) && <Icon className="w-3 h-3 mr-1.5 inline-block" />}
            {config.label}
          </Badge>
          <span className="text-sm font-semibold text-white">MATCH {match.matchNumber.toString().padStart(2, '0')}</span>
          <span className="text-xs text-slate-400 flex items-center gap-2">
            <span>•</span> {match.stage} <span>•</span> {match.round}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-300 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-md">
          <Clock className="w-4 h-4 text-blue-400" />
          {time}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        {/* Match Info */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Format</div>
            <div className="text-sm font-semibold text-slate-200">{match.format}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Map</div>
            <div className="text-sm font-semibold text-slate-200">{match.map}</div>
          </div>
          {match.teamScores && (
             <div className="col-span-2">
               <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Teams</div>
               <div className="flex gap-4">
                 {match.teamScores.map((ts, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium text-white">{ts.name}</span>
                      <span className="text-blue-400 font-bold ml-2">{ts.score} pts</span>
                    </div>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          {match.status === 'IN_PROGRESS' && (
            <Link to={`/t/${tournamentSlug}/watch`} className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse-slow border border-red-500/30">
                <Play className="w-4 h-4 mr-2" /> Watch Live
              </Button>
            </Link>
          )}
          {['COMPLETED', 'IN_PROGRESS'].includes(match.status) && (
            <Link to={`/t/${tournamentSlug}/leaderboard`} className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto border-white/10 hover:bg-white/5 text-slate-300">
                Leaderboard
              </Button>
            </Link>
          )}
          {!['COMPLETED', 'IN_PROGRESS'].includes(match.status) && (
             <Button variant="outline" className="w-full md:w-auto border-white/10 text-slate-400 cursor-not-allowed" disabled>
               Match Details
             </Button>
          )}
        </div>
      </div>
    </div>
  );
}
