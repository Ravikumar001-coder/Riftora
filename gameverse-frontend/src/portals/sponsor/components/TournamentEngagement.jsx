import React from 'react';
import { Users, Crosshair, Trophy, Activity, Eye } from 'lucide-react';

export function TournamentEngagement({ engagement }) {
  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  const metrics = [
    { label: 'Registered Teams', value: engagement.registeredTeams, icon: <Users className="w-4 h-4 text-blue-400" /> },
    { label: 'Players', value: engagement.players, icon: <Crosshair className="w-4 h-4 text-green-400" /> },
    { label: 'Matches', value: engagement.matches, icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
    { label: 'Live Viewers', value: formatNumber(engagement.liveViewers), icon: <Activity className="w-4 h-4 text-red-400" /> },
    { label: 'Peak Viewers', value: formatNumber(engagement.peakViewers), icon: <Eye className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-5">Tournament Engagement</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              {m.icon}
              <span className="text-xs text-slate-400">{m.label}</span>
            </div>
            <p className="text-lg font-bold text-white pl-6">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
