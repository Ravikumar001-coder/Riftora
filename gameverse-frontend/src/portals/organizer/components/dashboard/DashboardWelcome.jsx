import React from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Settings } from 'lucide-react';

export function DashboardWelcome({ organization }) {
  const { user } = useAuthStore();
  
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  if (!organization) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          {greeting}, {user?.username || 'Organizer'} 👋
        </h1>
        <p className="text-slate-400 text-lg mb-6">
          Set up your organization to start creating tournaments.
        </p>
        <Link to="/organizations/create" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
          <PlusCircle className="w-5 h-5" /> Create Organization
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          {greeting}, {user?.username || 'Organizer'} 👋
        </h1>
        <p className="text-slate-400 text-lg">
          Here's your tournament operations overview.
        </p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-5 min-w-[300px]">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shrink-0 shadow-inner">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{organization.role}</div>
          <h2 className="text-lg font-bold text-white leading-tight mb-1">{organization.name}</h2>
          <div className="text-xs font-medium text-slate-400">
            {organization.totalTournaments} Tournaments • {organization.staffCount} Staff
          </div>
        </div>
        <Link 
          to={`/organizations/${organization.slug}/manage/overview`}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          title="Manage Organization"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
