import React, { useState } from 'react';
import { 
  X, ShieldAlert, CheckCircle, Activity, ExternalLink, Mail, Phone,
  MapPin, Calendar, Monitor, History, Settings, Shield, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SuspendUserDialog } from './SuspendUserDialog';
import { ReinstateUserDialog } from './ReinstateUserDialog';
import { ManageRolesDialog } from './ManageRolesDialog';

export function UserDetailDrawer({ userId, users, onClose, onStatusChange, onRolesChange }) {
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isReinstateDialogOpen, setIsReinstateDialogOpen] = useState(false);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);

  if (!userId) return null;

  const user = users.find(u => u.id === userId);
  if (!user) return null;

  const handleStatusUpdate = (id, status, reason = null) => {
    onStatusChange(id, status, reason);
    setIsSuspendDialogOpen(false);
    setIsReinstateDialogOpen(false);
  };

  const handleRolesUpdate = (id, newRoles) => {
    onRolesChange(id, newRoles);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-2xl bg-[#071426] h-full shadow-2xl border-l border-white/10 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/50">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              User Details
            </h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8">
            
            {/* 1. Identity & Core Status */}
            <div className="flex items-start gap-4">
              <img src={user.avatarUrl} alt={user.displayName} className="w-20 h-20 rounded-2xl bg-slate-800 object-cover border border-slate-700 shadow-xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">{user.displayName}</h1>
                    <p className="text-sm text-slate-400 font-mono mt-1">@{user.username} • {user.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                      ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        'bg-red-500/10 text-red-400 border-red-500/20'}
                    `}>
                      {user.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {user.email.replace(/(.{2})(.*)(?=@)/, '$1***')}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {user.mobile.substring(0, 6)}****{user.mobile.substring(user.mobile.length - 2)}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {user.country}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Joined {new Date(user.registeredAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Suspension Details (If Suspended) */}
            {user.status === 'Suspended' && user.suspension && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Account Suspended</h3>
                  <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm mt-2">
                    <div className="text-slate-400">Reason:</div>
                    <div className="text-white font-medium">{user.suspension.reason}</div>
                    <div className="text-slate-400">Suspended At:</div>
                    <div className="text-white font-medium">{new Date(user.suspension.suspendedAt).toLocaleString()}</div>
                    <div className="text-slate-400">Suspended By:</div>
                    <div className="text-white font-medium">{user.suspension.suspendedBy}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Overview */}
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                    <span className="text-sm text-slate-400">Primary Game</span>
                    <span className="text-sm font-medium text-white">{user.primaryGame}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                    <span className="text-sm text-slate-400">Visibility</span>
                    <span className="text-sm font-medium text-white">{user.profileVisibility}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Last Active</span>
                    <span className="text-sm font-medium text-white">{new Date(user.lastActiveAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Roles & Access */}
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roles & Access</h3>
                  <button 
                    onClick={() => setIsRolesDialogOpen(true)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Manage
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[150px] pr-1">
                  {user.roles.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No roles assigned.</p>
                  ) : (
                    user.roles.map((role, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            role.role === 'Super Admin' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                          }`}>
                            {role.role}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{role.scope}</span>
                        </div>
                        {role.organizationName && (
                          <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1">
                            <span className="text-slate-500">Org:</span> {role.organizationName}
                          </p>
                        )}
                        {role.tournamentName && (
                          <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1">
                            <span className="text-slate-500">Event:</span> {role.tournamentName}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Organizations */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Organizations</h3>
              {user.organizations.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Not a member of any organization.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.organizations.map((org, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{org.name}</span>
                      <Link to={`/organizations/${org.id}`} className="text-slate-400 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Game Accounts */}
            {user.linkedGameAccounts && user.linkedGameAccounts.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Linked Game Accounts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.linkedGameAccounts.map((account, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{account.game}</span>
                        {account.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <span className="text-[10px] text-amber-500 border border-amber-500/50 px-1.5 py-0.5 rounded">Unverified</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-white mt-2">{account.username}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">UID: {account.uid.replace(/(.{2})(.*)(.{2})/, '$1***$3')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sessions & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {user.sessions?.map(session => (
                    <div key={session.id} className="flex gap-3 items-start border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                      <Monitor className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{session.device}</p>
                        <p className="text-xs text-slate-400">{session.location}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Active: {new Date(session.lastActive).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {user.activity?.map(act => (
                    <div key={act.id} className="flex gap-3 items-start border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                      <History className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{act.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(act.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suspension History */}
            {user.suspensionHistory && user.suspensionHistory.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Suspension History</h3>
                <div className="space-y-4">
                  {user.suspensionHistory.map((sh, idx) => (
                    <div key={idx} className="border-l-2 border-slate-700 pl-4 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400">{new Date(sh.suspendedAt).toLocaleDateString()}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">by {sh.suspendedBy}</span>
                      </div>
                      <p className="text-sm text-slate-300">Suspended: <span className="text-white">{sh.reason}</span></p>
                      {sh.reinstatedAt && (
                        <p className="text-xs text-emerald-400 mt-1">Reinstated: {new Date(sh.reinstatedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-between items-center shrink-0">
            <Link 
              to={`/profile/${user.username}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Public Profile <ExternalLink className="w-4 h-4" />
            </Link>
            
            {user.status === 'Suspended' ? (
              <button 
                onClick={() => setIsReinstateDialogOpen(true)}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Reinstate User
              </button>
            ) : (
              <button 
                onClick={() => setIsSuspendDialogOpen(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Suspend User
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <SuspendUserDialog 
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        user={user}
        onConfirm={handleStatusUpdate}
      />

      <ReinstateUserDialog 
        isOpen={isReinstateDialogOpen}
        onClose={() => setIsReinstateDialogOpen(false)}
        user={user}
        onConfirm={handleStatusUpdate}
      />

      <ManageRolesDialog
        isOpen={isRolesDialogOpen}
        onClose={() => setIsRolesDialogOpen(false)}
        user={user}
        onConfirm={handleRolesUpdate}
      />
    </AnimatePresence>
  );
}
