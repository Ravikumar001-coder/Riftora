import React from 'react';
import { History, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useGetRosterHistory } from '../../api/useTeamQueries';

export function ManageRosterHistoryTab({ team }) {
  const { data: history, isLoading } = useGetRosterHistory(team.teamId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
        <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-300">No History Found</h3>
        <p className="text-slate-500">There is no roster history for this team yet.</p>
      </div>
    );
  }

  // Sort history: active members first, then by leftAt (most recent first)
  const sortedHistory = [...history].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    if (!a.isActive && !b.isActive) {
      return new Date(b.leftAt) - new Date(a.leftAt);
    }
    return new Date(a.joinedAt) - new Date(b.joinedAt);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white tracking-tight">Roster History</h3>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Player</th>
                <th className="px-6 py-4 font-semibold">Status / Role</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Left Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedHistory.map((member, idx) => (
                <tr key={`${member.id}-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{member.username}</div>
                        <div className="text-xs text-slate-500 font-mono">UID: {member.inGameUid}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        member.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {member.isActive ? 'Active' : 'Past Member'}
                      </span>
                      {member.isActive && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {formatDate(member.joinedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!member.isActive ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                        {formatDate(member.leftAt)}
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">Present</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
