import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Trophy, 
  MonitorPlay, 
  FileCheck, 
  Star, 
  Flag, 
  Award 
} from 'lucide-react';

export function OneSponsorEveryTouchpoint() {
  const touchpoints = [
    { id: 'page', icon: Globe, label: 'Tournament Page' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'overlay', icon: MonitorPlay, label: 'Match Overlay' },
    { id: 'result', icon: FileCheck, label: 'Result Card' },
    { id: 'top10', icon: Star, label: 'Top 10' },
    { id: 'finale', icon: Flag, label: 'Finale' },
    { id: 'winner', icon: Award, label: 'Winner Announcement' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            One Sponsor. Every Touchpoint.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Activate sponsor branding across the tournament experience without manually updating every graphic. Upload once, deploy everywhere.
          </motion.p>
        </div>

        {/* Node Visualization */}
        <div className="relative max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Central Sponsor Node */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative z-20 mb-16 md:mb-24"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#040d1a] rounded-xl flex flex-col items-center justify-center">
                <Building2 className="w-8 h-8 text-emerald-400 mb-1" />
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Brand</span>
              </div>
            </div>
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-2xl border border-emerald-500/50 animate-ping" style={{ animationDuration: '3s' }}></div>
          </motion.div>

          {/* Touchpoints Row */}
          <div className="w-full relative z-10 flex flex-wrap justify-center gap-4 md:gap-8">
            
            {/* Connecting lines SVG - Only visible on md+ screens */}
            <svg className="absolute top-[-80px] left-0 w-full h-[100px] hidden md:block pointer-events-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {touchpoints.map((_, idx) => {
                const total = touchpoints.length;
                const percent = (idx + 0.5) / total;
                const startX = "50%";
                const startY = "0";
                const endX = `${percent * 100}%`;
                const endY = "100";
                return (
                  <motion.path
                    key={idx}
                    d={`M ${startX} ${startY} Q ${startX} ${endY/2} ${endX} ${endY}`}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                );
              })}
            </svg>

            {touchpoints.map((tp, idx) => (
              <motion.div 
                key={tp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + (idx * 0.1) }}
                className="flex flex-col items-center bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 w-32 md:w-36 text-center hover:bg-slate-800 transition-colors shadow-lg relative group"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <tp.icon className="w-8 h-8 text-slate-400 mb-3 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{tp.label}</span>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
