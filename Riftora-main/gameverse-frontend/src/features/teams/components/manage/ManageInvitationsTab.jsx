import React, { useState } from 'react';
import { Mail, X, UserPlus, Search, Link as LinkIcon, Copy, RefreshCw } from 'lucide-react';
import { useInvitePlayer, useRegenerateInviteCode } from '../../api/useTeamQueries';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

export function ManageInvitationsTab({ team, onUpdateInvitations, onToast }) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingInvites = team.invitations || [];

  const invitePlayer = useInvitePlayer(team.teamId);
  const regenerateCode = useRegenerateInviteCode(team.teamId);

  const inviteLink = team.inviteCode ? `${window.location.origin}/invite/${team.inviteCode}` : '';

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      onToast("Invite link copied to clipboard!", false);
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateCode.mutateAsync();
      onToast("Invite link regenerated.", false);
    } catch (err) {
      onToast("Failed to regenerate invite link.", true);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await invitePlayer.mutateAsync({ invitee: username.trim(), role: 'player' });
      onToast("Invitation sent successfully.", false);
      setUsername('');
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to send invitation.", true);
    }
  };

  const handleCancelInvite = (inviteId) => {
    const updated = pendingInvites.filter(inv => inv.id !== inviteId);
    onUpdateInvitations(updated);
    onToast("Invitation cancelled.", false);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      
      <section>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Invite Player</h3>
              <p className="text-sm text-slate-400">Send an invitation to join {team.teamName}</p>
            </div>
          </div>
          
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Enter player username..." 
                className="pl-10 bg-slate-950 border-slate-700 h-11"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              disabled={invitePlayer.isPending || !username.trim()}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              {invitePlayer.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </div>
      </section>

      <section>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <LinkIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Share Invite Link</h3>
              <p className="text-sm text-slate-400">Anyone with this link can join the team until it is full.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Input 
                readOnly
                value={inviteLink || 'No invite link available'} 
                className="bg-slate-950 border-slate-700 h-11 text-slate-300 font-mono text-sm"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={handleCopyLink}
                disabled={!inviteLink}
                className="h-11 flex-1 sm:flex-none px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700"
              >
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button 
                onClick={handleRegenerate}
                disabled={regenerateCode.isPending}
                className="h-11 flex-1 sm:flex-none px-4 bg-slate-800 hover:bg-slate-700 text-red-400 font-medium border border-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${regenerateCode.isPending ? 'animate-spin' : ''}`} /> Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white tracking-tight uppercase mb-4">Pending Invitations</h3>
        
        {pendingInvites.length === 0 ? (
          <div className="w-full h-40 border border-slate-800 bg-slate-900/30 rounded-xl flex flex-col items-center justify-center text-center p-4">
            <Mail className="w-8 h-8 text-slate-600 mb-3" />
            <p className="text-slate-400">No pending invitations.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvites.map(inv => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-slate-400">?</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{inv.invitedEmail || inv.invitedUserId}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>Expires {formatDate(inv.expiresAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-amber-400">{inv.status}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCancelInvite(inv.id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-700 w-full sm:w-auto justify-center"
                >
                  <X className="w-4 h-4" /> Cancel Invitation
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
