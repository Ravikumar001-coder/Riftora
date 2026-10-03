import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useSelfCheckIn, useCheckInStats } from '@/features/check-in/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useAuthStore from '@/features/auth/store'; // Hypothetical path to get JWT token

const MatchDayDashboard = () => {
  const { tournamentId, matchId } = useParams();
  const [liveStatus, setLiveStatus] = useState(null);
  const token = useAuthStore(state => state.token);

  // Fetch initial match info
  const { data: match } = useQuery({
    queryKey: ['matches', matchId],
    queryFn: async () => {
      const response = await api.get(`/player/tournaments/${tournamentId}/matches/${matchId}`);
      return response.data.data;
    },
    enabled: !!matchId
  });

  // Fetch Check-in Stats
  const { data: checkInStats } = useCheckInStats(tournamentId);
  const { mutate: checkIn, isPending: checkInPending } = useSelfCheckIn();

  useEffect(() => {
    if (!matchId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      client.subscribe(`/topic/match.${matchId}.status`, function (message) {
        if (message.body) {
          const payload = JSON.parse(message.body);
          setLiveStatus(payload.status);
        }
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [matchId, token]);

  const currentStatus = liveStatus || match?.status || 'scheduled';

  const handleCheckIn = () => {
    // We would need the registrationId of the logged in user's team.
    // For demo purposes:
    checkIn({ tournamentId, registrationId: 'mock-reg-id' });
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
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Match Day Dashboard</h1>
          <p className="text-slate-400 mt-1">Live match status and operations for your team.</p>
        </div>
        <Badge className={`text-sm py-1 px-3 border ${getStatusColor(currentStatus)}`}>
          {currentStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Check-In Status
              {checkInStats?.checkInWindowOpen && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full animate-pulse">
                  WINDOW OPEN
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">
              {checkInStats?.checkInWindowOpen 
                ? "The check-in window is currently open. Please check-in to confirm your attendance."
                : "The check-in window is currently closed."}
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={!checkInStats?.checkInWindowOpen || checkInPending}
              onClick={handleCheckIn}
            >
              {checkInPending ? 'Checking In...' : 'Check In Now'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lobby Details</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStatus === 'lobby_open' ? (
              <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Room ID</p>
                  <div className="bg-black/40 p-2 rounded text-white font-mono flex justify-between items-center border border-slate-700">
                    <span>MATCH-RM-9942</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-400 hover:text-blue-300">Copy</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Password</p>
                  <div className="bg-black/40 p-2 rounded text-white font-mono flex justify-between items-center border border-slate-700">
                    <span>GVS-2026-X9</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-400 hover:text-blue-300">Copy</Button>
                  </div>
                </div>
                <p className="text-xs text-amber-400 mt-2">
                  Do not share these credentials with anyone outside your team.
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-8 text-center">
                <p className="text-slate-500">
                  Credentials will appear here when the referee opens the lobby.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchDayDashboard;
