import React, { useState } from 'react';
import { Key, Smartphone, Monitor, Trash2, AlertTriangle, X, LogOut, CheckCircle2 } from 'lucide-react';
import { useSessions, useTerminateSession, useTerminateOtherSessions } from '../../../auth/hooks/useSessionQueries';

function formatDistanceToNow(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " seconds";
}

export function SecurityTab({ user, onToast }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const terminateSessionMutation = useTerminateSession();
  const terminateOtherSessionsMutation = useTerminateOtherSessions();

  const handlePasswordChange = () => {
    onToast("Password management is not connected to a backend.", true);
  };

  const handle2FASetup = () => {
    onToast("2FA setup is not connected to a backend.", true);
  };

  const handleDeleteAccount = () => {
    if (deleteInput === 'DELETE') {
      setShowDeleteModal(false);
      setDeleteInput('');
      onToast("Account deletion will be enabled when account-management backend services are connected.", true);
    }
  };

  const handleTerminateSession = (sessionId) => {
    terminateSessionMutation.mutate(sessionId, {
      onSuccess: () => onToast('Session terminated successfully.'),
      onError: () => onToast('Failed to terminate session.', true),
    });
  };

  const handleTerminateOtherSessions = () => {
    // Current session is technically known if we had a way to map the JWT,
    // but the backend handles `currentSessionId` if provided. We can pass a dummy for now 
    // or let backend handle it if we don't have it explicitly.
    // Let's pass the first session that has isCurrent = true (if any).
    const currentSession = sessions?.find(s => s.isCurrent);
    terminateOtherSessionsMutation.mutate(currentSession?.sessionId || 'unknown', {
      onSuccess: () => onToast('Other sessions terminated successfully.'),
      onError: () => onToast('Failed to terminate other sessions.', true),
    });
  };

  const activeSessionsCount = sessions?.length || 0;

  return (
    <div className="space-y-8">
      
      {/* Security */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Security</h3>
        
        <div className="space-y-6">
          
          {/* Password */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                <Key className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Password</p>
                <p className="text-xs text-slate-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button 
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            >
              Change Password
            </button>
          </div>

          {/* 2FA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                <Smartphone className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500">Not configured</p>
              </div>
            </div>
            <button 
              onClick={handle2FASetup}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            >
              Set Up 2FA
            </button>
          </div>

          {/* Sessions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                <Monitor className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Active Sessions</p>
                <p className="text-xs text-slate-500">
                  {sessionsLoading ? 'Loading...' : `${activeSessionsCount} active session${activeSessionsCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowSessionsModal(true)}
              disabled={sessionsLoading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            >
              View Sessions
            </button>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 bg-slate-950/50 border border-red-900/20 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-300">Delete Account</p>
            <p className="text-xs text-slate-500 mt-1">
              Permanently remove your Riftora account, teams, and tournament history.
            </p>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/20 whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSessionsModal(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">Active Sessions</h3>
                <p className="text-sm text-slate-400 mt-1">Manage devices currently logged into your account.</p>
              </div>
              <button onClick={() => setShowSessionsModal(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {sessions?.map((session) => (
                <div key={session.sessionId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                      {session.deviceType === 'Mobile' ? (
                        <Smartphone className="w-6 h-6 text-slate-400" />
                      ) : (
                        <Monitor className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">
                          {session.browser} on {session.deviceType}
                        </p>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {session.location} • {session.ipAddress}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Last active {formatDistanceToNow(new Date(session.lastActiveAt))} ago
                      </p>
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <button 
                      onClick={() => handleTerminateSession(session.sessionId)}
                      disabled={terminateSessionMutation.isPending}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-red-400 text-sm font-medium rounded-lg transition-colors border border-slate-800 hover:border-red-900/50 whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4" /> Revoke
                    </button>
                  )}
                </div>
              ))}

              {sessions?.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No active sessions found.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <button 
                onClick={handleTerminateOtherSessions}
                disabled={terminateOtherSessionsMutation.isPending || activeSessionsCount <= 1}
                className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" /> Logout from all other devices
              </button>
              <button 
                onClick={() => setShowSessionsModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Delete Account?</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-900/50 rounded-lg mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-sm text-red-200">
                  This action is permanent and cannot be undone. All your data will be wiped.
                </p>
              </div>

              <p className="text-sm text-slate-300 mb-2">
                Type <span className="font-mono font-bold text-white bg-slate-800 px-1 rounded">DELETE</span> to confirm.
              </p>
              
              <input 
                type="text" 
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors mb-6 font-mono"
                placeholder="DELETE"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'DELETE'}
                  className={`flex-1 py-2.5 font-medium rounded-lg transition-colors border ${
                    deleteInput === 'DELETE'
                      ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : 'bg-red-600/50 text-white/50 border-red-500/50 cursor-not-allowed'
                  }`}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
