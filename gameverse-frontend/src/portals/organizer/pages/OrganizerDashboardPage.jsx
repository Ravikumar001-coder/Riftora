import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';

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

import { useAuthStore } from '../../../store/authStore';
import { useDashboardStatsQuery, useOrganizationQuery } from '../../../features/organizations/api/useOrganizationQueries';

export function OrganizerDashboardPage() {
  const { orgId, hasActiveOrg } = useOutletContext();
  const user = useAuthStore((state) => state.user);
  const { data: orgData } = useOrganizationQuery(orgId);
  const { data: dynamicStats } = useDashboardStatsQuery(orgId);

  const organization = orgData ? {
    name: orgData.org_name,
    slug: orgData.org_slug,
    logoUrl: orgData.logo_url,
    role: user?.orgRoles?.[0]?.role?.replace('org_', 'Org ') || 'Org Owner',
    totalTournaments: dynamicStats?.performance?.tournaments || 0,
    staffCount: orgData.member_count || 0,
    totalParticipants: dynamicStats?.performance?.total_participants || 0
  } : null;

  const stats = dynamicStats?.stats ? {
    activeTournaments: dynamicStats.stats.active_tournaments,
    upcomingTournaments: dynamicStats.stats.upcoming_tournaments,
    draftTournaments: dynamicStats.stats.draft_tournaments,
    pendingRegistrations: dynamicStats.stats.pending_registrations,
    liveEvents: dynamicStats.stats.live_events
  } : {
    activeTournaments: 0,
    upcomingTournaments: 0,
    draftTournaments: 0,
    pendingRegistrations: 0,
    liveEvents: 0
  };

  const nextTournament = dynamicStats?.next_tournament ? {
    id: dynamicStats.next_tournament.id,
    title: dynamicStats.next_tournament.title,
    game: dynamicStats.next_tournament.game,
    format: dynamicStats.next_tournament.format,
    maxTeams: dynamicStats.next_tournament.max_teams,
    registeredTeams: dynamicStats.next_tournament.registered_teams,
    status: dynamicStats.next_tournament.status,
    startAt: dynamicStats.next_tournament.start_at,
    isLive: dynamicStats.next_tournament.is_live
  } : null;

  const activeTournaments = dynamicStats?.active_tournaments ? dynamicStats.active_tournaments.map(t => ({
    id: t.id,
    name: t.name,
    status: t.status,
    currentTeams: t.current_teams,
    maxTeams: t.max_teams,
    nextAction: t.next_action,
    link: t.link
  })) : [];

  const actionRequired = dynamicStats?.action_required || [];
  const upcomingSchedule = dynamicStats?.upcoming_schedule || [];
  const registrationOverview = dynamicStats?.registration_overview || null;
  const performance = dynamicStats?.performance || null;
  const activity = dynamicStats?.activity || [];

  if (!hasActiveOrg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20 border border-blue-500/20">
          <Building2 className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to Riftora</h1>
        <p className="text-slate-400 text-lg max-w-lg mb-8 leading-relaxed">
          You don't have an active organization yet. Create your first organization to access the tournament management tools, analytics, and staff controls.
        </p>
        <Link
          to="/onboarding/organizer"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-5 h-5" />
          Create Organization
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
      
      {/* 1. Greeting & Context */}
      <DashboardWelcome organization={organization} />

      {/* 2. Top Level KPIs */}
      <OrganizerStatsGrid stats={stats} />
      
      {/* 3. Main Dashboard Grid (2/3 and 1/3 split) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-start">
        
        {/* Left Column - Main Content (Spans 2 cols on XL screens) */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          
          {/* Top Row of Left Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NextTournamentCard tournament={nextTournament} />
            <ActionRequiredPanel items={actionRequired} />
          </div>

          {/* Full Width of Left Column */}
          <ActiveTournaments tournaments={activeTournaments} orgSlug={organization?.slug || ''} />
          
          <QuickActions role={organization?.role || 'Org Owner'} orgSlug={organization?.slug || ''} />
          
        </div>
        
        {/* Right Column - Sidebar Content (Spans 1 col on XL screens) */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          <UpcomingSchedule schedule={upcomingSchedule} />
          <RegistrationOverview overview={registrationOverview} />
          <OrganizationPerformance performance={performance} orgSlug={organization?.slug || ''} />
          <ActivityFeed activities={activity} />
        </div>

      </div>

    </div>
  );
}
