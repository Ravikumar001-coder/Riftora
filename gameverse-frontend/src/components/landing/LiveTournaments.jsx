import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { liveTournaments } from '../../services/mockData';
import { Play, Users, Trophy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function LiveTournaments() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData(liveTournaments);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="live" className="py-24 relative z-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Now
            </h2>
            <p className="text-slate-400 text-lg">Watch tournaments happening right now.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/explore" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors">
              View All Live <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-[400px]"></div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
              <Play className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No tournaments are live right now</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Explore upcoming competitions and come back when the action begins.
            </p>
            <Link to="/explore" className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
              Explore Tournaments
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {data.map(t => (
              <motion.div 
                key={t.id} 
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0px 10px 40px rgba(37,99,235,0.2)" }}
                className="group bg-[#0b1b36] rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300"
              >
                
                {/* Banner & Badge */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b36] to-transparent z-10"></div>
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={t.banner} 
                    alt={t.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded bg-red-600/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      LIVE
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                      {t.game}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#071426]/50">
                  <div className="text-blue-400 text-sm font-medium mb-1">{t.organization}</div>
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{t.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm">
                    <div>
                      <div className="text-slate-500 mb-1">Status</div>
                      <div className="text-white font-medium">{t.round} • {t.match}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Viewers</div>
                      <div className="text-white font-medium flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" /> {t.viewers}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Teams / Lobbies</div>
                      <div className="text-white font-medium">16 / 1</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Prize Pool</div>
                      <div className="text-green-400 font-bold flex items-center gap-1.5">
                        <Trophy className="w-4 h-4" /> {t.prize}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link to={`/t/${t.id}/watch`}>
                      <motion.div 
                        whileHover={{ backgroundColor: "#2563EB" }}
                        className="w-full py-2.5 rounded bg-blue-600 text-white text-center font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> Watch
                      </motion.div>
                    </Link>
                    <Link to={`/t/${t.id}`}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        className="w-full py-2.5 rounded bg-white/5 border border-white/10 text-white text-center font-medium transition-colors"
                      >
                        Details
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
