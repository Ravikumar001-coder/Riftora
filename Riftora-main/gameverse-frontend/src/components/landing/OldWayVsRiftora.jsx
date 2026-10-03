import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileSpreadsheet, Monitor, ShieldCheck, Trophy, Layers, Target, Activity, Share2, Users, MessageCircle } from 'lucide-react';

export function OldWayVsRiftora() {
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
            Running a Tournament Shouldn't <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Require 6 Different Tools.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* THE OLD WAY */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <h3 className="text-xl font-bold text-slate-300 mb-8 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-slate-600"></span>
              The Old Way
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-70">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                <div>
                  <div className="font-semibold text-slate-300">Discord / WhatsApp</div>
                  <div className="text-sm text-slate-500">Registration & support</div>
                </div>
              </div>

              <div className="flex justify-center -my-2 z-10">
                <div className="h-6 w-px bg-red-500/50"></div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-70">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-semibold text-slate-300">Google Sheets</div>
                  <div className="text-sm text-slate-500">Manual tracking & lobby assignment</div>
                </div>
              </div>

              <div className="flex justify-center -my-2 z-10">
                <div className="h-6 w-px bg-red-500/50"></div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-70">
                <MessageCircle className="w-6 h-6 text-sky-400" />
                <div>
                  <div className="font-semibold text-slate-300">Chat Groups</div>
                  <div className="text-sm text-slate-500">Sharing room credentials</div>
                </div>
              </div>

              <div className="flex justify-center -my-2 z-10">
                <div className="h-6 w-px bg-red-500/50"></div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-70">
                <Layers className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="font-semibold text-slate-300">Screenshots</div>
                  <div className="text-sm text-slate-500">Manual result calculation</div>
                </div>
              </div>

              <div className="flex justify-center -my-2 z-10">
                <div className="h-6 w-px bg-red-500/50"></div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-70">
                <Monitor className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="font-semibold text-slate-300">OBS Plugins</div>
                  <div className="text-sm text-slate-500">Updating broadcast graphics manually</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* THE RIFTORA WAY */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[#071426] to-[#040d1a] border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.15)] rounded-2xl p-8 relative overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-blue-500"></span>
              The Riftora Way
            </h3>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500"></div>

              <div className="flex flex-col gap-6 relative">
                {[
                  { icon: Target, label: "Registration & Verification", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                  { icon: Users, label: "Lobby Generation & Credentials", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
                  { icon: Activity, label: "Match Monitoring", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                  { icon: ShieldCheck, label: "Result Validation Engine", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { icon: Trophy, label: "Real-time Leaderboard", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                  { icon: Share2, label: "Broadcast Overlays", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-5 p-4 rounded-xl border bg-white/5 backdrop-blur-sm ${step.bg}`}
                  >
                    <div className="relative z-10 w-14 h-14 rounded-full bg-[#071426] border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="font-semibold text-white text-lg">{step.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
