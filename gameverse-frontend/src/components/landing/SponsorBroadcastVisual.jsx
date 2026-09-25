import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Radio, Users, LayoutDashboard, MonitorPlay, Target, Award, ArrowRight } from 'lucide-react';

export function SponsorBroadcastVisual() {
  const steps = [
    { icon: Award, label: "SPONSOR", desc: "Brand Account" },
    { icon: Target, label: "CAMPAIGN", desc: "Budget & Assets" },
    { icon: LayoutDashboard, label: "TOURNAMENT", desc: "Riftora Championship" },
    { icon: MonitorPlay, label: "PLACEMENT", desc: "Live Overlay" },
    { icon: Activity, label: "LIVE MATCH", desc: "Game State" },
    { icon: Radio, label: "OBS", desc: "WebSocket Source" },
    { icon: Users, label: "AUDIENCE", desc: "Twitch / YouTube" }
  ];

  return (
    <section className="py-24 relative overflow-hidden border-t border-slate-800/50">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Flow */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold text-white mb-6"
            >
              Direct Pipeline to the Audience
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-lg mb-12"
            >
              Riftora connects the commercial layer directly to the broadcast infrastructure. The moment a match goes live, sponsor placements are automatically rendered in the OBS overlays.
            </motion.p>

            <div className="flex flex-col relative max-w-sm">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800">
                <motion.div 
                  className="w-full bg-emerald-500 origin-top"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ height: '100%' }}
                />
              </div>

              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex items-center gap-6 mb-6 last:mb-0 relative z-10 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#040d1a] border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                    <step.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white tracking-wider">{step.label}</div>
                    <div className="text-xs text-slate-400">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Broadcast Overlay Simulation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Aspect Ratio 16:9 container for stream simulation */}
            <div className="aspect-video bg-[#040d1a] border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl relative">
              {/* Fake gameplay background */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30"></div>
              
              {/* Overlay Safe Area */}
              <div className="absolute inset-6 border border-white/10 border-dashed rounded pointer-events-none"></div>

              {/* Tournament Branding (Top Left) */}
              <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur border border-white/10 px-4 py-2 rounded flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Riftora Championship</div>
                  <div className="text-sm text-white font-bold">Match 04 • Erangel</div>
                </div>
              </div>

              {/* Mini Leaderboard (Top Right) */}
              <div className="absolute top-6 right-6 w-48 bg-slate-900/90 backdrop-blur border border-white/10 rounded overflow-hidden">
                <div className="bg-blue-600 px-3 py-1 text-[10px] font-bold text-white uppercase">Live Standings</div>
                <div className="p-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-yellow-400 font-bold">#1 HYDRA</span>
                    <span className="text-white font-bold">82 PTS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold">#2 NOVA</span>
                    <span className="text-white font-bold">78 PTS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold">#3 XSPARK</span>
                    <span className="text-white font-bold">65 PTS</span>
                  </div>
                </div>
              </div>

              {/* Animated Sponsor Placement (Bottom Right) */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute bottom-6 right-6 bg-emerald-900/80 backdrop-blur border-2 border-emerald-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-4"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-bold mb-1">Presented By</span>
                  <span className="text-xl font-black text-white italic tracking-wider">BOOYAH!</span>
                </div>
              </motion.div>

              {/* Live Badge (Bottom Left) */}
              <div className="absolute bottom-6 left-6 bg-red-600 px-3 py-1 rounded text-white text-xs font-bold tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                LIVE
              </div>

            </div>

            {/* Simulated data packet showing data model */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-8 -left-8 bg-[#0f172a] border border-slate-700 rounded-lg p-3 shadow-xl hidden md:block"
            >
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3" /> WebSocket Payload
              </div>
              <pre className="text-[10px] text-emerald-400 font-mono">
{`{
  "event": "SPONSOR_ACTIVATION",
  "data": {
    "sponsorId": "booyah_01",
    "placement": "live_overlay",
    "match": "match_04",
    "scene": "in_game"
  }
}`}
              </pre>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}

// Re-using Activity for the icon array above
function Activity(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
