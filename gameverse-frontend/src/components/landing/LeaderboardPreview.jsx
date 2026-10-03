import React from 'react';
import { leaderboardData } from '../../services/mockData';
import { Trophy, Swords, Crosshair, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LeaderboardPreview() {
  
  const getRankChange = (current, prev) => {
    if (!prev) return <Minus className="w-4 h-4 text-slate-500" />;
    if (current < prev) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (current > prev) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Real-Time Leaderboards</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience instant score processing. As matches conclude, points and standings update dynamically across all connected clients and broadcast overlays.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b1b36] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Live Indicator Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_auto] animate-gradient"></div>

            <div className="p-6 md:p-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-red-500 text-sm font-bold tracking-wider uppercase">Live Update</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Current Standings</h3>
                </div>
                <div className="hidden sm:flex gap-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs uppercase mb-1">Matches</div>
                    <div className="text-white font-medium">3 / 6</div>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 rounded-t-lg border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5 md:col-span-6">Team</div>
                <div className="col-span-2 hidden md:flex items-center justify-center gap-1"><Trophy className="w-3.5 h-3.5" /> WWCD</div>
                <div className="col-span-3 md:col-span-1 text-center flex items-center justify-center gap-1"><Crosshair className="w-3.5 h-3.5" /> Kills</div>
                <div className="col-span-3 md:col-span-2 text-right text-blue-400 flex items-center justify-end gap-1"><Swords className="w-3.5 h-3.5" /> Total</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {leaderboardData.map((team, index) => (
                  <div 
                    key={team.team} 
                    className={cn(
                      "grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/5 items-center transition-colors hover:bg-white/[0.02]",
                      index === 0 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : "",
                      index === leaderboardData.length - 1 ? "border-b-0" : ""
                    )}
                  >
                    <div className="col-span-1 flex items-center justify-center gap-2">
                      <span className={cn(
                        "font-bold",
                        index === 0 ? "text-yellow-500" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-slate-500"
                      )}>
                        {team.rank}
                      </span>
                      {getRankChange(team.rank, team.prevRank)}
                    </div>
                    
                    <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                        {team.team.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-bold text-white truncate">{team.team}</span>
                    </div>

                    <div className="col-span-2 hidden md:flex justify-center">
                      <span className="text-slate-300 font-medium">{team.dinners}</span>
                    </div>

                    <div className="col-span-3 md:col-span-1 text-center">
                      <span className="text-slate-300 font-medium">{team.kills}</span>
                    </div>

                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className="text-lg font-bold text-blue-400">{team.points}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
