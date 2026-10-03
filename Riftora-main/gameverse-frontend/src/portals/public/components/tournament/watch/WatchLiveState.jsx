import React, { useEffect, useState } from 'react';
import { Trophy, Video, Users } from 'lucide-react';
import { BroadcastPlayer } from './BroadcastPlayer';
import { ChatWidget } from '../../../../../features/chat/components/ChatWidget';
import { useTournamentLeaderboard } from '../../../../../features/tournaments/api/useTournamentDetails';
import { useStompStore } from '../../../../../store/stompStore';
import { useQueryClient } from '@tanstack/react-query';

export function WatchLiveState({ tournament }) {
  const { stream, currentMatch } = tournament;
  const { data: leaderboard, isLoading } = useTournamentLeaderboard(tournament.slug);
  
  const queryClient = useQueryClient();
  const subscribe = useStompStore(state => state.subscribe);
  const unsubscribe = useStompStore(state => state.unsubscribe);
  const [viewerCount, setViewerCount] = useState(0);
  
  // Multi-stream state
  const hasMultipleStreams = tournament.streams && tournament.streams.length > 1;
  const initialStream = hasMultipleStreams ? tournament.streams[0] : stream;
  const [activeStream, setActiveStream] = useState(initialStream);

  // Sync active stream if tournament stream changes
  useEffect(() => {
    if (!hasMultipleStreams) {
      setActiveStream(stream);
    }
  }, [stream, hasMultipleStreams]);

  // Live Viewer Count WebSocket Subscription
  useEffect(() => {
    let tournamentId = tournament.id || tournament.tournamentId || tournament.slug;
    if (tournamentId === 'bgmi-pro-championship' || tournamentId === 't1') {
      tournamentId = 'T-003';
    }
    const topic = `/topic/tournament.${tournamentId}.viewers`;
    
    // Initial random value until first WebSocket message arrives
    setViewerCount(Math.floor(Math.random() * 5000) + 5000);
    
    subscribe(topic, (payload) => {
      if (payload && payload.viewers !== undefined) {
        setViewerCount(payload.viewers);
      }
    });

    return () => {
      unsubscribe(topic);
    };
  }, [tournament, subscribe, unsubscribe]);

  // Leaderboard WebSocket Subscription
  useEffect(() => {
    let tournamentId = tournament.id || tournament.tournamentId || tournament.slug;
    if (tournamentId === 'bgmi-pro-championship' || tournamentId === 't1') {
      tournamentId = 'T-003';
    }
    const topic = `/topic/tournament.${tournamentId}.leaderboard`;
    
    subscribe(topic, (payload) => {
      if (payload.event === 'leaderboard_updated' && payload.leaderboard) {
        const mappedLeaderboard = payload.leaderboard.map(entry => ({
          teamId: entry.teamId,
          teamSlug: entry.teamName ? entry.teamName.toLowerCase().replace(/\s+/g, '-') : entry.teamId,
          teamName: entry.teamName,
          team: entry.teamName,
          teamTag: entry.teamTag || '',
          logo: `https://ui-avatars.com/api/?name=${entry.teamName?.substring(0, 2) || 'TM'}&background=random&color=fff`,
          rank: entry.currentRank,
          prevRank: entry.previousRank,
          rankChange: entry.rankChange,
          matchesPlayed: entry.totalMatches,
          placementPoints: entry.totalPoints - entry.totalKills,
          eliminations: entry.totalKills,
          dinners: entry.chickenDinners,
          points: entry.totalPoints,
          isQualified: !entry.isEliminated,
          matchBreakdowns: entry.matchBreakdowns || []
        }));
        mappedLeaderboard.advancementSpots = payload.advancementSpots || 0;
        queryClient.setQueryData(['tournament', tournament.slug, 'leaderboard'], mappedLeaderboard);
      }
    });

    return () => {
      unsubscribe(topic);
    };
  }, [tournament, subscribe, unsubscribe, queryClient]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 uppercase flex items-center justify-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          Watch Live
        </h2>
        <p className="text-slate-400">
          {tournament.name} is live now.
        </p>
      </div>

      {/* Main Layout: Player on left, Chat & Leaderboard on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Stream Player & Match Info) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Multi-Stream Language Selector */}
          {hasMultipleStreams && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
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

          <div className="relative group">
            <BroadcastPlayer stream={activeStream} />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
              <Users className="w-4 h-4 text-slate-300" />
              <span className="text-sm font-bold text-white">{viewerCount.toLocaleString()}</span>
            </div>
          </div>
          
          {currentMatch && (
            <div className="gameverse-card rounded-xl p-6 border border-red-500/20 bg-red-500/5">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Current Match
              </h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">
                    Match {currentMatch.number}
                  </div>
                  <div className="text-slate-300">
                    {currentMatch.round} {currentMatch.status ? `· ${currentMatch.status.replace('_', ' ')}` : ''}
                  </div>
                </div>
                {currentMatch.teams && (
                  <div className="flex -space-x-2">
                    {currentMatch.teams.slice(0, 5).map((team, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0b1b36] bg-slate-800 flex items-center justify-center text-xs font-bold text-white z-10" style={{ zIndex: 5 - i }}>
                        {team.teamName?.substring(0, 2) || 'TM'}
                      </div>
                    ))}
                    {currentMatch.teams.length > 5 && (
                      <div className="w-10 h-10 rounded-full border-2 border-[#0b1b36] bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-400 z-0">
                        +{currentMatch.teams.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Leaderboard side-by-side) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="flex-none">
            <ChatWidget tournament={tournament} />
          </div>

          <div className="gameverse-card rounded-xl flex-1 flex flex-col border border-white/5 overflow-hidden">
            <div className="bg-[#0b1b36] p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Live Leaderboard
              </h3>
            </div>
            
            <div className="p-4 flex-1 flex flex-col bg-slate-900/50">
              {isLoading ? (
                <div className="space-y-3 flex-1">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
                  ))}
                </div>
              ) : leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-2 flex-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {leaderboard.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                          index === 1 ? 'bg-slate-300/20 text-slate-300' :
                          index === 2 ? 'bg-amber-700/20 text-amber-500' :
                          'bg-white/5 text-slate-400'
                        }`}>
                          #{entry.rank}
                        </div>
                        <span className="font-bold text-sm text-slate-200 truncate max-w-[120px]">{entry.team}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400 text-sm">{entry.points}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-500 py-8">
                  No standings available yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
