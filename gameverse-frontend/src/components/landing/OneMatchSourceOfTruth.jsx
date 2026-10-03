import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Users, Key, UserCheck, PlayCircle, UploadCloud, ShieldCheck, Calculator, Trophy, Globe, Monitor, ArrowRight } from 'lucide-react';

export function OneMatchSourceOfTruth() {
  const steps = [
    { icon: PlusCircle, label: "MATCH CREATED" },
    { icon: Users, label: "LOBBY ASSIGNED" },
    { icon: Key, label: "CREDENTIALS RELEASED" },
    { icon: UserCheck, label: "TEAMS JOIN" },
    { icon: PlayCircle, label: "MATCH LIVE", highlight: true },
    { icon: UploadCloud, label: "RESULT SUBMITTED" },
    { icon: ShieldCheck, label: "RESULT VERIFIED" },
    { icon: Calculator, label: "SCORING ENGINE" },
    { icon: Trophy, label: "LEADERBOARD", highlight: true },
    { icon: Globe, label: "PUBLIC WEBSITE" },
    { icon: Monitor, label: "OBS", highlight: true }
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
            One Match. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">One Source of Truth.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Every action updates the centralized tournament state. No more copying data between chat apps, spreadsheets, and broadcast tools.
          </motion.p>
        </div>

        {/* The Pipeline container */}
        <div className="max-w-6xl mx-auto relative px-4">
          
          {/* Scrollable container for mobile to avoid horizontal overflow */}
          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex items-center min-w-max px-4">
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-3 w-28 shrink-0"
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center relative shadow-lg ${
                      step.highlight 
                        ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                        : 'bg-[#071426] border-slate-700'
                    }`}>
                      <step.icon className={`w-5 h-5 ${step.highlight ? 'text-white' : 'text-slate-400'}`} />
                      
                      {/* Pulse effect for highlights */}
                      {step.highlight && (
                        <div className="absolute inset-0 rounded-xl border border-blue-400 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center h-8 flex items-center">
                      {step.label}
                    </div>
                  </motion.div>
                  
                  {/* Connector arrow */}
                  {idx < steps.length - 1 && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      whileInView={{ opacity: 1, width: 32 }}
                      transition={{ delay: idx * 0.1 + 0.1 }}
                      viewport={{ once: true }}
                      className="shrink-0 w-8 flex items-center justify-center text-slate-700"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Connecting Line behind (Desktop mostly) */}
          <div className="absolute top-[24px] left-[68px] right-[68px] h-0.5 bg-gradient-to-r from-slate-800 via-blue-500/50 to-slate-800 -z-10 hidden md:block"></div>
        </div>

      </div>
    </section>
  );
}
