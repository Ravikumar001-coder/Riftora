import React from 'react';
import { Activity, Radio, LayoutTemplate, CheckSquare, Layers, AlertTriangle } from 'lucide-react';

export function KPICards({ data }) {
  const cards = [
    {
      label: 'Current Match',
      value: `Match ${data.currentMatch.number}`,
      subtext: data.currentMatch.status.replace('_', ' '),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Next Match',
      value: `Match ${data.nextMatch.number}`,
      subtext: `Starts at ${data.schedule.find(s => s.id === data.nextMatch.id)?.time || 'TBD'}`,
      icon: Radio,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      label: 'Stream Status',
      value: data.streamHealth.status,
      subtext: data.streamHealth.connection,
      icon: LayoutTemplate,
      color: data.streamHealth.status === 'LIVE' ? 'text-green-500' : 'text-slate-400',
      bgColor: data.streamHealth.status === 'LIVE' ? 'bg-green-500/10' : 'bg-slate-800'
    },
    {
      label: 'Overlay Readiness',
      value: `${data.overlays.filter(o => o.status === 'READY').length} / ${data.overlays.length}`,
      subtext: 'Ready to Air',
      icon: Layers,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Production Tasks',
      value: data.alerts.filter(a => a.priority === 'warning' || a.priority === 'error').length.toString(),
      subtext: 'Require Attention',
      icon: AlertTriangle,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    },
    {
      label: 'Sponsors',
      value: `${data.sponsorsSummary.active} / ${data.sponsors.length}`,
      subtext: 'ACTIVE',
      icon: CheckSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:bg-slate-900 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.label}</span>
            <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-xs text-slate-500 font-medium">{card.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
