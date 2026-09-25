import React from 'react';
import { Link } from 'react-router-dom';

export function SponsorshipSummary({ sponsor, campaign, tournament }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Sponsorship Tier */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Sponsorship Tier</p>
        <h3 className="text-xl font-bold text-yellow-500 mb-1">{sponsor.tier}</h3>
        <p className="text-sm text-slate-400">{sponsor.role}</p>
      </div>
      
      {/* Campaign Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Campaign Status</p>
        <div className="flex items-center gap-2 mb-2">
          {campaign.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
          <h3 className="text-lg font-bold text-white capitalize">{campaign.status.toLowerCase()}</h3>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>Started: {campaign.startDate}</span>
          <span>Ends: {campaign.endDate}</span>
        </div>
      </div>
      
      {/* Tournament Status */}
      <Link to={`/t/${tournament.slug}`} className="block group">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 h-full transition-colors group-hover:bg-slate-800/80 group-hover:border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Tournament</p>
          <div className="flex items-center gap-2 mb-1">
            {tournament.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
            <h3 className="text-lg font-bold text-white">{tournament.status}</h3>
          </div>
          <p className="text-sm text-slate-400 mt-2 group-hover:text-blue-400 transition-colors">Match Day 2 &rarr;</p>
        </div>
      </Link>
    </div>
  );
}
