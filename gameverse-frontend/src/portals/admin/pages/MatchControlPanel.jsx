import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultEntryForm } from '@/features/results/components/ResultEntryForm';

const useMatchDetails = (tournamentId, matchId) => {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: async () => {
      // Assuming a getMatch endpoint exists in MatchAdminController or we filter from getMatches
      const response = await api.get(`/admin/tournaments/${tournamentId}/matches`);
      return response.data.data.find(m => m.matchId === matchId);
    },
    enabled: !!tournamentId && !!matchId,
  });
};

const useUpdateMatchStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tournamentId, matchId, status }) => {
      const response = await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/status`, { status });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId, 'matches'] });
    },
  });
};

const MatchControlPanel = () => {
  const { tournamentId, matchId } = useParams();
  const { data: match, isLoading } = useMatchDetails(tournamentId, matchId);
  const { mutate: updateStatus, isPending } = useUpdateMatchStatus();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (match?.status === 'in_progress' && match?.actualStart) {
      interval = setInterval(() => {
        const start = new Date(match.actualStart).getTime();
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const expectedSeconds = 35 * 60; // 35 minutes default
    if (elapsedTime > expectedSeconds * 1.5) return 'text-red-500';
    if (elapsedTime > expectedSeconds * 1.1) return 'text-yellow-500';
    return 'text-emerald-400';
  };

  if (isLoading) return <div className="p-8">Loading Match Details...</div>;
  if (!match) return <div className="p-8">Match not found.</div>;

  const handleStatusChange = (status) => {
    if (status === 'voided') {
      const scheduleRematch = window.confirm("Do you want to schedule a rematch for this voided match?");
      // Assuming updateStatus handles voiding with a custom parameter or we have a dedicated hook
      // For now we'll pass it in the status object if the backend expects it, but since updateStatus
      // only expects {status}, we need a dedicated mutation for void. Let's just mock the call.
      api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/void`, {
        reason: "Voided by referee",
        scheduleRematch
      }).then(() => {
        window.location.reload();
      });
      return;
    }
    updateStatus({ tournamentId, matchId, status });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'in_progress': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'lobby_open': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'paused': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Match Control Panel</h1>
          <p className="text-slate-400 mt-1">Manage state and technical operations for this match.</p>
        </div>
        <Badge className={`text-sm py-1 px-3 border ${getStatusColor(match.status)}`}>
          {match.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Match Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Match Number</p>
                <p className="font-medium text-white">{match.matchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Round</p>
                <p className="font-medium text-white">{match.roundNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Scheduled Start</p>
                <p className="font-medium text-white">{new Date(match.scheduledStart).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Match Label</p>
                <p className="font-medium text-white">{match.matchLabel || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Match Timer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className={`text-5xl font-mono tracking-wider ${getTimerColor()}`}>
              {match.status === 'in_progress' ? formatTime(elapsedTime) : '00:00'}
            </div>
            <p className="text-slate-400 text-sm mt-2">Expected Duration: 35m</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Lobby Readiness Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {match.slots?.map(slot => (
                <div key={slot.slotId} className="bg-slate-900 border border-slate-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm font-medium">Slot {slot.slotNumber}</p>
                    <p className="text-slate-400 text-xs">{slot.teamName || 'Vacant'}</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Ready</Badge>
                </div>
              ))}
              {!match.slots?.length && <p className="text-slate-500 text-sm">No slots assigned yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-col">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={isPending || match.status !== 'scheduled'}
              onClick={() => handleStatusChange('lobby_open')}
            >
              Open Lobby
            </Button>
            <Button 
              className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending || !['scheduled', 'lobby_open', 'paused'].includes(match.status)}
              onClick={() => handleStatusChange('in_progress')}
            >
              Start Match / Resume
            </Button>
            <Button 
              variant="destructive"
              className="w-full justify-start"
              disabled={isPending || match.status !== 'in_progress'}
              onClick={() => {
                const reason = window.prompt("Enter pause reason (e.g., Disconnect, Network):");
                if (reason) {
                  api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/pause`, {
                    reason,
                    reasonNotes: "Declared via Quick Actions"
                  }).then(() => window.location.reload());
                }
              }}
            >
              Declare Technical Pause
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start border-rose-500/50 text-rose-400 hover:bg-rose-500/10"
              disabled={isPending || ['completed', 'voided'].includes(match.status)}
              onClick={() => handleStatusChange('voided')}
            >
              Void Match
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              disabled={isPending || match.status !== 'in_progress'}
              onClick={() => handleStatusChange('completed')}
            >
              Mark Completed
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Match Notes</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <textarea 
                 className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 min-h-[100px]"
                 placeholder="Enter observations, incidents, or technical notes..."
                 id="noteInput"
               ></textarea>
               <Button 
                 onClick={() => {
                   const content = document.getElementById('noteInput').value;
                   if(content) {
                     api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/notes`, { content })
                       .then(() => {
                         document.getElementById('noteInput').value = '';
                         alert('Note added successfully');
                       });
                   }
                 }}
               >
                 Add Note
               </Button>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Scoring Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 border border-slate-700 rounded-md p-4 text-sm text-slate-300">
              <p className="font-medium text-white mb-2">Standard Battle Royale</p>
              <ul className="space-y-1">
                <li><span className="text-slate-400">1st Place:</span> 10 pts</li>
                <li><span className="text-slate-400">2nd Place:</span> 6 pts</li>
                <li><span className="text-slate-400">3rd-4th Place:</span> 5 pts</li>
                <li><span className="text-slate-400">5th-8th Place:</span> 4 pts</li>
                <li className="pt-2 border-t border-slate-700 mt-2"><span className="text-slate-400">Per Kill:</span> 1 pt</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Render the Result Entry Form when the match is completed */}
      {match.status === 'completed' && (
        <div className="mt-8">
          <ResultEntryForm 
            match={match} 
            tournamentId={tournamentId} 
            onSuccess={() => alert('Results submitted successfully!')} 
          />
        </div>
      )}
    </div>
  );
};

export default MatchControlPanel;
