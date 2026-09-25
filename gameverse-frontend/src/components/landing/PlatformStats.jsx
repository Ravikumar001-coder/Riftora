import React, { useEffect, useState, useRef } from 'react';
import { mockStats } from '../../services/mockData';
import { motion, useInView, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { Users, Shield, Trophy, IndianRupee } from 'lucide-react';

function StatCounter({ label, finalValue, targetNumber, prefix = '', suffix = '', icon: Icon, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isFinished, setIsFinished] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, targetNumber, {
        duration: 2,
        delay: delay,
        ease: "easeOut",
        onComplete: () => setIsFinished(true)
      });
      return controls.stop;
    }
  }, [isInView, count, targetNumber, delay]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="text-center px-2 flex flex-col items-center"
    >
      <motion.div 
        animate={isFinished ? { 
          y: [0, -5, 0], 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="mb-3 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400"
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-1 flex items-center justify-center">
        {prefix}
        {isFinished ? finalValue.replace(prefix, '').replace(suffix, '') : <motion.span>{rounded}</motion.span>}
        {suffix}
      </div>
      <div className="text-xs lg:text-sm text-slate-400 font-semibold uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

export function PlatformStats() {
  const stats = [
    { label: 'Players', value: mockStats.players, target: 10000, suffix: '+', icon: Users },
    { label: 'Teams', value: mockStats.teams, target: 2500, suffix: '+', icon: Shield },
    { label: 'Tournaments', value: mockStats.tournaments, target: 500, suffix: '+', icon: Trophy },
    { label: 'Prize Pools', value: mockStats.prizePools, target: 50, prefix: '₹', suffix: 'L+', icon: IndianRupee },
  ];

  return (
    <section className="relative z-10 container mx-auto px-4 lg:px-8 my-8">
      <div className="py-6 sm:py-8 border border-white/10 rounded-3xl sm:rounded-[2.5rem] bg-[#071426]/40 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-white/10 px-4 sm:px-8">
          {stats.map((stat, index) => (
            <StatCounter 
              key={index} 
              label={stat.label} 
              finalValue={stat.value} 
              targetNumber={stat.target}
              prefix={stat.prefix}
              suffix={stat.suffix}
              icon={stat.icon}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
