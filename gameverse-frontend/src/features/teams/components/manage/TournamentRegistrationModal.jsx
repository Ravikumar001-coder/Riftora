import React, { useState } from 'react';
import { X, Loader2, Trophy, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGetPublicTournaments } from '../../../tournaments/api/useTournamentQueries';
import { useRegisterTeam } from '../../../registrations/api/useRegistrationQueries';

export function TournamentRegistrationModal({ team, onClose, onToast }) {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  const { data: tournaments, isLoading: loadingTournaments } = useGetPublicTournaments(team?.gameId);
  const { mutate: registerTeam, isPending: isRegistering } = useRegisterTeam();

  const handleToggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRegister = () => {
    if (!selectedTournament) return;
    if (selectedMembers.length < selectedTournament.minTeamSize) {
      onToast(`Please select at least ${selectedTournament.minTeamSize} players.`, true);
      return;
    }
    const maxSubs = selectedTournament.maxSubstitutes || 0;
    if (selectedMembers.length > selectedTournament.maxTeamSize + maxSubs) {
      onToast(`You can only select up to ${selectedTournament.maxTeamSize + maxSubs} players.`, true);
      return;
    }

    registerTeam(
      {
        tournamentId: selectedTournament.tournamentId,
        teamId: team.teamId,
        teamMemberIds: selectedMembers
      },
      {
        onSuccess: () => {
          onToast('Successfully registered for tournament!');
          onClose();
        },
        onError: (err) => {
          const msg = err.response?.data?.error?.message || 'Failed to register';
          onToast(msg, true);
        }
      }
    );
  };

  const activeRoster = team?.roster?.filter(m => m.isActive) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            Tournament Registration
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedTournament ? (
            // Step 1: Select Tournament
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">Select a Tournament</h3>
              
              {loadingTournaments ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : !tournaments || tournaments.length === 0 ? (
                <div className="text-center p-8 border border-slate-800 rounded-xl bg-slate-900/50">
                  <p className="text-slate-400">No open tournaments available for your game right now.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {tournaments.map(t => (
                    <button
                      key={t.tournamentId}
                      onClick={() => setSelectedTournament(t)}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left"
                    >
                      <div>
                        <div className="font-bold text-white mb-1">{t.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>Team Size: {t.minTeamSize}-{t.maxTeamSize}</span>
                          <span>Format: {t.formatType?.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="text-blue-400 text-sm font-medium">Select</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Step 2: Select Roster
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div>
                  <h4 className="font-bold text-white">{selectedTournament.name}</h4>
                  <p className="text-xs text-slate-400">
                    Required: {selectedTournament.minTeamSize}-{selectedTournament.maxTeamSize} players
                    {selectedTournament.maxSubstitutes > 0 && ` (+${selectedTournament.maxSubstitutes} subs)`}
                  </p>
                </div>
                <button 
                  onClick={() => { setSelectedTournament(null); setSelectedMembers([]); }}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Change
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Select Players
                  </h3>
                  <span className="text-sm font-medium text-slate-400">
                    {selectedMembers.length} selected
                  </span>
                </div>

                {activeRoster.length === 0 ? (
                  <div className="text-center p-6 border border-slate-800 rounded-xl bg-slate-900/50">
                    <AlertCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Your active roster is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeRoster.map(member => {
                      const isSelected = selectedMembers.includes(member.id);
                      return (
                        <div 
                          key={member.id}
                          onClick={() => handleToggleMember(member.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-600/10 border-blue-500/50' 
                              : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{member.username}</div>
                              <div className="text-xs text-slate-400">UID: {member.inGameUid}</div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-900 text-slate-300 capitalize">
                            {member.role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
          >
            Cancel
          </button>
          
          {selectedTournament && (
            <button
              onClick={handleRegister}
              disabled={isRegistering || selectedMembers.length < selectedTournament.minTeamSize}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isRegistering && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
