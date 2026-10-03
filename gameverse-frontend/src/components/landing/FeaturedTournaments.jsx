import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { featuredTournaments } from '../../services/mockData';
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function FeaturedTournaments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredTournaments = featuredTournaments.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'BGMI' || filter === 'Free Fire' || filter === 'PUBG Mobile') return t.game === filter;
    if (filter === 'Upcoming') return t.status === 'upcoming';
    if (filter === 'Live') return t.status === 'live';
    if (filter === 'Completed') return t.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded text-xs font-bold uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">Upcoming</span>;
      case 'registration_open':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/20 rounded text-xs font-bold uppercase shadow-[0_0_10px_rgba(34,197,94,0.2)]">Registration Open</span>;
      case 'registration_closing':
        return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded text-xs font-bold uppercase shadow-[0_0_10px_rgba(249,115,22,0.2)]">Registration Closing Soon</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/20 rounded text-xs font-bold uppercase">Completed</span>;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="tournaments" className="py-24 relative z-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Tournaments</h2>
            <p className="text-slate-400 text-lg">Discover and join upcoming competitive events.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/explore" className="px-5 py-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-colors group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-800"
        >
          {['All', 'BGMI', 'Free Fire', 'PUBG Mobile', 'Upcoming', 'Live', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                filter === f 
                  ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              )}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredTournaments.map(t => (
            <motion.div 
              key={t.id} 
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0px 10px 40px rgba(255,255,255,0.05)" }}
              onClick={() => navigate(`/t/${t.id}`)}
              className="group cursor-pointer bg-[#071426] rounded-2xl border border-white/10 overflow-hidden transition-all flex flex-col"
            >
              
              {/* Banner */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={t.banner} 
                  alt={t.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                    {t.game}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-[#071426]/90 backdrop-blur border border-emerald-500/30 px-2 py-1.5 rounded shadow-lg">
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest leading-none">Presented By</span>
                  <span className="text-[10px] text-white font-black italic leading-none">{t.id === 't1' ? 'BOOYAH!' : t.id === 't2' ? 'ASUS ROG' : 'Red Bull'}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#040d1a]/50">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="text-blue-400 text-sm font-medium">{t.organization}</div>
                  {getStatusBadge(t.status)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-5 line-clamp-2 group-hover:text-blue-400 transition-colors">{t.name}</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-2 text-sm mt-auto">
                  <div>
                    <div className="text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Start Date</div>
                    <div className="text-white font-medium">{t.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1 flex items-center gap-1.5"><Users className="w-4 h-4" /> Slots</div>
                    <div className="text-white font-medium">{t.slots}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Entry Fee</div>
                    <div className="text-white font-medium">{t.entryFee}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-slate-400" /> Prize Pool</div>
                    <div className="text-green-400 font-bold">{t.prize}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
