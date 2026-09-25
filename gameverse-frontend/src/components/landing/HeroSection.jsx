import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, animate } from 'framer-motion';
import { Copy, Terminal, Zap, CheckCircle2, ChevronRight, Activity, Database, Crosshair, Users, Trophy, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Rolling Counter Component
function RollingCounter({ value, duration = 2, delay = 0, isDecimal = false, suffix = '' }) {
  const nodeRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(0, value, {
        duration,
        delay,
        ease: "easeOut",
        onUpdate: (v) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = isDecimal 
              ? v.toFixed(1) + suffix
              : Math.round(v).toLocaleString() + suffix;
          }
        }
      });
      return controls.stop;
    }
  }, [value, inView, duration, delay, isDecimal, suffix]);

  return <span ref={nodeRef}>0{suffix}</span>;
}

// Tab 3: OBS Component
function OBSTab() {
  const initialTeams = [
    { id: 1, name: 'Hydra Esports', pts: 18, kills: 12 },
    { id: 2, name: 'Team Soul', pts: 15, kills: 9 },
    { id: 3, name: 'GodLike', pts: 12, kills: 8 },
    { id: 4, name: 'Blind Esports', pts: 10, kills: 5 },
  ];
  
  const [teams, setTeams] = useState(initialTeams);
  
  const simulateMatchEnd = () => {
    const newTeams = [...teams].map(t => ({
      ...t, 
      pts: t.pts + Math.floor(Math.random() * 15),
      kills: t.kills + Math.floor(Math.random() * 5)
    })).sort((a, b) => b.pts - a.pts);
    setTeams(newTeams);
  };

  return (
    <div className="h-64 flex flex-col relative pt-2">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[11px] font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          Live Standings
        </div>
        <button 
          onClick={simulateMatchEnd} 
          className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold hover:bg-indigo-500/30 transition-colors flex items-center gap-1.5 uppercase tracking-wide cursor-pointer"
        >
          <Zap className="w-3 h-3" /> Simulate Match End
        </button>
      </div>
      <div className="flex-1 bg-transparent rounded-lg border border-slate-700/50 overflow-hidden flex flex-col relative shadow-inner">
        <div className="absolute inset-0 bg-[#071426]/60 backdrop-blur-md z-0"></div>
        
        <table className="w-full text-xs text-left relative z-10 border-collapse">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/50">
            <tr>
              <th className="p-2.5 font-bold">#</th>
              <th className="p-2.5 font-bold">Team</th>
              <th className="p-2.5 text-right font-bold">Kills</th>
              <th className="p-2.5 text-right font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {teams.map((t, idx) => (
                <motion.tr 
                  key={t.id}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="border-b border-slate-800/30 bg-slate-900/40 text-slate-200"
                >
                  <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="p-2.5 font-bold tracking-wide">{t.name}</td>
                  <td className="p-2.5 text-right text-slate-400 font-mono">{t.kills}</td>
                  <td className="p-2.5 text-right font-bold text-indigo-400 font-mono text-sm">{t.pts}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function HeroSection() {
  const containerRef = useRef(null);
  
  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 30, stiffness: 200 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Check if mouse is near the right pane to apply tilt
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [activeTab, setActiveTab] = useState('ocr');

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-center perspective-1000 bg-[#0A0D14]"
    >
      {/* Subtle Dark Grid Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E")`,
            maskImage: 'radial-gradient(ellipse at top, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top, black 10%, transparent 70%)'
          }}
        />
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* Live System Metrics Ticker */}
      <div className="absolute top-0 left-0 w-full h-8 border-b border-slate-800/50 backdrop-blur-md flex items-center justify-center text-[10px] sm:text-[11px] text-slate-400 font-mono gap-4 sm:gap-8 z-50 tracking-wider">
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> Lobbies Active: 4</span>
        <span className="hidden sm:flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div> OCR Queue: 0.8s latency</span>
        <span className="hidden md:flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div> Auto-dispute: Active</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> Server: Mumbai AP-South-1 (24ms)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Conversion & Hook */}
          <div className="flex flex-col z-10 pt-8 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-bold mb-8 w-fit tracking-wide"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              v3.2 Engine Live • Krafton Compliant
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              SCALE YOUR TOURNAMENTS, NOT YOUR WORKLOAD.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">ZERO DATA ENTRY.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed font-medium"
            >
              Automated Discord verification, OCR-based score extraction, and instant OBS browser graphics in one high-performance command center.
            </motion.p>

            {/* Widgets Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-6 mb-10"
            >
              {/* Discord Bot Pill */}
              <div className="bg-[#0f172a]/80 backdrop-blur border border-slate-800/80 rounded-lg p-3 w-fit font-mono text-[11px] sm:text-xs flex items-center gap-2.5 shadow-lg">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">/tournament create</span>
                <span className="text-indigo-400">name:</span><span className="text-slate-200">BGIS_Scrims</span>
                <span className="text-indigo-400">slots:</span><span className="text-slate-200">16</span>
              </div>

              {/* Speed Comparison */}
              <div className="flex flex-col gap-2.5 border-l-2 border-slate-800 pl-4">
                <div className="flex items-center gap-3">
                   <div className="text-xs font-bold text-slate-500 w-28 tracking-wide">Manual Excel Flow</div>
                   <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">14 mins 30 secs</div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-xs font-bold text-slate-500 w-28 tracking-wide">Riftora Engine Flow</div>
                   <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     18 secs
                   </div>
                </div>
              </div>
            </motion.div>
            
            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/auth/register" className="w-full sm:w-auto">
                <button className="w-full px-8 py-3.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                  Launch Console (Free)
                </button>
              </Link>
              <Link to="/explore" className="w-full sm:w-auto">
                <button className="w-full px-8 py-3.5 rounded-md bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-bold transition-all flex items-center justify-center gap-2">
                  Live Demo <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            {/* Rolling Counters Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-slate-800/50"
            >
              <div>
                <div className="text-2xl font-black text-white font-mono tracking-tight">₹<RollingCounter value={50} />L+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Prize Pools</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono tracking-tight"><RollingCounter value={10000} />+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Players</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono tracking-tight"><RollingCounter value={2.5} isDecimal={true} suffix="s" /></div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Avg Result Publish</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive "Live Match" Terminal */}
          <div className="relative w-full perspective-1000">
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[600px] mx-auto lg:ml-auto transform-gpu"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-2xl z-0 pointer-events-none"></div>
              
              {/* Terminal Container */}
              <div className="relative z-10 bg-[#07101C]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header / Tab Bar */}
                <div className="flex flex-wrap items-center bg-[#04080F] border-b border-slate-800 p-2 gap-1 relative z-20">
                  <div className="flex items-center gap-1.5 px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="w-px h-4 bg-slate-800 mx-2"></div>
                  
                  {[
                    { id: 'ocr', label: '1. OCR Intake', icon: Crosshair },
                    { id: 'scrim', label: '2. Scrim Matrix', icon: Database },
                    { id: 'obs', label: '3. Live OBS', icon: Tv }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        activeTab === tab.id 
                          ? "bg-slate-800 text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      )}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="p-5 h-[320px] bg-gradient-to-b from-[#0A0F1C] to-[#07101C] overflow-hidden">
                  
                  {activeTab === 'ocr' && (
                    <div className="h-full flex flex-col pt-2">
                      <div className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4 flex justify-between items-center">
                        ZoneX Killer (OCR Ingest)
                        <span className="text-cyan-400 normal-case tracking-normal bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Under 1.5s
                        </span>
                      </div>
                      
                      <div className="relative flex-1 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700 p-4">
                        {/* Fake Screenshot Structure */}
                        <div className="opacity-30 flex flex-col gap-3">
                          <div className="h-5 bg-slate-500 rounded w-1/3 mb-2"></div>
                          <div className="flex gap-2"><div className="w-8 h-8 bg-slate-500 rounded"></div><div className="h-8 bg-slate-500 rounded flex-1"></div></div>
                          <div className="flex gap-2"><div className="w-8 h-8 bg-slate-500 rounded"></div><div className="h-8 bg-slate-500 rounded flex-1"></div></div>
                          <div className="flex gap-2"><div className="w-8 h-8 bg-slate-500 rounded"></div><div className="h-8 bg-slate-500 rounded w-3/4"></div></div>
                        </div>
                        
                        {/* Laser Scanline */}
                        <motion.div 
                          initial={{ top: "0%" }} 
                          animate={{ top: "100%" }} 
                          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} 
                          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-10" 
                        />

                        {/* Floating JSON Output */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur border border-slate-800 rounded p-3 text-[11px] font-mono text-cyan-300 shadow-xl"
                        >
                          <div className="text-emerald-400 mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3"/> OCR Confidence: 99.4%</div>
                          <div>{`->`} <span className="text-white">#1 Hydra:</span> 10 pts (8 kills)</div>
                          <div className="mt-1">{`->`} <span className="text-white">#2 Nova:</span> 6 pts (4 kills)</div>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'scrim' && (
                    <div className="h-full flex flex-col pt-2">
                      <div className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4 flex justify-between items-center">
                        Auto-Lobby Generator
                        <button className="text-emerald-400 normal-case tracking-normal bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/30 hover:bg-emerald-400/20 transition-colors flex items-center gap-1.5 cursor-pointer">
                          <Copy className="w-3 h-3" /> Copy IDP
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                        {['Hydra', 'Soul', 'GodL', 'Blind', 'Gladiator', 'Entity', 'Global', 'Revenant'].map((team, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-3 py-2 rounded bg-slate-800/40 border border-slate-700/50 text-[11px]"
                          >
                            <span className="text-slate-500 font-mono font-bold">Slot {i+1}</span>
                            <span className="font-bold text-slate-200">{team}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'obs' && <OBSTab />}
                </div>

                {/* Mini Broadcast Bar Footer */}
                <div className="bg-[#04080F] border-t border-slate-800 p-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
                    <span>Syncing with OBS port 4455...</span>
                  </div>
                  <button className="bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1.5 rounded border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer font-sans font-bold">
                    <Copy className="w-3 h-3" /> Copy Live OBS Test Source
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Dummy icon for Tv since it wasn't imported from lucide-react in earlier examples
function Tv(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
      <polyline points="17 2 12 7 7 2"></polyline>
    </svg>
  );
}
