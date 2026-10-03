import React from 'react';
import { motion } from 'framer-motion';
import { Users, LayoutGrid, PlayCircle, ShieldAlert, CheckCircle, Clock, AlertTriangle, Monitor, Radio, ShieldCheck, Activity } from 'lucide-react';

export function CommandCenterShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Everything Your Tournament Team Needs.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            One centralized control room for every operational task during your event.
          </motion.p>
        </div>

        {/* The Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-[#071426] border border-slate-700/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Mockup Header (Browser style) */}
          <div className="h-10 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto bg-slate-800/50 rounded-md h-6 w-64 border border-slate-700/50 flex items-center justify-center text-[10px] text-slate-400">
              admin.riftora.com/command-center
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-display font-bold text-white">Tournament Command Center</h3>
                  <motion.span 
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)] uppercase tracking-wider"
                  >
                    <Activity className="w-3 h-3" /> LIVE
                  </motion.span>
                </div>
                <p className="text-slate-400 text-sm">South Asia Pro League 2026</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                <div className="px-4 py-2 border-r border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Match</div>
                  <div className="text-lg font-bold text-emerald-400">04 / 12</div>
                </div>
                <div className="px-4 py-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Referees</div>
                  <div className="text-lg font-bold text-white">2 Online</div>
                </div>
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <Users className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Teams</div>
                <div className="text-2xl font-display font-bold text-white">64</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <LayoutGrid className="w-5 h-5 text-indigo-400 mb-2" />
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active Lobbies</div>
                <div className="text-2xl font-display font-bold text-white">4</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <PlayCircle className="w-5 h-5 text-purple-400 mb-2" />
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Matches Played</div>
                <div className="text-2xl font-display font-bold text-white">3</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <ShieldAlert className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Disputes</div>
                <div className="text-2xl font-display font-bold text-white">1</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Left Column: Lobbies + Sponsors */}
              <div className="md:col-span-1 flex flex-col gap-6">
                
                {/* Lobbies */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-indigo-400" /> Lobby Status
                  </h4>
                  <div className="flex flex-col gap-3">
                    {/* Lobby A */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#071426] border border-slate-700">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">Lobby A</span>
                        <span className="text-xs text-slate-400">Erangel</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 rounded mb-1">LIVE</span>
                        <span className="font-bold text-slate-300 text-xs">16/16</span>
                      </div>
                    </div>
                    {/* Lobby B */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#071426] border border-slate-700">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">Lobby B</span>
                        <span className="text-xs text-slate-400">Miramar</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 rounded mb-1">LIVE</span>
                        <span className="font-bold text-slate-300 text-xs">16/16</span>
                      </div>
                    </div>
                    {/* Lobby C */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#071426] border border-slate-700 border-l-2 border-l-yellow-500">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">Lobby C</span>
                        <span className="text-xs text-slate-400">Sanhok</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded mb-1">WAITING</span>
                        <span className="font-bold text-yellow-500 text-xs">15/16</span>
                      </div>
                    </div>
                    {/* Lobby D */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#071426] border border-slate-700">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">Lobby D</span>
                        <span className="text-xs text-slate-400">Erangel</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded mb-1">RESULTS</span>
                        <span className="font-bold text-slate-300 text-xs">16/16</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsor Panel */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-5 h-fit">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-4 h-4 rounded border border-emerald-400 text-emerald-400 flex items-center justify-center text-[10px] font-bold">$</span> Sponsors
                  </h4>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center bg-[#071426] px-3 py-2 rounded border border-slate-700">
                      <span className="text-xs font-bold text-white">BOOYAH!</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#071426] px-3 py-2 rounded border border-slate-700">
                      <span className="text-xs font-bold text-white">ASUS</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#071426] px-3 py-2 rounded border border-slate-700">
                      <span className="text-xs font-bold text-white">Red Bull</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> ACTIVE</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-700">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Next Activation</div>
                    <div className="text-xs text-white">Sponsor Result Card</div>
                  </div>
                </div>

              </div>

              {/* Alerts & Broadcast */}
              <div className="md:col-span-2 flex flex-col gap-6">
                
                {/* Alerts */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex-1">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" /> Active Alerts
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white text-sm">Result Review Required</div>
                        <div className="text-xs text-slate-400">Lobby D match result flagged by anti-cheat automation. Referee review needed.</div>
                      </div>
                      <button className="ml-auto text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded">Review</button>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white text-sm">Missing Player</div>
                        <div className="text-xs text-slate-400">Team Hydra in Lobby C is missing 1 player. Delaying match start.</div>
                      </div>
                      <button className="ml-auto text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded">Contact</button>
                    </div>
                  </div>
                </div>

                {/* Broadcast Connectivity */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 text-sky-400" /> Broadcast Status
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#071426] border border-emerald-500/30 text-center">
                      <Monitor className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-xs font-semibold text-white">OBS</div>
                      <div className="text-[10px] text-emerald-400">Connected</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#071426] border border-emerald-500/30 text-center">
                      <LayoutGrid className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-xs font-semibold text-white">Overlays</div>
                      <div className="text-[10px] text-emerald-400">Active</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#071426] border border-emerald-500/30 text-center">
                      <Activity className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-xs font-semibold text-white">WebSocket</div>
                      <div className="text-[10px] text-emerald-400">Connected</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Pipeline Tracker */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
               <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Lobby D Result Pipeline
                </h4>
                
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-[40%] h-0.5 bg-blue-500 -translate-y-1/2"></div>
                  
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center gap-2 w-24">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-[#071426] flex items-center justify-center z-10">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-bold text-white">Submitted</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 w-24">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-[#071426] flex items-center justify-center z-10">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-bold text-white">Validated</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-24">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-6 rounded-full bg-yellow-500 border-4 border-[#071426] z-10"
                      ></motion.div>
                      <span className="text-xs font-bold text-yellow-400">Review</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-24">
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-4 border-[#071426] z-10"></div>
                      <span className="text-xs font-bold text-slate-500">Published</span>
                    </div>
                  </div>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
