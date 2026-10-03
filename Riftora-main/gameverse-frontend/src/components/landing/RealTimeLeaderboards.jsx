import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronUp, ChevronDown, Minus, Play } from 'lucide-react';

export function RealTimeLeaderboards() {
  const initialTeams = [
    { id: 1, name: "Storm Squad", pts: 95, kills: 45, matches: 6, wwcd: 2, rank: 1, trend: "same" },
    { id: 2, name: "Hydra Esports", pts: 88, kills: 38, matches: 6, wwcd: 1, rank: 2, trend: "same" },
    { id: 3, name: "Phoenix Rising", pts: 82, kills: 40, matches: 6, wwcd: 1, rank: 3, trend: "same" },
    { id: 4, name: "Titans", pts: 75, kills: 30, matches: 6, wwcd: 0, rank: 4, trend: "same" },
    { id: 5, name: "Neon Ninjas", pts: 68, kills: 28, matches: 6, wwcd: 0, rank: 5, trend: "same" },
  ];

  const updatedTeams = [
    { id: 4, name: "Titans", pts: 96, kills: 42, matches: 7, wwcd: 1, rank: 1, trend: "up" }, // Won the match (+21 pts)
    { id: 1, name: "Storm Squad", pts: 95, kills: 45, matches: 7, wwcd: 2, rank: 2, trend: "down" },
    { id: 2, name: "Hydra Esports", pts: 88, kills: 38, matches: 7, wwcd: 1, rank: 3, trend: "down" },
    { id: 3, name: "Phoenix Rising", pts: 84, kills: 41, matches: 7, wwcd: 1, rank: 4, trend: "down" },
    { id: 5, name: "Neon Ninjas", pts: 68, kills: 28, matches: 7, wwcd: 0, rank: 5, trend: "same" },
  ];

  const [teams, setTeams] = useState(initialTeams);
  const [isPlaying, setIsPlaying] = useState(false);

  const simulateUpdate = () => {
    if (isPlaying) {
      setTeams(initialTeams);
      setIsPlaying(false);
    } else {
      setTeams(updatedTeams);
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Dynamic Standings.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            The moment a result is published, leaderboards update across all views automatically with smooth transitions.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          <div className="flex justify-end mb-4">
            <button 
              onClick={simulateUpdate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <Play className="w-4 h-4 fill-current" /> {isPlaying ? 'Reset Demo' : 'Simulate Match Result'}
            </button>
          </div>

          <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-[#1e293b] p-4 flex items-center gap-3 border-b border-slate-700">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-white font-bold">Overall Standings</h3>
                <div className="text-xs text-slate-400">South Asia Pro League</div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0f172a] text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Team</div>
              <div className="col-span-2 text-center">Matches</div>
              <div className="col-span-2 text-center">WWCD</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* Table Body (Animated) */}
            <div className="p-2 flex flex-col gap-1 relative h-[300px]">
              <AnimatePresence>
                {teams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      mass: 1
                    }}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg items-center absolute w-[calc(100%-1rem)] ${
                      team.id === 4 && isPlaying ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-[#1e293b]/50 hover:bg-[#1e293b]'
                    }`}
                    style={{ top: `${i * 56 + 8}px` }}
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      <span className="font-bold text-slate-300 w-4">{team.rank}</span>
                      {team.trend === "up" && <ChevronUp className="w-4 h-4 text-emerald-500" />}
                      {team.trend === "down" && <ChevronDown className="w-4 h-4 text-red-500" />}
                      {team.trend === "same" && <Minus className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="col-span-5 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] text-white">
                        {team.name.charAt(0)}
                      </div>
                      {team.name}
                    </div>
                    <div className="col-span-2 text-center text-slate-400">{team.matches}</div>
                    <div className="col-span-2 text-center text-yellow-400">{team.wwcd}</div>
                    <div className="col-span-2 text-right">
                      <motion.span 
                        key={team.pts}
                        initial={{ opacity: 0, scale: 1.5, color: '#34d399' }}
                        animate={{ opacity: 1, scale: 1, color: '#60a5fa' }}
                        transition={{ duration: 0.5 }}
                        className="font-black text-blue-400 text-lg"
                      >
                        {team.pts}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
