import React, { useState } from 'react';
import { Bell, Check, X, Users, Loader2, Megaphone, Trash2, CheckCircle2 } from 'lucide-react';
import { useGetUserInvitations, useAcceptInvitation, useDeclineInvitation } from '../../../features/teams/api/useTeamQueries';
import { useNotifications, useMarkNotificationRead, useDeleteNotification, useMarkAllNotificationsRead } from '../../../features/notifications/api/useNotificationQueries';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [unreadOnly, setUnreadOnly] = useState(false);
  
  const { data: invitations, isLoading: isLoadingInvites } = useGetUserInvitations();
  const acceptMutation = useAcceptInvitation();
  const declineMutation = useDeclineInvitation();

  const { data: notificationsData, isLoading: isLoadingNotifs } = useNotifications(unreadOnly, 0, 50);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = notificationsData?.content || [];

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
            <p className="text-sm text-slate-400">Manage your system alerts and team invitations.</p>
          </div>
        </div>
        
        {activeTab === 'alerts' && notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm border border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === 'alerts' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          System Alerts
          {activeTab === 'alerts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          className={`pb-4 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'invites' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          Team Invitations
          {invitations?.length > 0 && (
            <span className="bg-amber-500/20 text-amber-400 py-0.5 px-2 rounded-full text-[10px] font-bold">
              {invitations.length}
            </span>
          )}
          {activeTab === 'invites' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" />
          )}
        </button>
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox" 
              id="unreadOnly" 
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="unreadOnly" className="text-sm text-slate-300">Show unread only</label>
          </div>
          
          {isLoadingNotifs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">All caught up!</h3>
              <p className="text-slate-500">You don't have any {unreadOnly ? 'unread ' : ''}notifications right now.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.notificationId} 
                className={`rounded-xl border p-5 flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-800/60 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]'}`}
              >
                <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Megaphone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className={`text-sm font-medium ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1" dangerouslySetInnerHTML={{ __html: notif.body }}></p>
                  
                  {notif.actionUrl && (
                    <a href={notif.actionUrl} className="inline-block mt-3 text-xs font-medium text-blue-400 hover:text-blue-300">
                      View details &rarr;
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markReadMutation.mutate(notif.notificationId)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMutation.mutate(notif.notificationId)}
                    title="Delete notification"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'invites' && (
        <div className="space-y-4">
          {isLoadingInvites ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (!invitations || invitations.length === 0) ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No invitations</h3>
              <p className="text-slate-500">You don't have any pending team invitations right now.</p>
            </div>
          ) : (
            invitations.map((invite) => (
              <div key={invite.inviteId} className="bg-slate-900/80 rounded-xl border border-slate-700/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Team Invitation</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      <span className="text-slate-300 font-medium">{invite.invitedByName}</span> invited you to join <span className="text-blue-400 font-medium">[{invite.teamTag}] {invite.teamName}</span> as a {invite.role}.
                    </p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{invite.gameCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => declineMutation.mutate(invite.inviteId)}
                    disabled={declineMutation.isPending || acceptMutation.isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" /> Decline
                  </button>
                  <button
                    onClick={() => acceptMutation.mutate(invite.inviteId)}
                    disabled={acceptMutation.isPending || declineMutation.isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
