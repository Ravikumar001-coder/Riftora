import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStompStore } from '../../../store/stompStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

const STATUS_COLORS = {
  scheduled: 'bg-slate-500',
  delayed: 'bg-yellow-500',
  lobby_open: 'bg-blue-500',
  in_progress: 'bg-green-500',
  completed: 'bg-purple-500',
  cancelled: 'bg-red-500',
  voided: 'bg-red-700',
};

const LiveScheduleBoard = ({ tournamentId, matches }) => {
  const { subscribe, unsubscribe } = useStompStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tournamentId) return;

    const topic = `/topic/tournaments/${tournamentId}/matches`;
    
    subscribe(topic, (updatedMatch) => {
      // Update match in the react-query cache
      queryClient.setQueryData(['admin-matches', tournamentId], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(match => 
          match.matchId === updatedMatch.matchId ? updatedMatch : match
        );
      });
    });

    return () => {
      unsubscribe(topic);
    };
  }, [tournamentId, subscribe, unsubscribe, queryClient]);

  const columns = ['scheduled', 'delayed', 'in_progress', 'completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {columns.map(status => {
        const columnMatches = matches?.filter(m => m.status === status) || [];
        
        return (
          <div key={status} className="flex flex-col gap-3 min-w-[250px] bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-200 capitalize">
                {status.replace('_', ' ')}
              </h3>
              <Badge variant="outline" className="bg-slate-800">
                {columnMatches.length}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
              {columnMatches.map(match => (
                <Card key={match.matchId} className="bg-slate-800/80 border-slate-700 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-slate-200">
                        Match {match.matchNumber} {match.matchLabel && `(${match.matchLabel})`}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[match.status] || 'bg-slate-500'}`} />
                    </div>
                    <div className="text-xs text-slate-400">
                      Round {match.roundNumber}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(match.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {columnMatches.length === 0 && (
                <div className="text-center p-4 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                  No matches
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveScheduleBoard;
