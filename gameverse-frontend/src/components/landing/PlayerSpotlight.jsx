import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Medal, Target, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlayerSpotlight() {
  const navigate = useNavigate();

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        <motion.div 
          initial={{ filter: "blur(10px)", opacity: 0, scale: 0.95 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-900/40 to-[#0b1b36] border border-blue-500/20 rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.1)]"
        >
          
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-transparent to-[#0b1b36]"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            
            {/* Avatar */}
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-[#071426] outline outline-2 outline-blue-500 overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.3)] bg-slate-800 transition-all"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=1e293b" alt="Player Avatar" className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-[#071426] shadow-lg">
                PRO
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-blue-400 font-medium tracking-widest text-sm uppercase mb-2">Player Spotlight</div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-1">ScoutOP</h3>
              <p className="text-slate-400 mb-6">Tanmay Singh • Storm Squad</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <motion.div whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)" }} className="bg-white/5 rounded-lg px-4 py-2 border border-white/5 flex items-center gap-3 transition-colors">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  <div className="text-left">
                    <div className="text-xs text-slate-500 uppercase">Wins</div>
                    <div className="font-bold text-white">42</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)" }} className="bg-white/5 rounded-lg px-4 py-2 border border-white/5 flex items-center gap-3 transition-colors">
                  <Target className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <div className="text-xs text-slate-500 uppercase">Tournaments</div>
                    <div className="font-bold text-white">156</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)" }} className="bg-white/5 rounded-lg px-4 py-2 border border-white/5 flex items-center gap-3 transition-colors">
                  <Crosshair className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <div className="text-xs text-slate-500 uppercase">Total Kills</div>
                    <div className="font-bold text-white">1,842</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-6 md:mt-0">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile/scoutop')}
                className="px-6 py-3 rounded-full bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                View Profile
              </motion.button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
