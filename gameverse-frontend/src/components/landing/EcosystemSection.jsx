import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Anchor, Building2, Radio } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function EcosystemSection() {
  const cards = [
    {
      id: 'players',
      title: "For Players",
      icon: <Gamepad2 className="w-6 h-6 text-white" />,
      features: [
        "Create your player profile",
        "Join teams",
        "Register for tournaments",
        "Track match schedules",
        "View tournament performance"
      ],
      cta: "Explore Tournaments",
      href: "/explore",
      color: "from-blue-600 to-blue-400"
    },
    {
      id: 'captains',
      title: "For Team Captains",
      icon: <Anchor className="w-6 h-6 text-white" />,
      features: [
        "Create teams",
        "Manage rosters",
        "Invite players",
        "Register teams",
        "Check in for tournaments"
      ],
      cta: "Start Your Team",
      href: "/auth/register",
      color: "from-emerald-600 to-emerald-400"
    },
    {
      id: 'organizers',
      title: "For Organizers",
      icon: <Building2 className="w-6 h-6 text-white" />,
      features: [
        "Create tournaments",
        "Manage registrations",
        "Schedule matches",
        "Manage staff & disputes",
        "Distribute prizes"
      ],
      cta: "Organize a Tournament",
      href: "/auth/register",
      color: "from-purple-600 to-purple-400"
    },
    {
      id: 'broadcasters',
      title: "For Broadcast Teams",
      icon: <Radio className="w-6 h-6 text-white" />,
      features: [
        "Live tournament data",
        "OBS overlays",
        "Real-time leaderboards",
        "Match production tools",
        "Stream monitoring"
      ],
      cta: "Learn More",
      href: "/docs",
      color: "from-red-600 to-red-400"
    }
  ];

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
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A Platform For Everyone</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Riftora is built to support the entire esports ecosystem, providing dedicated tools for every role.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {cards.map((card) => (
            <motion.div 
              key={card.id}
              variants={cardVariants}
              whileHover="hover"
              initial="initial"
              className="bg-[#0b1b36] border border-white/10 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] relative"
            >
              {/* Shimmer Border */}
              <motion.div 
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={{
                  initial: { x: "-100%", opacity: 0 },
                  hover: { x: "100%", opacity: 1, transition: { repeat: Infinity, duration: 1.5, ease: "linear" } }
                }}
              />

              <div className={cn("p-6 bg-gradient-to-br opacity-90 relative z-10", card.color)}>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative z-10 bg-[#0b1b36]">
                {/* Collapsed by default, expand on hover */}
                <motion.ul 
                  className="flex flex-col gap-3 mb-8 overflow-hidden"
                  variants={{
                    initial: { height: "120px", opacity: 0.7 },
                    hover: { height: "auto", opacity: 1 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0 group-hover:bg-white transition-colors"></span>
                      {feature}
                    </li>
                  ))}
                </motion.ul>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <Link 
                    to={card.href}
                    className="flex items-center justify-center w-full py-3 rounded-lg bg-white/5 group-hover:bg-white/15 text-white font-medium transition-colors relative overflow-hidden"
                  >
                    <span className="relative z-10">{card.cta}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
