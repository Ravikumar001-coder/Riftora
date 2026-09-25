import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Users, MonitorPlay, CheckCircle2, Briefcase } from 'lucide-react';

export function PlatformRoles() {
  return (
    <section id="organizers" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            A Platform for Every Role
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Different permissions, different views, one unified tournament state.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* ORGANIZERS (Primary) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(37,99,235,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">For Organizers</h3>
                </div>
                <p className="text-slate-300 text-lg mb-6">
                  Total operational control from start to finish. The Command Center gives tournament directors everything they need to run smooth, professional events.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Command Center', 'Tournament setup', 'Match operations', 'Scoring logic', 'Disputes management', 'Analytics & Reports'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden md:block w-1/3 bg-[#071426] border border-blue-500/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white">COMMAND CENTER</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-white/5 rounded w-full"></div>
                  <div className="h-16 bg-white/5 rounded w-full"></div>
                  <div className="h-10 bg-blue-600/20 border border-blue-500/30 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* REFEREES */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-8 hover:bg-[#111a2f] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">For Referees</h3>
            <p className="text-slate-400 mb-6 min-h-[48px]">Tools to enforce fair play, validate results, and manage assigned matches.</p>
            <ul className="space-y-3">
              {['Assigned matches', 'Result submission', 'Evidence verification', 'Score validation'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PLAYERS & TEAMS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-8 hover:bg-[#111a2f] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">For Players & Teams</h3>
            <p className="text-slate-400 mb-6 min-h-[48px]">A dedicated dashboard for team captains to manage rosters and compete.</p>
            <ul className="space-y-3">
              {['Roster management', 'Tournament Check-in', 'Lobby credentials', 'Performance history'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* BROADCAST PRODUCERS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-8 hover:bg-[#111a2f] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
              <MonitorPlay className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">For Broadcasters</h3>
            <p className="text-slate-400 mb-6 min-h-[48px]">Direct data feeds and overlays that react instantly to the tournament state.</p>
            <ul className="space-y-3">
              {['OBS Integration', 'Transparent overlays', 'Live leaderboards', 'Match graphics control'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SPONSORS & PARTNERS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-8 hover:bg-[#111a2f] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">For Sponsors</h3>
            <p className="text-slate-400 mb-6 min-h-[48px]">Brand placements and tournament activations connected directly to the broadcast.</p>
            <ul className="space-y-3">
              {['Brand placements', 'Tournament activations', 'Broadcast visibility', 'Exposure tracking'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
