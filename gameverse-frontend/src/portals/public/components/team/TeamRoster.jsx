import React from 'react';
import { PlayerCard } from './PlayerCard';
import { motion } from 'framer-motion';

export function TeamRoster({ roster, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="gameverse-card p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 mb-4" />
            <div className="w-24 h-4 rounded bg-white/10 mb-2" />
            <div className="w-20 h-3 rounded bg-white/5 mb-4" />
            <div className="w-full h-8 rounded-full bg-white/5 mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (!roster || roster.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">No Public Roster</h3>
        <p className="text-slate-400">No public roster information is available for this team.</p>
      </motion.div>
    );
  }

  // Sort so Captain is first
  const sortedRoster = [...roster].sort((a, b) => {
    if (a.teamRole === 'Captain') return -1;
    if (b.teamRole === 'Captain') return 1;
    return 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      {sortedRoster.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </motion.div>
  );
}
