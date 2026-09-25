import React from 'react';

export function BrandIdentityCard({ sponsor }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
      <div className="w-24 h-24 mx-auto bg-slate-800 rounded-2xl p-2 mb-4 shadow-lg border border-slate-700 overflow-hidden">
        <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover rounded-xl" />
      </div>
      <h2 className="text-xl font-bold text-white mb-1">{sponsor.name}</h2>
      <p className="text-slate-400 text-sm mb-4">{sponsor.role}</p>
      
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium text-slate-300">
        Sponsorship: <span className="text-yellow-500 ml-1">{sponsor.tier}</span>
      </div>
    </div>
  );
}
