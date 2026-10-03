import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Save, Lock, Camera } from 'lucide-react';

export function LeaderboardManagementPanel({ tournament }) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState(tournament.leaderboardConfig || {
    showKills: true,
    showChickenDinners: true,
    showMatchesPlayed: true,
    showDamage: false,
    topNDisplayMode: 0
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig) => {
      const response = await api.put(`/v1/tournaments/${tournament.tournamentId}/leaderboard/config`, newConfig);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournament.slug] });
      alert('Leaderboard configuration updated.');
    }
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/v1/tournaments/${tournament.tournamentId}/leaderboard/lock`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournament.slug] });
      alert('Leaderboard locked and marked as official.');
    }
  });

  const snapshotMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/v1/tournaments/${tournament.tournamentId}/leaderboard/snapshots`);
      return response.data.data;
    },
    onSuccess: () => {
      alert('Snapshot created successfully.');
    }
  });

  const handleSaveConfig = () => {
    updateConfigMutation.mutate(config);
  };

  const handleLock = () => {
    if (window.confirm("Are you sure you want to lock the leaderboard? This action will mark it as Official and cannot be easily undone.")) {
      lockMutation.mutate();
    }
  };

  const handleSnapshot = () => {
    snapshotMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Leaderboard Display Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700">
              <span className="text-slate-300">Show Elims/Kills Column</span>
              <Switch 
                checked={config.showKills}
                onCheckedChange={(c) => setConfig({ ...config, showKills: c })}
              />
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700">
              <span className="text-slate-300">Show WWCD Column</span>
              <Switch 
                checked={config.showChickenDinners}
                onCheckedChange={(c) => setConfig({ ...config, showChickenDinners: c })}
              />
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700">
              <span className="text-slate-300">Show Matches Played Column</span>
              <Switch 
                checked={config.showMatchesPlayed}
                onCheckedChange={(c) => setConfig({ ...config, showMatchesPlayed: c })}
              />
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700">
              <span className="text-slate-300">Show Damage Column</span>
              <Switch 
                checked={config.showDamage}
                onCheckedChange={(c) => setConfig({ ...config, showDamage: c })}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 p-3 rounded border border-slate-700 mt-4">
            <div className="flex-1">
              <span className="text-slate-300 block mb-1">Top-N Display Mode</span>
              <p className="text-xs text-slate-500">Show only the top N teams (0 to show all)</p>
            </div>
            <Input 
              type="number" 
              className="w-24 bg-slate-800 border-slate-600 text-white" 
              value={config.topNDisplayMode}
              onChange={(e) => setConfig({ ...config, topNDisplayMode: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Button 
            onClick={handleSaveConfig} 
            disabled={updateConfigMutation.isPending}
            className="w-full mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Leaderboard Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleSnapshot}
              disabled={snapshotMutation.isPending}
              variant="outline" 
              className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Take Snapshot
            </Button>
            
            <Button 
              onClick={handleLock}
              disabled={lockMutation.isPending || tournament.isLeaderboardLocked}
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> 
              {tournament.isLeaderboardLocked ? 'Leaderboard is Locked' : 'Lock Leaderboard (Final)'}
            </Button>
          </div>
          
          {tournament.isLeaderboardLocked && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 flex items-start gap-3 mt-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-500 font-bold text-sm">Official Final Standings</p>
                <p className="text-yellow-500/80 text-xs mt-1">
                  The leaderboard is locked. Any further score changes will not automatically affect the public standings unless unlocked (requires super admin).
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
