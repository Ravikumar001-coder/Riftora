import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Organizations() {
  const navigate = useNavigate();
  
  const orgs = [
    { id: 'org1', name: 'Riftora Official', verified: true, tournaments: 45, active: 3, logo: 'GV' },
    { id: 'org2', name: 'Esports Arena', verified: true, tournaments: 12, active: 1, logo: 'EA' },
    { id: 'org3', name: 'Next Level Gaming', verified: false, tournaments: 8, active: 0, logo: 'NLG' },
    { id: 'org4', name: 'Pro Series India', verified: true, tournaments: 24, active: 2, logo: 'PSI' },
  ];

  // Duplicate for infinite scroll
  const duplicatedOrgs = [...orgs, ...orgs, ...orgs];

  return (
    <section id="organizations" className="py-16 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Built for Organizations</h2>
            <p className="text-slate-400">Discover premium esports organizers.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/explore?tab=organizations" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 lg:-mx-8 px-4 lg:px-8 overflow-hidden mask-edges">
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#040d1a] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#040d1a] to-transparent z-10 pointer-events-none"></div>

          <motion.div 
            className="flex gap-6 w-max"
            animate={{
              x: ["0%", "-33.333333%"]
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {duplicatedOrgs.map((org, index) => (
              <div 
                key={`${org.id}-${index}`} 
                onClick={() => navigate(`/organizations/${org.id}`)}
                className="bg-[#0b1b36] border border-white/10 rounded-xl p-6 w-[280px] sm:w-[320px] flex-shrink-0 cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {org.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white leading-tight truncate max-w-[150px]">{org.name}</h3>
                      {org.verified && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {org.active > 0 ? <span className="text-green-400">{org.active} Active</span> : 'No active events'}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total Hosted</span>
                  <span className="text-white font-medium">{org.tournaments}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
