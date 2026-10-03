import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { userRoles } from '../../../../services/docsData';

export function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="py-16 border-t border-white/5">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-4">Choose Your Path</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Not sure where to start? Select your role below to find documentation tailored to your needs.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {userRoles.map((role) => {
          const IconComponent = Icons[role.icon] || Icons.User;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/50 border border-white/5 hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                <IconComponent className="w-8 h-8 text-slate-300 group-hover:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white text-center">{role.title}</h3>
            </button>
          );
        })}
      </div>
    </div>
  );
}
