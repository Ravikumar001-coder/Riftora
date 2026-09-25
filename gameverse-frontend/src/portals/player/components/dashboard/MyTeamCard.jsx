import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Users, PlusCircle } from 'lucide-react';

export function MyTeamCard({ team }) {
  if (!team) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-wide">MY TEAM</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-[200px]">
          You aren't part of a team yet. Create your own team or find an existing team.
        </p>
        <div className="flex flex-col w-full gap-2">
          <Link to="/teams/create" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> Create Team
          </Link>
          <Link to="/explore" className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700">
            Find Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-bold text-slate-300 tracking-wider">MY TEAM</span>
        <Link to={`/teams/${team.id}/manage`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Manage
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 shadow-lg shadow-black/20">
          <Shield className="w-7 h-7 text-white drop-shadow-md" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight mb-1">{team.name}</h3>
          <p className="text-sm font-medium text-slate-400">{team.game}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {team.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white">{member.username}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${
              member.role === 'Captain' ? 'bg-amber-500/10 text-amber-500' :
              member.role === 'Substitute' ? 'bg-slate-800 text-slate-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              {member.role}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-4 px-2">
          <span>{team.members.length} / {team.maxMembers} Members</span>
          <div className="flex gap-1">
            {[...Array(team.maxMembers)].map((_, i) => (
              <div key={i} className={`h-1.5 w-4 rounded-full ${i < team.members.length ? 'bg-blue-500' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>

        <Link to={`/teams/${team.id}/manage`} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2">
          Open Team <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
