import React from 'react';
import { playerDashboardData } from '../data/mockDashboardData';
import { DashboardWelcome } from '../components/dashboard/DashboardWelcome';
import { PlayerSummaryCard } from '../components/dashboard/PlayerSummaryCard';
import { DashboardStatsGrid } from '../components/dashboard/DashboardStatsGrid';
import { NextMatchCard } from '../components/dashboard/NextMatchCard';
import { MyTeamCard } from '../components/dashboard/MyTeamCard';
import { UpcomingMatches } from '../components/dashboard/UpcomingMatches';
import { MyTournaments } from '../components/dashboard/MyTournaments';
import { RecentResults } from '../components/dashboard/RecentResults';
import { PerformanceOverview } from '../components/dashboard/PerformanceOverview';
import { RecommendedTournaments } from '../components/dashboard/RecommendedTournaments';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { QuickActions } from '../components/dashboard/QuickActions';

export function DashboardPage() {
  const { 
    player, 
    stats, 
    nextMatch, 
    myTeam, 
    upcomingMatches, 
    myTournaments,
    recentResults,
    performance,
    recommendations,
    activity
  } = playerDashboardData;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-12 w-full max-w-7xl mx-auto">
      
      {/* 1. Greeting */}
      <DashboardWelcome />
      
      {/* 2. Player Profile Summary */}
      <PlayerSummaryCard player={player} />
      
      {/* 3. KPI Statistics */}
      <DashboardStatsGrid stats={stats} />
      
      {/* 4. Desktop 2-column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Column (2/3 width on xl) */}
        <div className="xl:col-span-2 flex flex-col">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-8 mb-8">
            <div className="xl:hidden">
              {/* On tablet/small-desktop, show My Team here to balance height */}
              <MyTeamCard team={myTeam} />
            </div>
            <NextMatchCard match={nextMatch} />
          </div>

          <UpcomingMatches matches={upcomingMatches} />
          
          <MyTournaments tournaments={myTournaments} />
          
          <PerformanceOverview performance={performance} />

          <div className="hidden xl:block">
            <RecommendedTournaments recommendations={recommendations} />
          </div>

        </div>

        {/* Side Column (1/3 width on xl) */}
        <div className="flex flex-col gap-8">
          
          <div className="hidden xl:block">
            <MyTeamCard team={myTeam} />
          </div>

          <div className="xl:hidden">
             <RecommendedTournaments recommendations={recommendations} />
          </div>

          <RecentResults results={recentResults} />
          
          <ActivityFeed activities={activity} />
          
          <QuickActions />

        </div>

      </div>
    </div>
  );
}
