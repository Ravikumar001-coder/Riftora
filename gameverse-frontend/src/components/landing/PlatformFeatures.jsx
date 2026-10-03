import React from 'react';
import { Settings, Zap, Tv, ShieldCheck, Coins, PieChart } from 'lucide-react';

export function PlatformFeatures() {
  const features = [
    {
      icon: <Settings className="w-6 h-6 text-blue-400" />,
      title: "Complete Management",
      description: "From registration and team verification to bracket generation and final results."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Real-Time Scoring",
      description: "Instant score processing and dynamic leaderboard updates across the platform."
    },
    {
      icon: <Tv className="w-6 h-6 text-red-400" />,
      title: "Live Broadcast Ready",
      description: "Built-in streaming integrations, scene management, and dynamic OBS overlays."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Fair Competition",
      description: "Advanced verification, dedicated referee tools, dispute management, and audit trails."
    },
    {
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      title: "Prize Management",
      description: "Transparent prize pool tracking, distribution rules, and payout workflows."
    },
    {
      icon: <PieChart className="w-6 h-6 text-purple-400" />,
      title: "Tournament Analytics",
      description: "Deep insights into performance, participation, broadcast viewership, and financials."
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Riftora</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive suite of tools designed specifically for the unique demands of competitive esports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#0b1b36] border border-white/10 p-8 rounded-2xl hover:bg-white/5 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
