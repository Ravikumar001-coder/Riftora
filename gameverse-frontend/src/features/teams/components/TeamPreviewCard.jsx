import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { MOCK_ADMIN_GAMES } from '../../admin/data/mockAdminGames';

export const TeamPreviewCard = ({ teamName, teamTag, primaryGame, logoPreview }) => {
  const { user } = useAuthStore();
  const game = MOCK_ADMIN_GAMES.find(g => g.slug === primaryGame);

  const displayInitials = teamTag 
    ? teamTag.substring(0, 2).toUpperCase() 
    : (teamName ? teamName.substring(0, 2).toUpperCase() : 'TM');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl sticky top-24">
      {/* Banner Area (Decorative) */}
      <div className="h-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>
      
      <div className="px-6 pb-6 pt-0 relative">
        {/* Logo Avatar */}
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-900 shadow-lg flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Team Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-slate-500 tracking-tighter">
                {displayInitials}
              </span>
            )}
          </div>
        </div>
        
        {/* Identity Details */}
        <div className="pt-14 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
              {teamTag || 'TAG'}
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Competitive Team
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white truncate">
            {teamName || 'Your Team Name'}
          </h2>
          
          <div className="text-slate-400 font-medium">
            {game ? game.name : 'No game selected'}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800 my-5"></div>
        
        {/* Captain Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Team Captain
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-slate-400">
                  {user?.username?.substring(0, 1).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">You</div>
              <div className="text-xs text-slate-400">@{user?.username || 'username'}</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
