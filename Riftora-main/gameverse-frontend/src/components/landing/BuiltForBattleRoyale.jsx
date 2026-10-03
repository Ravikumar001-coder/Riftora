import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Shield, Trophy, Activity, Users, ArrowDown, ChevronRight, Swords } from 'lucide-react';

export function BuiltForBattleRoyale() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#071426] to-[#071426] pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Built for Battle Royale. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Not Adapted for It.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Most platforms are designed for 1v1 bracket tournaments. Riftora is engineered specifically for the complexity of multi-team lobbies, placement points, and eliminations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Traditional 1v1 Approach (What we aren't) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Traditional Bracket</h3>
            
            <div className="flex items-center gap-6 opacity-50 grayscale">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl w-32 text-center">
                <div className="text-white font-bold mb-1">Team A</div>
                <div className="text-xs text-slate-400">Winner</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white mb-2">VS</div>
                <div className="w-px h-12 bg-slate-700"></div>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl w-32 text-center">
                <div className="text-white font-bold mb-1">Team B</div>
                <div className="text-xs text-slate-400">Eliminated</div>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-slate-500 max-w-xs">
              Simple win/loss logic doesn't work for 16-team Battle Royale lobbies.
            </div>
          </motion.div>

          {/* Riftora's BR Approach */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-8 rounded-2xl relative shadow-[0_0_30px_rgba(37,99,235,0.1)]"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 blur-[30px] rounded-full pointer-events-none"></div>

            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-8 text-center">The Riftora Architecture</h3>
            
            <div className="flex flex-col items-center gap-3">
              
              {/* 16 Teams Input */}
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <div className="text-white font-bold">12-16 Teams</div>
              </div>
              
              <ArrowDown className="w-5 h-5 text-slate-600" />
              
              {/* Single Lobby */}
              <div className="bg-[#071426] border border-indigo-500/30 p-4 rounded-xl w-full max-w-xs text-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <div className="text-white font-bold">Single Battle Royale Lobby</div>
                </div>
              </div>

              <ArrowDown className="w-5 h-5 text-slate-600" />

              {/* Scoring Engine */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
                  <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-300">Placement Pts</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
                  <Crosshair className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-300">Elimination Pts</div>
                </div>
              </div>

              <ArrowDown className="w-5 h-5 text-slate-600" />

              {/* Outputs */}
              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-4 rounded-xl w-full max-w-sm text-center flex justify-between items-center px-6">
                <div className="flex flex-col items-center gap-1">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase font-bold text-white tracking-wider">Leaderboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <div className="flex flex-col items-center gap-1">
                  <Swords className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase font-bold text-white tracking-wider">Qualification</span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
