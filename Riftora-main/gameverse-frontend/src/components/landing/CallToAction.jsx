import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden z-10">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#071426]/50"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold tracking-widest text-sm uppercase shadow-lg backdrop-blur-sm">
            Join The Ecosystem
          </span>
        </motion.div>

        <div className="overflow-hidden mb-6 flex justify-center">
          <motion.h2 
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl"
          >
            Ready to Run Professional Tournaments?
          </motion.h2>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-medium"
        >
          Join top organizers who use Riftora's Command Center to save time, eliminate disputes, and deliver broadcast-ready events.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/auth/register" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59,130,246,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 rounded-md bg-blue-600 text-white font-bold text-lg transition-colors border border-blue-400/50 flex items-center justify-center gap-2"
            >
              Create a Tournament <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
          <Link to="/docs" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 rounded-md bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold text-lg transition-colors shadow-xl text-center"
            >
              Read Docs
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
