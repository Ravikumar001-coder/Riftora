import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function PerformanceOverview({ performance }) {
  const [filter, setFilter] = useState('Season');
  const [filterOpen, setFilterOpen] = useState(false);

  if (!performance) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">Not enough data yet</h3>
        <p className="text-slate-500 text-sm">Play a few matches to start seeing your performance.</p>
      </div>
    );
  }

  const { chartData } = performance;
  // Normalize chart data for CSS visualization (100 is max)
  const maxValue = Math.max(...chartData.map(d => d.value), 100);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden mb-8" id="performance">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-300 tracking-wider">PERFORMANCE</span>
        
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          
          {filterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 mt-1 z-20 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden text-sm">
                {['7 Days', '30 Days', 'Season'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setFilter(option); setFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-slate-700 ${filter === option ? 'text-white bg-slate-700/50' : 'text-slate-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="p-5 sm:p-6">
        <h4 className="text-base font-bold text-white mb-6">Recent Match Performance</h4>
        
        {/* CSS Chart */}
        <div className="h-56 flex items-end justify-between gap-2 mb-8 relative pl-8 pt-6">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 left-8 flex flex-col justify-between pointer-events-none border-b border-slate-800 pb-6 pt-6">
            <div className="w-full h-px bg-slate-800/50 relative">
              <span className="absolute -left-2 -top-2 text-[10px] text-slate-500 -translate-x-full">100</span>
            </div>
            <div className="w-full h-px bg-slate-800/50 relative">
              <span className="absolute -left-2 -top-2 text-[10px] text-slate-500 -translate-x-full">75</span>
            </div>
            <div className="w-full h-px bg-slate-800/50 relative">
              <span className="absolute -left-2 -top-2 text-[10px] text-slate-500 -translate-x-full">50</span>
            </div>
            <div className="w-full h-px bg-slate-800/50 relative">
              <span className="absolute -left-2 -top-2 text-[10px] text-slate-500 -translate-x-full">25</span>
            </div>
          </div>
          
          {/* Bars */}
          {chartData.map((data, idx) => {
            const height = `${(data.value / maxValue) * 100}%`;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 z-10 h-full justify-end group pb-6 relative">
                <div className="w-full max-w-[40px] bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 hover:border-blue-400 rounded-t-md transition-all relative flex justify-center" style={{ height }}>
                  {/* Tooltip & Static Label */}
                  <div className="absolute -top-6 text-[10px] text-slate-400 font-medium group-hover:text-white transition-colors">
                    {data.value}
                  </div>
                  <div className="absolute -top-10 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {data.value} pts
                  </div>
                </div>
                <span className="text-xs text-slate-500 absolute bottom-0 font-medium">{data.name}</span>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Avg Placement</div>
            <div className="text-lg font-bold text-white">{performance.averagePlacement}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Avg Kills</div>
            <div className="text-lg font-bold text-white">{performance.averageKills}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Win Rate</div>
            <div className="text-lg font-bold text-white">{performance.winRate}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Avg Points</div>
            <div className="text-lg font-bold text-white">{performance.averagePoints}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 sm:col-span-1 col-span-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Best</div>
            <div className="text-lg font-bold text-blue-400">{performance.bestPlacement}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
