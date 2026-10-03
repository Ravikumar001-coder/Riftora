import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnreadNotificationCount } from '../api/useNotificationQueries';
import { useStompStore } from '../../../store/stompStore';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';

export function NotificationBell({ className = "-m-2.5 p-2.5 text-slate-400 hover:text-white relative transition-colors" }) {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const subscribe = useStompStore(state => state.subscribe);
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user) {
      subscribe('/user/queue/notifications', (message) => {
        // Invalidate queries to fetch the new notification and update unread count
        queryClient.invalidateQueries(['notifications']);
      });
    }
  }, [user, subscribe, queryClient]);

  return (
    <Link to="/notifications" className={className}>
      <span className="sr-only">View notifications</span>
      <Bell className="h-6 w-6" aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full ring-2 ring-slate-950">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
