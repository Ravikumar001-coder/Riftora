import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useDisbandTeam } from '../../api/useTeamQueries';

export function ManageSettingsTab({ team, onUpdateTeam, onToast }) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isVisibilityLoading, setIsVisibilityLoading] = useState(false);
  const disbandTeam = useDisbandTeam(team.teamId);

  const isPublic = team.visibility !== 'private';

  const toggleVisibility = () => {
    setIsVisibilityLoading(true);
    setTimeout(() => {
      onUpdateTeam({ visibility: isPublic ? 'private' : 'public' });
      onToast(`Team visibility changed to ${isPublic ? 'Private' : 'Public'}.`, false);
      setIsVisibilityLoading(false);
    }, 500);
  };

  const handleArchive = async () => {
    try {
      await disbandTeam.mutateAsync();
      onToast("Team archived successfully.", false);
      setShowArchiveDialog(false);
    } catch (e) {
      onToast("Failed to archive team.", true);
    }
  };

  return (
    <div className="space-y-8">
      
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Team Settings</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-200">Public Visibility</h4>
              {isPublic ? (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Eye className="w-3 h-3" /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
                  <EyeOff className="w-3 h-3" /> Private
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {isPublic 
                ? "Your team can be found by anyone and viewed on the public website."
                : "Your team is hidden from search and public listings."}
            </p>
          </div>
          
          <button 
            onClick={toggleVisibility}
            disabled={isVisibilityLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors border ${
              isPublic 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
            }`}
          >
            {isVisibilityLoading ? 'Updating...' : (isPublic ? 'Make Private' : 'Make Public')}
          </button>
        </div>
      </section>

      <section className="bg-slate-900/50 border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <h3 className="text-lg font-bold text-red-500 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-950/20 border border-red-900/30 rounded-lg gap-4">
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Archive Team</h4>
            <p className="text-sm text-slate-500 max-w-lg">
              Archiving this team will remove it from your active team list. Your existing team information will remain available in the frontend mock state.
            </p>
          </div>
          
          <button 
            onClick={() => setShowArchiveDialog(true)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-medium rounded-lg whitespace-nowrap transition-colors border border-red-900/50"
          >
            Archive Team
          </button>
        </div>
      </section>

      {/* Archive Confirmation Dialog */}
      {showArchiveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowArchiveDialog(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Archive {team.teamName}?</h3>
            <p className="text-slate-400 text-sm mb-6">
              This will remove the team from your active team list. Your existing team information will remain available in the frontend mock state.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowArchiveDialog(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleArchive}
                disabled={disbandTeam.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                {disbandTeam.isPending ? 'Archiving...' : 'Archive Team'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
