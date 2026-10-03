import { useState } from 'react';
import { X, History, User, Clock, ArrowRight } from 'lucide-react';
import { useAuditLogsQuery } from '../api/useOrganizationQueries';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric'
  }).format(date);
};

export function OrganizationAuditDrawer({ isOpen, onClose, orgId }) {
  const { data: logs, isLoading, isError } = useAuditLogsQuery(orgId);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Audit Logs</h2>
              <p className="text-sm text-slate-400">History of membership events</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              Failed to load audit logs.
            </div>
          )}

          {!isLoading && !isError && logs && logs.length === 0 && (
            <div className="text-center py-10">
              <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No events recorded yet.</p>
            </div>
          )}

          {!isLoading && !isError && logs && logs.length > 0 && (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {logs.map((log) => {
                
                let message = '';
                let details = null;

                switch (log.eventType) {
                  case 'ROLE_CHANGED':
                    const oldDisplay = log.metadata?.old_custom_role_name ? `${log.metadata.old_custom_role_name} (${log.metadata.old_role})` : (log.metadata?.old_role || 'None');
                    const newDisplay = log.metadata?.new_custom_role_name ? `${log.metadata.new_custom_role_name} (${log.metadata.new_role})` : log.metadata?.new_role;
                    message = <span>Changed role for <span className="font-semibold text-white">{log.targetUsername}</span></span>;
                    details = (
                      <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 truncate max-w-[100px]">{oldDisplay}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                        <span className="text-emerald-400 font-medium truncate max-w-[100px]">{newDisplay}</span>
                      </div>
                    );
                    break;
                  case 'INVITATION_SENT':
                    const target = log.targetUsername ? log.targetUsername : log.metadata?.email;
                    message = <span>Invited <span className="font-semibold text-white">{target}</span> as <span className="text-blue-400">{log.metadata?.role}</span></span>;
                    break;
                  case 'INVITATION_ACCEPTED':
                    message = <span>Accepted invitation</span>;
                    break;
                  case 'MEMBER_REMOVED':
                    message = <span>Removed member <span className="font-semibold text-white">{log.targetUsername}</span></span>;
                    break;
                  case 'MEMBER_LEFT':
                    message = <span>Left the organization</span>;
                    break;
                  case 'OWNERSHIP_TRANSFERRED':
                    message = <span>Transferred ownership to <span className="font-semibold text-white">{log.targetUsername}</span></span>;
                    break;
                  default:
                    message = <span>Performed an action</span>;
                }
                
                return (
                  <div key={log.logId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-900 text-slate-400 group-[.is-active]:text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Clock className="w-4 h-4" />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-400">{log.actorUsername || 'System'}</span>
                        <span className="text-[10px] text-slate-500">{formatDate(log.changedAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{message}</p>
                      {details}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
