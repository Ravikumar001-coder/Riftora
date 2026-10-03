import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export function BrandPerformance({ analytics }) {
  const [timeRange, setTimeRange] = useState('Tournament');

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const metrics = [
    { label: 'Impressions', value: analytics.impressions.current, change: analytics.impressions.change },
    { label: 'Engagements', value: analytics.engagements.current, change: analytics.engagements.change },
    { label: 'Stream Views', value: analytics.streamViews.current, change: analytics.streamViews.change },
    { label: 'Clicks', value: analytics.clicks.current, change: analytics.clicks.change },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Brand Performance</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Tournament</option>
          <option>Custom</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">{m.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-bold text-white">{formatNumber(m.value)}</h3>
              <span className="flex items-center text-xs font-medium text-green-400 mb-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {m.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightweight Chart visualization */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Brand Impressions Trend</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {/* Mock data points for a bar chart */}
          {[12, 18, 25, 30, 42, 38, 55, 60, 75, 82, 95, 88].map((h, i) => (
            <div key={i} className="w-full relative group">
              <div 
                className="bg-blue-500/20 hover:bg-blue-500/40 border-t-2 border-blue-500 rounded-t-sm w-full transition-all"
                style={{ height: `${h}%` }}
              ></div>
              {/* Tooltip on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                Sep {i + 1}: {Math.floor(h * 1.2)}K
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-3">
          <span>Sep 01</span>
          <span>Sep 06</span>
          <span>Sep 11</span>
        </div>
      </div>
    </div>
  );
}
