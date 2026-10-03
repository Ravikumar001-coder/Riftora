import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Trophy, ArrowRight, CircleDot } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useTournamentLeaderboard } from '../../../../features/tournaments/api/useTournamentDetails';
import { BroadcastPlayer } from './watch/BroadcastPlayer';

export function TournamentLivePanel({ tournament }) {
  const navigate = useNavigate();
  const { data: leaderboard, isLoading } = useTournamentLeaderboard(tournament.slug);

  // Multi-stream state
  const hasMultipleStreams = tournament.streams && tournament.streams.length > 1;
  const initialStream = hasMultipleStreams ? tournament.streams[0] : tournament.stream;
  const [activeStream, setActiveStream] = useState(initialStream);

  useEffect(() => {
    if (!hasMultipleStreams) {
      setActiveStream(tournament.stream);
    }
  }, [tournament.stream, hasMultipleStreams]);

  if (tournament.status !== 'live') return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Live Stream Section */}
      <div className="lg:col-span-2 gameverse-card rounded-xl border-red-500/20 overflow-hidden flex flex-col">
        <div className="bg-[#0b1b36] p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              LIVE STREAM
            </h3>
          </div>
          {tournament.currentMatch && (
            <div className="text-xs font-medium text-slate-300 bg-white/5 px-2 py-1 rounded">
              {tournament.currentMatch.round} • Match {tournament.currentMatch.number} • {tournament.currentMatch.status.replace('_', ' ')}
            </div>
          )}
        </div>
        
        {/* Multi-Stream Language Selector */}
        {hasMultipleStreams && (
          <div className="bg-[#0b1b36] border-b border-white/5 px-4 pt-4 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {tournament.streams.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStream(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${
                  activeStream?.id === s.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {s.language} Broadcast
              </button>
            ))}
          </div>
        )}

        <div className="relative flex-1">
          {activeStream ? (
            <div className="h-full [&>div]:h-full [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
              <BroadcastPlayer stream={activeStream} />
            </div>
          ) : (
            <div className="aspect-video bg-black flex flex-col items-center justify-center p-6 text-center">
              <CircleDot className="w-12 h-12 text-slate-700 mx-auto mb-4 animate-pulse" />
              <h4 className="text-lg font-bold text-slate-300 mb-2">Stream Starting Soon</h4>
              <p className="text-sm text-slate-500">The broadcast will begin shortly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Leaderboard Preview */}
      <div className="gameverse-card rounded-xl border-white/5 flex flex-col">
        <div className="bg-[#0b1b36] p-4 border-b border-white/5 rounded-t-xl flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            LIVE LEADERBOARD
          </h3>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          {isLoading ? (
            <div className="space-y-3 flex-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2 flex-1">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                      index === 1 ? 'bg-slate-300/20 text-slate-300' :
                      index === 2 ? 'bg-amber-700/20 text-amber-500' :
                      'bg-white/5 text-slate-400'
                    }`}>
                      #{entry.rank}
                    </div>
                    <span className="font-bold text-sm text-slate-200">{entry.team}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-400 text-sm">{entry.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              No standings available yet.
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-slate-400 hover:text-white"
            onClick={() => navigate(`/t/${tournament.slug}/leaderboard`)}
          >
            View Full Leaderboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
