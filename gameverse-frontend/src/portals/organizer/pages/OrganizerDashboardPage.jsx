import React from 'react';
import { organizerDashboardData } from '../data/mockOrganizerData';
import { DashboardWelcome } from '../components/dashboard/DashboardWelcome';
import { OrganizerStatsGrid } from '../components/dashboard/OrganizerStatsGrid';
import { NextTournamentCard } from '../components/dashboard/NextTournamentCard';
import { ActionRequiredPanel } from '../components/dashboard/ActionRequiredPanel';
import { ActiveTournaments } from '../components/dashboard/ActiveTournaments';
import { UpcomingSchedule } from '../components/dashboard/UpcomingSchedule';
import { RegistrationOverview } from '../components/dashboard/RegistrationOverview';
import { OrganizationPerformance } from '../components/dashboard/OrganizationPerformance';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { QuickActions } from '../components/dashboard/QuickActions';

export function OrganizerDashboardPage() {
  const { 
    organization, 
    stats, 
    nextTournament, 
    actionRequired, 
    activeTournaments, 
    upcomingSchedule,
    registrationOverview,
    performance,
    activity
  } = organizerDashboardData;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
      
      {/* 1. Greeting & Context */}
      <DashboardWelcome organization={organization} />

      {/* 2. Top Level KPIs */}
      <OrganizerStatsGrid stats={stats} />
      
      {/* 3. Primary Operations Grid (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Immediate Operations (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[400px]">
            <NextTournamentCard tournament={nextTournament} />
            <ActionRequiredPanel items={actionRequired} />
          </div>
          
          <ActiveTournaments tournaments={activeTournaments} />
          
          <QuickActions role={organization.role} orgSlug={organization.slug} />
        </div>
        
        {/* Right Column - Schedule & Context (1/3 width) */}
        <div className="xl:col-span-1 space-y-6">
          <UpcomingSchedule schedule={upcomingSchedule} />
          <RegistrationOverview overview={registrationOverview} />
          <OrganizationPerformance performance={performance} orgSlug={organization.slug} />
          <ActivityFeed activities={activity} />
        </div>
      </div>

    </div>
  );
}
