import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, PieChart, Activity, Image as ImageIcon, MonitorPlay, ExternalLink, CalendarDays, Clock, Map } from 'lucide-react';

export function SponsorManagement() {
  return (
    <section className="py-24 relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Turn Tournament Reach Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Sponsor Value.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Manage sponsor branding, placements, broadcast visibility, and tournament activations from the same platform that runs your competition.
          </motion.p>
        </div>

        {/* Sponsor Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-[#040d1a] border border-slate-700/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-bold tracking-wider">SPONSOR MANAGEMENT</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tournament:</span>
              <span className="text-sm font-semibold text-white">Riftora Championship</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-1">
            {/* Sidebar: Sponsors List */}
            <div className="w-full md:w-64 bg-[#071426] border-r border-slate-800 p-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Active Campaigns</div>
              <div className="space-y-2">
                {[
                  { name: "BOOYAH!", active: true, selected: true },
                  { name: "ASUS ROG", active: true, selected: false },
                  { name: "Red Bull", active: true, selected: false }
                ].map((sponsor, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      sponsor.selected 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className={`font-semibold text-sm ${sponsor.selected ? 'text-emerald-400' : 'text-white'}`}>{sponsor.name}</span>
                    {sponsor.active && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-dashed border-slate-600 rounded text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                + Add Sponsor
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-8 bg-[#040d1a]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">BOOYAH! Campaign</h4>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE ACROSS 5 PLACEMENTS
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-sm text-white font-medium transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> View Brand Kit
                </button>
              </div>

              {/* Placements Grid */}
              <div className="mb-8">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Configured Placements</div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { icon: LayoutDashboard, label: "Tournament Header", status: "Active" },
                    { icon: MonitorPlay, label: "Live Overlay", status: "Active" },
                    { icon: Activity, label: "Match Result", status: "Active" },
                    { icon: ImageIcon, label: "Sponsor Slide", status: "Queued" },
                    { icon: Trophy, label: "Finale", status: "Scheduled" }
                  ].map((placement, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col items-center text-center">
                      <placement.icon className={`w-5 h-5 mb-2 ${placement.status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-bold text-slate-300 uppercase leading-tight mb-1">{placement.label}</span>
                      <span className={`text-[9px] ${placement.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>{placement.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exposure Tracking */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Exposure Tracking Log</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <PieChart className="w-3 h-3" /> Auto-generated by OBS integration
                  </div>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1e293b] text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Timestamp</th>
                        <th className="px-4 py-3 font-semibold"><Map className="w-3 h-3 inline mr-1"/> Placement</th>
                        <th className="px-4 py-3 font-semibold">Scene / Context</th>
                        <th className="px-4 py-3 font-semibold">Match</th>
                        <th className="px-4 py-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {[
                        { time: "Today, 14:32:15", place: "Match Result", scene: "Post-Match Stats", match: "Match 4", dur: "45s" },
                        { time: "Today, 14:15:00", place: "Live Overlay", scene: "In-Game Live", match: "Match 4", dur: "17m 12s" },
                        { time: "Today, 14:10:45", place: "Sponsor Slide", scene: "Intermission", match: "Break", dur: "4m 15s" },
                        { time: "Today, 13:52:10", place: "Match Result", scene: "Post-Match Stats", match: "Match 3", dur: "52s" },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-slate-400">{row.time}</td>
                          <td className="px-4 py-3 font-medium text-white">{row.place}</td>
                          <td className="px-4 py-3">{row.scene}</td>
                          <td className="px-4 py-3">{row.match}</td>
                          <td className="px-4 py-3 text-emerald-400 font-medium">{row.dur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// Quick placeholder for Trophy icon since it wasn't imported from lucide-react in this block
function Trophy(props) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
    </svg>
  );
}
