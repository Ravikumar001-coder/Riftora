import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, ShieldAlert, TrendingUp } from 'lucide-react';

export function WhyRiftora() {
  const values = [
    {
      icon: Clock,
      title: "Save 10+ Hours Per Event",
      description: "Automated scoring, instant leaderboards, and self-serve check-ins eliminate manual spreadsheet data entry."
    },
    {
      icon: Video,
      title: "Professionalize Your Broadcast",
      description: "Get ESPN-quality overlays out of the box via OBS browser sources without needing a dedicated graphics department."
    },
    {
      icon: ShieldAlert,
      title: "Eliminate Dispute Chaos",
      description: "Centralized evidence submission and referee review panels stop the noise of Discord DMs."
    },
    {
      icon: TrendingUp,
      title: "Monetize Better",
      description: "Dedicated sponsor inventory in broadcast overlays and public tournament pages to increase your ROI."
    }
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
            Why Top Organizers Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Riftora</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Stop fighting your tools and start growing your community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#071426] border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 flex gap-6 group transition-colors shadow-lg"
            >
              <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                <val.icon className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{val.title}</h3>
                <p className="text-slate-400 leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
