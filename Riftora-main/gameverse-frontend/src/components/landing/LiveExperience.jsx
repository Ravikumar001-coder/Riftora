import React from 'react';
import { Calendar, Trophy, Users, FileText, Gift, Tv, List } from 'lucide-react';

export function LiveExperience() {
  const tabs = [
    { name: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { name: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Leaderboard', icon: <List className="w-4 h-4" /> },
    { name: 'Teams', icon: <Users className="w-4 h-4" /> },
    { name: 'Rules', icon: <FileText className="w-4 h-4" /> },
    { name: 'Prizes', icon: <Gift className="w-4 h-4" /> },
    { name: 'Watch Live', icon: <Tv className="w-4 h-4 text-red-400" /> },
    { name: 'Results', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-1/2 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Immersive Live Tournament Experience</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Every tournament on Riftora gets a dedicated, premium public hub. Fans and participants can track schedules, view live leaderboards, check results, and watch official broadcasts all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <div key={tab.name} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0b1b36] border border-white/10 text-slate-300 text-sm font-medium">
                  {tab.icon} {tab.name}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-[#0b1b36] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Mock Header */}
              <div className="h-32 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b36] to-transparent"></div>
              </div>
              
              {/* Mock Content */}
              <div className="px-6 pb-6 -mt-8 relative z-10">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="w-16 h-16 rounded-xl bg-blue-600 border-4 border-[#0b1b36] flex items-center justify-center font-bold text-xl text-white mb-3 shadow-lg">GV</div>
                    <h3 className="text-2xl font-bold text-white">BGMI Pro Series 2024</h3>
                    <p className="text-blue-400 text-sm">Organized by Riftora</p>
                  </div>
                  <button className="px-6 py-2 rounded bg-blue-600 text-white font-medium text-sm">Register Team</button>
                </div>

                <div className="flex gap-6 border-b border-white/10 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="text-blue-400 border-b-2 border-blue-400 pb-2 font-medium whitespace-nowrap">Overview</div>
                  <div className="text-slate-400 pb-2 font-medium whitespace-nowrap">Schedule</div>
                  <div className="text-slate-400 pb-2 font-medium whitespace-nowrap">Teams (42)</div>
                  <div className="text-slate-400 pb-2 font-medium whitespace-nowrap">Prizes</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Format</div>
                    <div className="text-white font-medium">Battle Royale - Squad</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Prize Pool</div>
                    <div className="text-green-400 font-bold">₹5,00,000</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
