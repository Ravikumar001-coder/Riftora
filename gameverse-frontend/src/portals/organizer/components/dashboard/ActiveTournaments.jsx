import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Radio, ClipboardList, CalendarDays, Settings } from 'lucide-react';

export function ActiveTournaments({ tournaments }) {
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-300 mb-2">No active tournaments</h3>
        <p className="text-slate-500 text-sm mb-4">Create your first tournament and start building your event.</p>
        <Link to="/manage/t1/overview" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
          Create Tournament
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'REGISTRATION': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'SCHEDULED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DRAFT': return 'text-slate-400 bg-slate-800 border-slate-700';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Command Center': return <Radio className="w-4 h-4" />;
      case 'Registrations': return <ClipboardList className="w-4 h-4" />;
      case 'Schedule': return <CalendarDays className="w-4 h-4" />;
      case 'Configure': return <Settings className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden mb-8">
      <div className="p-5 sm:p-6 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300 tracking-wider">ACTIVE TOURNAMENTS</span>
        <Link to="/organizations/hydra-esports/manage/tournaments" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tournament</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Teams</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tournaments.map((tournament) => (
              <tr key={tournament.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-white">{tournament.name}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-slate-300">{tournament.currentTeams} / {tournament.maxTeams}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link 
                    to={tournament.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    {getActionIcon(tournament.nextAction)}
                    {tournament.nextAction}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-800/60">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="p-5 flex flex-col gap-4 hover:bg-slate-800/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-white mb-2">{tournament.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teams</div>
                <div className="text-sm font-medium text-slate-300">{tournament.currentTeams} / {tournament.maxTeams}</div>
              </div>
            </div>
            
            <Link 
              to={tournament.link}
              className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700 mt-2"
            >
              {getActionIcon(tournament.nextAction)}
              {tournament.nextAction}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
