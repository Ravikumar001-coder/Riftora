import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Trophy, Play, CheckCircle2, ChevronRight, Activity, Send } from 'lucide-react';

export function RealTimeResultPipeline() {
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    if (isPublished) {
      setIsPublished(false); // Reset for demo purposes
      return;
    }
    setIsPublished(true);
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
            Every Result. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Instantly Everywhere.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Publish a match result from the Command Center and watch it push instantly to leaderboards, public pages, and broadcast overlays. No refreshes required.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Operations */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-widest text-xs">
                <ShieldAlert className="w-4 h-4 text-blue-500" /> Tournament Operations
              </div>
            </div>

            <div className="bg-[#071426] border border-slate-800 rounded-xl p-5 mb-6">
              <h4 className="text-white font-bold mb-4">Submit Match Result</h4>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Team</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded p-2 text-white font-semibold text-sm">Hydra</div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Placement</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded p-2 text-white font-semibold text-sm">#1 (10 pts)</div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Kills</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded p-2 text-white font-semibold text-sm">8 (8 pts)</div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Points to Award</span>
                  <span className="text-emerald-400 font-bold">18 Points</span>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                className={`w-full py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-all ${
                  isPublished 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                }`}
              >
                {isPublished ? 'Result Published' : 'Publish Result'}
                {!isPublished && <Send className="w-4 h-4" />}
              </button>
            </div>

            {/* Success Checks */}
            <div className="h-24">
              {isPublished && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2"
                >
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Result Published
                  </motion.div>
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Leaderboard Updated
                  </motion.div>
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Public Website Updated
                  </motion.div>
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> OBS Updated
                  </motion.div>
                </motion.div>
              )}
            </div>

          </motion.div>

          {/* Right: Broadcast / Public View */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-2xl overflow-hidden border border-slate-700 shadow-xl"
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Live Broadcast
            </div>

            {/* The Overlay Graphic */}
            <div className="relative z-10 w-full px-8">
              {!isPublished ? (
                <div className="bg-[#0f172a]/90 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center shadow-2xl">
                  <Play className="w-8 h-8 text-blue-500 mx-auto mb-3 opacity-50" />
                  <div className="text-slate-400 font-medium">Waiting for match results...</div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-md border border-blue-400/30 rounded-xl p-8 text-center shadow-[0_0_50px_rgba(37,99,235,0.4)]"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(250,204,21,0.5)] border-2 border-white/20"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-4xl font-display font-black text-white italic tracking-wider mb-2 drop-shadow-md">WINNER WINNER</h3>
                    <div className="text-2xl font-bold text-yellow-400 mb-6 uppercase tracking-widest">Hydra Esports</div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-2 gap-4 max-w-xs mx-auto"
                  >
                    <div className="bg-black/40 rounded py-2 border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Eliminations</div>
                      <div className="text-xl font-bold text-white">8</div>
                    </div>
                    <div className="bg-black/40 rounded py-2 border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Total Points</div>
                      <div className="text-xl font-bold text-emerald-400">18</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
