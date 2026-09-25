import React from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { playerDashboardData } from '../../data/mockDashboardData';

export function DashboardWelcome() {
  const { user } = useAuthStore();
  const name = user?.username || playerDashboardData.player.name || 'Player';
  
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
        {greeting}, {name.trim()} 👋
      </h1>
      <p className="text-slate-400 text-lg">
        Here's what's happening with your competitions.
      </p>
    </div>
  );
}
