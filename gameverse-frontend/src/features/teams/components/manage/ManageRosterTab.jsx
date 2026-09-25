import React, { useState } from 'react';
import { User, MoreHorizontal, ArrowUpCircle, UserMinus, Shield, Plus, Copy, Check, CheckCircle2, AlertTriangle, Link, Search } from 'lucide-react';
import { useRemovePlayer, useTransferCaptaincy, useUpdateMemberRole } from '../../api/useTeamQueries';

export function ManageRosterTab({ team, onUpdateRoster, onToast }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); // id of player whose dropdown is open
  const [showRemoveDialog, setShowRemoveDialog] = useState(null); // player obj to remove
  const [showInviteModal, setShowInviteModal] = useState(false); // boolean
  const [showCaptaincyModal, setShowCaptaincyModal] = useState(null); // player obj to promote
  const [showSetRoleModal, setShowSetRoleModal] = useState(null); // player obj to set role
  const [showSwapModal, setShowSwapModal] = useState(null); // substitute player obj to swap
  const [copiedUid, setCopiedUid] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New selected role for the Set Role Modal
  const [selectedInGameRole, setSelectedInGameRole] = useState('');
  // New selected main player for the Swap Modal
  const [selectedMainToSwap, setSelectedMainToSwap] = useState('');

  const mainPlayers = team.roster?.filter(r => r.role === 'player' || r.role === 'captain') || [];
  const substitutes = team.roster?.filter(r => r.role === 'substitute') || [];

  const maxRoster = team.gameId === 'bgmi' || team.gameId === 'valorant' || team.gameId === 'pokemon-unite' ? 5 : (team.gameId === 'free-fire-max' ? 5 : 5);
  const maxSubstitutes = team.gameId === 'free-fire-max' ? 7 : (team.gameId === 'bgmi' ? 1 : 2);

  const isMainFull = mainPlayers.length >= maxRoster;
  const isSubFull = substitutes.length >= maxSubstitutes;

  const emptyMainSlots = Math.max(0, maxRoster - mainPlayers.length);
  const emptySubSlots = Math.max(0, maxSubstitutes - substitutes.length);

  const removePlayer = useRemovePlayer(team.teamId);
  const transferCaptaincy = useTransferCaptaincy(team.teamId);
  const updateRole = useUpdateMemberRole(team.teamId);

  const handleAction = async (playerId, action, payload = null) => {
    try {
      if (action === 'remove') {
        await removePlayer.mutateAsync(playerId);
        onToast("Player removed from the roster.", false);
      } else if (action === 'promote_captain') {
        await transferCaptaincy.mutateAsync(playerId);
        onToast("Captaincy transferred successfully.", false);
      } else if (action === 'move_sub') {
        if (isSubFull) {
          onToast("Substitute roster is full.", true);
          return;
        }
        await updateRole.mutateAsync({ memberId: playerId, data: { role: 'substitute' } });
        onToast("Player moved to substitutes.", false);
      } else if (action === 'move_main') {
        if (isMainFull) {
          onToast("Main roster is full. Use Swap instead.", true);
          return;
        }
        await updateRole.mutateAsync({ memberId: playerId, data: { role: 'player' } });
        onToast("Player moved to main roster.", false);
      } else if (action === 'set_role') {
        // Backend doesn't persist inGameRole yet, but API accepts it
        const player = team.roster.find(p => p.id === playerId);
        await updateRole.mutateAsync({ memberId: playerId, data: { role: player.role, inGameRole: payload } });
        onToast(`Role updated to ${payload || 'None'}.`, false);
      } else if (action === 'swap') {
        await updateRole.mutateAsync({ memberId: payload, data: { role: 'substitute' } });
        await updateRole.mutateAsync({ memberId: playerId, data: { role: 'player' } });
        onToast("Players swapped successfully.", false);
      }
      setDropdownOpen(null);
    } catch (e) {
      onToast("Failed to perform action.", true);
    }
  };

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'uid') {
        setCopiedUid(text);
        setTimeout(() => setCopiedUid(null), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const RosterItem = ({ player, isMain }) => (
    <div className="flex flex-col p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors gap-3 relative min-h-[98px]">
      {/* Header Row: Avatar, Info, Actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-slate-400" />
            </div>
            {/* Status Dot */}
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              player.status === 'online' ? 'bg-green-500' : 
              player.status === 'in-game' ? 'bg-blue-500' : 'bg-slate-500'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-base">{player.username || "Player"}</span>
              {player.role === 'captain' && (
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Captain
                </span>
              )}
              {player.inGameRole && (
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {player.inGameRole}
                </span>
              )}
            </div>
            
            {/* Line 2: UID & Status Text */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {player.uid && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                  <span className="font-mono">UID: {player.uid}</span>
                  <button 
                    onClick={() => copyToClipboard(player.uid, 'uid')}
                    className="hover:text-white transition-colors"
                    title="Copy UID"
                  >
                    {copiedUid === player.uid ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              <span className="text-xs text-slate-500 capitalize">
                {player.status === 'in-game' ? 'In-Game' : (player.status || 'Offline')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="relative z-10">
          <button 
            onClick={() => setDropdownOpen(dropdownOpen === player.id ? null : player.id)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {dropdownOpen === player.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(null)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                
                {/* Set Role */}
                <button 
                  onClick={() => {
                    setDropdownOpen(null);
                    setSelectedInGameRole(player.inGameRole || '');
                    setShowSetRoleModal(player);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4" /> Set In-Game Role
                </button>

                {player.role !== 'captain' && (
                  <button 
                    onClick={() => {
                      setDropdownOpen(null);
                      setShowCaptaincyModal(player);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Shield className="w-4 h-4" /> Transfer Captaincy
                  </button>
                )}

                {player.role === 'player' && (
                  <button 
                    onClick={() => handleAction(player.id, 'move_sub')}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ArrowUpCircle className="w-4 h-4 rotate-180" /> Move to Substitute
                  </button>
                )}

                {player.role === 'substitute' && !isMainFull && (
                  <button 
                    onClick={() => handleAction(player.id, 'move_main')}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Move to Main
                  </button>
                )}

                {/* Emergency Swap */}
                {player.role === 'substitute' && isMainFull && (
                  <button 
                    onClick={() => {
                      setDropdownOpen(null);
                      setSelectedMainToSwap('');
                      setShowSwapModal(player);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Swap with Main Player
                  </button>
                )}

                {player.role !== 'captain' && (
                  <>
                    <div className="h-px bg-slate-800 my-1 mx-2" />
                    <button 
                      onClick={() => {
                        setDropdownOpen(null);
                        setShowRemoveDialog(player);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" /> Remove Player
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const EmptySlot = ({ label }) => (
    <button 
      onClick={() => setShowInviteModal(true)}
      className="flex flex-col items-center justify-center p-6 bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group min-h-[98px]"
    >
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-400 font-medium">
        <Plus className="w-5 h-5" />
        {label}
      </div>
    </button>
  );

  return (
    <div className="space-y-8">
      
      {/* Tournament Eligibility Bar */}
      {isMainFull ? (
        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-green-400">Roster ready for competitive registration.</p>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-amber-400">
            Roster incomplete ({mainPlayers.length}/{maxRoster}). Add {maxRoster - mainPlayers.length} more main player{maxRoster - mainPlayers.length > 1 ? 's' : ''} to unlock tournament registrations.
          </p>
        </div>
      )}

      {/* Main Roster Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight uppercase">Main Roster</h3>
          <span className="text-sm font-semibold text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
            {mainPlayers.length} / {maxRoster} Main Players
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainPlayers.map(p => <RosterItem key={p.id} player={p} isMain={true} />)}
          {/* Render empty slots */}
          {Array.from({ length: emptyMainSlots }).map((_, i) => (
            <EmptySlot key={`empty-main-${i}`} label="Add Player" />
          ))}
        </div>
      </section>

      {/* Substitutes Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight uppercase">Substitutes</h3>
          <span className="text-sm font-semibold text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
            {substitutes.length} / {maxSubstitutes}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {substitutes.map(p => <RosterItem key={p.id} player={p} isMain={false} />)}
          {/* Render empty slots */}
          {Array.from({ length: emptySubSlots }).map((_, i) => (
            <EmptySlot key={`empty-sub-${i}`} label="Assign Substitute" />
          ))}
        </div>
      </section>

      {/* MODALS */}

      {/* 1. Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Invite Players</h3>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by Username or UID..." 
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-24 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors">
                Search
              </button>
            </div>

            {/* Invite Link */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Share Invite Link</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    readOnly
                    value={`https://riftora.gg/invite/${team.teamSlug}/x8j9Lp`}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <button 
                  onClick={() => copyToClipboard(`https://riftora.gg/invite/${team.teamSlug}/x8j9Lp`, 'link')}
                  className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center min-w-[44px]"
                  title="Copy Invite Link"
                >
                  {copiedLink ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Remove Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRemoveDialog(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <UserMinus className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Remove Player?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Remove <strong>{showRemoveDialog.username}</strong> from {team.teamName}? They will no longer be part of the team roster.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowRemoveDialog(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleAction(showRemoveDialog.id, 'remove');
                  setShowRemoveDialog(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Transfer Captaincy Modal */}
      {showCaptaincyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowCaptaincyModal(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Transfer Captaincy?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to promote <strong>{showCaptaincyModal.username}</strong> to Captain? You will immediately lose management rights for this team.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCaptaincyModal(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleAction(showCaptaincyModal.id, 'promote_captain');
                  setShowCaptaincyModal(null);
                }}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Set In-Game Role Modal */}
      {showSetRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSetRoleModal(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Set In-Game Role</h3>
            <p className="text-slate-400 text-sm mb-4">
              Select a specialized role for <strong>{showSetRoleModal.username}</strong>.
            </p>
            <select
              value={selectedInGameRole}
              onChange={(e) => setSelectedInGameRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 mb-6"
            >
              <option value="">No Role Assigned</option>
              <option value="IGL">In-Game Leader (IGL)</option>
              <option value="Assaulter">Assaulter / Rusher</option>
              <option value="Sniper">Sniper</option>
              <option value="Support">Support / Medic</option>
              <option value="Scout">Scout</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowSetRoleModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleAction(showSetRoleModal.id, 'set_role', selectedInGameRole);
                  setShowSetRoleModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors border border-blue-500"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Emergency Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSwapModal(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Swap with Main Player</h3>
            <p className="text-slate-400 text-sm mb-4">
              Select a main roster player to bench in exchange for <strong>{showSwapModal.username}</strong>.
            </p>
            <select
              value={selectedMainToSwap}
              onChange={(e) => setSelectedMainToSwap(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 mb-6"
            >
              <option value="" disabled>Select player to bench...</option>
              {mainPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.username} {p.inGameRole ? `(${p.inGameRole})` : ''}</option>
              ))}
            </select>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowSwapModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedMainToSwap}
                onClick={() => {
                  handleAction(showSwapModal.id, 'swap', selectedMainToSwap);
                  setShowSwapModal(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors border border-amber-500"
              >
                Swap Players
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
