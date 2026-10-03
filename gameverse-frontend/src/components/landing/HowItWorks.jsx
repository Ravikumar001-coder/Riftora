import React from 'react';
import { Settings, Users, Play, Calculator, Trophy, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      icon: <Settings className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />,
      title: "BUILD",
      description: "Create tournament structure, scoring rules and stages."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "ORGANIZE",
      description: "Verify teams, assign lobbies and manage check-ins."
    },
    {
      icon: <Play className="w-8 h-8 text-blue-400 group-hover:-translate-y-1 transition-transform duration-300" />,
      title: "LAUNCH",
      description: "Release room credentials and start matches."
    },
    {
      icon: <Calculator className="w-8 h-8 text-blue-400 group-hover:scale-y-110 transition-transform duration-300 origin-bottom" />,
      title: "SCORE",
      description: "Submit results, validate evidence and calculate points."
    },
    {
      icon: <Trophy className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "PUBLISH",
      description: "Update standings, results and public pages."
    },
    {
      icon: <Monitor className="w-8 h-8 text-blue-400 group-hover:rotate-6 transition-transform duration-300" />,
      title: "BROADCAST",
      description: "Push live competition data into overlays."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-24 relative overflow-hidden z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">How Riftora Runs a Tournament</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">From setup to stream, everything flows through one connected system.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative max-w-7xl mx-auto"
        >
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-[2px] bg-white/10 z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="w-full h-full bg-gradient-to-r from-blue-600/20 via-blue-400 to-blue-600/20 origin-left shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <motion.div 
                whileHover={{ y: -8, borderColor: "rgba(59,130,246,0.5)" }}
                className="w-24 h-24 rounded-2xl bg-[#0b1b36] border border-white/10 flex items-center justify-center mb-6 shadow-xl transition-colors relative"
              >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 blur-xl rounded-full transition-colors duration-500"></div>
                {step.icon}
              </motion.div>
              <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-[#071426] text-white font-bold flex items-center justify-center absolute top-[84px] lg:-top-[16px] lg:left-1/2 lg:-translate-x-1/2 z-20 shadow-md">
                0{index + 1}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-4 lg:mt-0">{step.title}</h3>
              <p className="text-slate-400 text-sm max-w-[180px]">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
