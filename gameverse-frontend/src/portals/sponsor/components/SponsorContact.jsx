import React from 'react';
import { Mail, Building2, User } from 'lucide-react';

export function SponsorContact({ contact }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-5">Sponsor Contact</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-400 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Organization</p>
            <p className="text-sm text-slate-200 font-medium">{contact.organization}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-400 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Representative</p>
            <p className="text-sm text-slate-200 font-medium">{contact.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-400 mt-0.5">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Email</p>
            <a href={`mailto:${contact.email}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">{contact.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
