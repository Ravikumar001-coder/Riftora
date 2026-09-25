import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, CalendarCheck, MapPin, Key, Gamepad2, Trophy, Clock, CheckCircle2, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const WORKFLOW_STEPS = [
  { id: 'create', title: '01 CREATE TEAM', desc: 'Create your competitive team.', icon: Shield },
  { id: 'roster', title: '02 BUILD ROSTER', desc: 'Add players and substitutes.', icon: Users },
  { id: 'register', title: '03 REGISTER', desc: 'Register your team for a tournament.', icon: CalendarCheck },
  { id: 'checkin', title: '04 CHECK-IN', desc: 'Confirm your squad before the match.', icon: Clock },
  { id: 'lobby', title: '05 LOBBY ASSIGNMENT', desc: 'See your assigned lobby and match.', icon: MapPin },
  { id: 'credentials', title: '06 CREDENTIALS', desc: 'Access room credentials when released.', icon: Key },
  { id: 'compete', title: '07 COMPETE', desc: 'Play the scheduled match.', icon: Gamepad2 },
  { id: 'results', title: '08 RESULTS', desc: "Track your team's result and leaderboard position.", icon: Trophy }
];

export function TeamCaptainWorkflow() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section className="py-24 relative overflow-hidden z-10 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Top Split: Text & Card */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-16 lg:mb-24">
          {/* Left Text */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">FOR TEAM CAPTAINS</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Your Team. <br className="hidden lg:block"/> Ready for Every Match.
            </h2>
            <p className="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
              From roster management to check-in, lobby credentials, match schedules and results, Riftora keeps your squad connected to every stage of the competition.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
              Manage Your Team
            </button>
          </div>

          {/* Right Card Mockup */}
          <div className="lg:w-1/2 w-full max-w-md mx-auto">
            <motion.div 
              className="bg-[#071426] border border-slate-700/60 rounded-2xl p-5 md:p-6 shadow-2xl relative"
              animate={{ y: activeStep ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">TEAM CAPTAIN</h3>
                   <div className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                     <Shield className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
                     Hydra Esports
                   </div>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                   <Users className="w-5 h-5 text-slate-400" />
                 </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#040d1a] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-1">Roster</div>
                    <div className="text-sm text-slate-200 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 4/4 Verified
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium mb-1">Tournament</div>
                    <div className="text-sm text-slate-200 font-bold truncate max-w-[120px] sm:max-w-[150px]">Riftora Championship</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                   <div className="bg-[#040d1a] border border-slate-800 rounded-xl p-3 md:p-4">
                      <div className="text-[10px] md:text-xs text-slate-500 font-medium mb-1">Status</div>
                      <div className="text-xs md:text-sm text-indigo-400 font-bold flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div> Registered
                      </div>
                   </div>
                   <div className="bg-[#040d1a] border border-slate-800 rounded-xl p-3 md:p-4">
                      <div className="text-[10px] md:text-xs text-slate-500 font-medium mb-1">Check-in</div>
                      <div className="text-xs md:text-sm text-emerald-500 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> Completed
                      </div>
                   </div>
                </div>

                <div className="bg-[#040d1a] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-1">Next Match</div>
                    <div className="text-xs md:text-sm text-white font-bold">Match 06 <span className="text-slate-500 mx-1 md:mx-2">•</span> Lobby B</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium mb-1">Time</div>
                    <div className="text-xs md:text-sm text-emerald-400 font-bold">16:30</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 md:p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3 w-full">
                     <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                       <Lock className="w-4 h-4 text-slate-500" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-xs md:text-sm font-bold text-slate-300 truncate">Room Credentials</div>
                       <div className="text-[10px] md:text-xs text-slate-500 truncate">Available Before Match</div>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Workflow */}
        <div className="relative mt-8 lg:mt-0">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-slate-800 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 relative z-10">
             {WORKFLOW_STEPS.map((step, idx) => {
               const isActive = activeStep === step.id;
               
               return (
                 <div 
                   key={step.id}
                   className="relative group cursor-pointer"
                   onMouseEnter={() => setActiveStep(step.id)}
                   onMouseLeave={() => setActiveStep(null)}
                 >
                   {/* Mobile connecting line */}
                   {idx !== WORKFLOW_STEPS.length - 1 && (
                     <div className="lg:hidden absolute top-12 bottom-[-16px] left-6 w-0.5 bg-slate-800 z-0"></div>
                   )}
                   
                   <div className={cn(
                     "flex lg:flex-col items-center gap-4 lg:gap-3 p-3 lg:px-1 rounded-xl transition-all relative z-10 h-full",
                     isActive ? "bg-slate-800/50 lg:bg-transparent" : "hover:bg-slate-800/30 lg:hover:bg-transparent"
                   )}>
                     <div className={cn(
                       "w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                       isActive ? "border-indigo-500 bg-indigo-500/20 text-indigo-400 scale-110" : "border-slate-700 bg-slate-900 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-300"
                     )}>
                       <step.icon className="w-5 h-5" />
                     </div>
                     
                     <div className="flex-1 lg:text-center">
                       <div className={cn(
                         "text-[11px] font-black tracking-widest uppercase mb-1 transition-colors leading-tight",
                         isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                       )}>
                         {step.title.split(' ')[0]} <br className="hidden lg:block"/> {step.title.split(' ').slice(1).join(' ')}
                       </div>
                       
                       <div className={cn(
                         "text-xs text-slate-500 transition-all leading-relaxed",
                         isActive ? "opacity-100" : "lg:opacity-0 group-hover:opacity-100"
                       )}>
                         {step.desc}
                       </div>
                     </div>
                   </div>
                 </div>
               )
             })}
          </div>
        </div>
      </div>
    </section>
  );
}
