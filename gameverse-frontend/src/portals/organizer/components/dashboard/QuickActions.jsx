import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UserPlus, FileText, Settings, ShieldAlert, CreditCard } from 'lucide-react';

export function QuickActions({ role, orgSlug }) {
  const isOwner = role === 'Org Owner';
  const isAdminOrOwner = isOwner || role === 'Org Admin';

  const actions = [
    { name: 'Create Tournament', path: '/manage/t1/overview', icon: PlusCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Invite Staff', path: `/organizations/${orgSlug}/manage/members`, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Rules Config', path: '/manage/t1/settings', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Manage Org', path: `/organizations/${orgSlug}/manage/settings`, icon: Settings, color: 'text-slate-400', bg: 'bg-slate-800' },
  ];

  if (isAdminOrOwner) {
    actions.push({ name: 'Disputes', path: '/manage/t1/disputes', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' });
  }

  if (isOwner) {
    actions.push({ name: 'Billing', path: `/organizations/${orgSlug}/manage/billing`, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10' });
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden mb-8">
      <div className="p-5 sm:p-6 border-b border-slate-800/60">
        <span className="text-sm font-bold text-slate-300 tracking-wider">QUICK ACTIONS</span>
      </div>
      
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className="flex items-center gap-3 p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.bg}`}>
                <action.icon className={`w-4 h-4 ${action.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
