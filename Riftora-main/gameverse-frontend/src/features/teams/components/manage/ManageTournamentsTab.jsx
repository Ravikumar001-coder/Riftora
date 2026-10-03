import React, { useState } from 'react';
import { Loader2, Trophy, Search, AlertCircle, Plus, Calendar, ShieldAlert } from 'lucide-react';
import { useGetTeamRegistrations } from '../../../registrations/api/useRegistrationQueries';
import { TournamentRegistrationModal } from './TournamentRegistrationModal';

export function ManageTournamentsTab({ team, onToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: registrations, isLoading, error } = useGetTeamRegistrations(team?.teamId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
      case 'under_review': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'correction_requested': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'waitlisted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusText = (status) => {
    return status?.replace('_', ' ')?.toUpperCase() || 'UNKNOWN';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Tournaments</h2>
          <p className="text-sm text-slate-400">Manage your team's tournament registrations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          Find Tournaments
        </button>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="font-semibold text-white">Active Registrations</h3>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p>Failed to load registrations.</p>
          </div>
        ) : !registrations || registrations.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No active registrations</h3>
            <p className="text-slate-400 max-w-sm mb-6">
              Your team hasn't registered for any tournaments yet.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {registrations.map(reg => (
              <div key={reg.registrationId} className="p-6 hover:bg-slate-800/20 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{reg.tournamentName}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Registered: {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                      <span>Ref: {reg.referenceNumber}</span>
                    </div>
                    {reg.flagScore === 'red' && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Flagged for Review
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(reg.status)}`}>
                      {getStatusText(reg.status)}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TournamentRegistrationModal 
          team={team} 
          onClose={() => setIsModalOpen(false)} 
          onToast={onToast} 
        />
      )}
    </div>
  );
}
