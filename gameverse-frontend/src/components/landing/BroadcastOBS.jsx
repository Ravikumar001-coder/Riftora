import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Layers, ListOrdered, Trophy, Sparkles, Star, Award } from 'lucide-react';

export function BroadcastOBS() {
  const overlayTypes = [
    { icon: ListOrdered, label: "Live Leaderboard", desc: "Top 16 real-time standings" },
    { icon: Layers, label: "Match Bar", desc: "Current match status & timer" },
    { icon: Trophy, label: "Result Splash", desc: "Winner animations" },
    { icon: Star, label: "Top 10", desc: "Kill leaders and MVPs" },
    { icon: Award, label: "Sponsor", desc: "Brand placements & logos" },
    { icon: Sparkles, label: "Finale", desc: "Tournament winner ceremony" }
  ];

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
            From Tournament Data to Broadcast — <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Automatically.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Riftora provides a suite of transparent web overlays out of the box. Add a single Browser Source URL into OBS, and your broadcast will react instantly to tournament events.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl bg-[#040d1a] border border-slate-700/60 p-4 md:p-8 mb-12 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
          >
            {/* Simulated OBS UI */}
            <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-[#1a1a24]">
              {/* OBS Top Bar */}
              <div className="h-8 bg-[#2c2c3a] border-b border-slate-800 flex items-center px-4 gap-4 text-[10px] font-medium text-slate-300">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Profile</span>
                <span>Scene Collection</span>
                <span>Tools</span>
                <span>Help</span>
                <div className="ml-auto text-slate-500">OBS Studio - 64-bit</div>
              </div>

              <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Preview Area */}
                <div className="lg:col-span-3 aspect-video bg-black rounded border border-slate-800 relative overflow-hidden group">
                  {/* Fake Game Footage Background */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                  
                  {/* The Riftora Overlay (Leaderboard) */}
                  <div className="absolute top-8 right-8 w-64 bg-[#071426]/90 backdrop-blur border border-blue-500/30 rounded-lg p-4 shadow-2xl transition-transform group-hover:scale-105">
                    <div className="text-center font-bold text-white mb-3 text-sm uppercase tracking-wider border-b border-slate-700 pb-2">
                      Match 4 Standings
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { r: 1, n: "Hydra", p: 78, bg: "bg-white/10" },
                        { r: 2, n: "Storm", p: 72, bg: "bg-transparent" },
                        { r: 3, n: "Phoenix", p: 68, bg: "bg-transparent" },
                        { r: 4, n: "Titans", p: 61, bg: "bg-transparent" },
                      ].map((t) => (
                        <div key={t.r} className={`flex items-center justify-between ${t.bg} px-2 py-1 rounded text-xs`}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-yellow-400">#{t.r}</span>
                            <span className="font-semibold text-white">{t.n}</span>
                          </div>
                          <span className="text-blue-300 font-bold">{t.p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Bar Overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#071426]/90 backdrop-blur border-b border-l border-r border-slate-700 px-6 py-2 rounded-b-xl flex items-center gap-6">
                    <div className="text-xs font-bold text-slate-300 uppercase">Match 4</div>
                    <div className="w-px h-4 bg-slate-700"></div>
                    <div className="text-xs font-bold text-red-400 animate-pulse">ALIVE: 48</div>
                  </div>
                </div>

                {/* OBS Side Panel */}
                <div className="flex flex-col gap-4">
                  {/* Producer Interface */}
                  <div className="bg-[#242430] border border-slate-800 rounded p-3 flex flex-col h-full">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase mb-4 flex items-center justify-between">
                      <span>Riftora Producer Control</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3 flex-1 text-xs">
                      <div className="bg-[#1a1a24] p-2 rounded border border-slate-700/50">
                        <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Current Scene</div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          <Trophy className="w-3 h-3 text-purple-400" /> Match Results
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a24] p-2 rounded border border-slate-700/50">
                        <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Active Sponsor</div>
                        <div className="text-white font-semibold text-lg italic tracking-wider">BOOYAH!</div>
                      </div>

                      <div className="bg-[#1a1a24] p-2 rounded border border-slate-700/50 flex justify-between items-center">
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Placement</div>
                          <div className="text-white">Bottom Right</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Status</div>
                          <div className="text-emerald-400 font-bold">ACTIVE</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded transition-colors">Preview</button>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-colors">Activate</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {overlayTypes.map((type, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
                  <type.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{type.label}</h4>
                <p className="text-[10px] text-slate-400 uppercase">{type.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
