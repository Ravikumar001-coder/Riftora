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
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {greeting}, {user?.username || 'Organizer'}
          </h1>
          <span className="text-3xl">👋</span>
        </div>
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
    <div className="mb-8">
      {/* Greeting Header */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {greeting}, {user?.username || 'Organizer'}
        </h1>
        <span className="text-3xl">👋</span>
      </div>
      <p className="text-slate-400 text-lg mb-6">
        Here's what's happening with your competitions.
      </p>

      {/* Premium Profile Card */}
      <div className="bg-[#111423] border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Left Side: Identity */}
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700/50 shrink-0 shadow-xl overflow-hidden relative group">
            {organization.logoUrl ? (
               <img src={organization.logoUrl} alt={`${organization.name} logo`} className="w-full h-full object-cover" />
            ) : (
               <span className="text-3xl font-bold text-slate-400 group-hover:text-white transition-colors">
                 {organization.name?.charAt(0)?.toUpperCase()}
               </span>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{organization.name}</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {organization.role}
              </span>
            </div>
            <div className="text-slate-400 font-medium mb-3">
              @{organization.slug}
            </div>
            <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Active Organizer
              </div>
              <span className="text-slate-600">•</span>
              <span>Esports</span>
              <span className="text-slate-600">•</span>
              <span>Global</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400">{organization.staffCount} Staff Members</span>
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Actions */}
        <div className="flex flex-col sm:items-end gap-6 relative z-10">
          {/* Stats Row */}
          <div className="flex items-center gap-8 sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-0.5">{organization.totalTournaments || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tourneys</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-0.5">{organization.totalParticipants || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Players</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-0.5">{organization.staffCount || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Staff</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-400 mb-0.5">{(organization.totalTournaments * 1250).toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              to={`/organizations/${organization.slug}`}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all"
            >
              View Profile
            </Link>
            <Link 
              to={`/organizations/${organization.slug}/manage/overview`}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-lg transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
