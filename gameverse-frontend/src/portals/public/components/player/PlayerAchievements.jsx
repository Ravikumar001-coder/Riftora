import React from 'react';
import { motion } from 'framer-motion';

export function PlayerAchievements({ achievements, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="gameverse-card p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
            <div className="flex-1">
              <div className="w-32 h-5 rounded bg-white/10 mb-2" />
              <div className="w-full h-4 rounded bg-white/5 mb-2" />
              <div className="w-24 h-3 rounded bg-white/5 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">No Achievements</h3>
        <p className="text-slate-400">This player hasn't unlocked any public achievements yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {achievements.map((achievement) => (
        <div key={achievement.id} className="gameverse-card p-6 flex items-start gap-4 hover:border-yellow-500/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-2xl">
            {achievement.icon}
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">{achievement.description}</p>
            {achievement.date && (
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                {new Date(achievement.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
