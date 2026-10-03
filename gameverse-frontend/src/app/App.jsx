import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SubdomainApp } from './SubdomainApp';
import { PublicLayout } from '../portals/public/layout/PublicLayout';
import { HomePage } from '../portals/public/pages/HomePage';
import { ExplorePage } from '../portals/public/pages/ExplorePage';
import OrganizationsPage from '../portals/public/pages/OrganizationsPage';
import OrganizationProfilePage from '../portals/public/pages/OrganizationProfilePage';
import { TeamProfilePage } from '../portals/public/pages/TeamProfilePage';
import { PlayerProfilePage } from '../portals/public/pages/PlayerProfilePage';
import { TournamentOverviewPage } from '../portals/public/pages/TournamentOverviewPage';
import { TournamentRegistrationPage } from '../features/tournaments/pages/TournamentRegistrationPage';
import { MyRegistrationPage } from '../features/tournaments/pages/MyRegistrationPage';
import { AuroraBackgroundDemo } from '../components/ui/aurora-background-demo';
import { DocsHomePage } from '../portals/public/pages/docs/DocsHomePage';
import { DocsArticlePage } from '../portals/public/pages/docs/DocsArticlePage';
import { ApiDocumentationPage } from '../portals/public/pages/docs/ApiDocumentationPage';
import { ErrorReferencePage } from '../portals/public/pages/docs/ErrorReferencePage';
import { OverlayDocumentationPage } from '../portals/public/pages/docs/OverlayDocumentationPage';
import { RegisterPage } from '../portals/public/pages/auth/RegisterPage';
import { LoginPage } from '../portals/public/pages/auth/LoginPage';
import { GraphicRenderPage } from '../features/graphics/pages/GraphicRenderPage';
import { VerifyEmailPage } from '../portals/public/pages/auth/VerifyEmailPage';
import { UsernameSetupPage } from '../portals/public/pages/onboarding/UsernameSetupPage';
import { PathSelectionPage } from '../portals/public/pages/onboarding/PathSelectionPage';
import { OrganizerSetupPage } from '../portals/public/pages/onboarding/OrganizerSetupPage';
import { PlayerSetupPage } from '../portals/public/pages/onboarding/PlayerSetupPage';
import JoinOrganizationPage from '../portals/public/pages/JoinOrganizationPage';
import { PlayerLayout } from '../portals/player/layout/PlayerLayout';
import { DashboardPage as PlayerDashboardPage } from '../portals/player/pages/DashboardPage';
import { OrganizerLayout } from '../portals/organizer/layout/OrganizerLayout';
import { OrganizerDashboardPage } from '../portals/organizer/pages/OrganizerDashboardPage';
import { CreateOrganizationPage } from '../features/organizations/pages/CreateOrganizationPage';
import { OrganizationOverviewPage } from '../features/organizations/pages/OrganizationOverviewPage';
import { OrganizationTournamentsPage } from '../features/organizations/pages/OrganizationTournamentsPage';
import { OrganizationMembersPage } from '../features/organizations/pages/OrganizationMembersPage';
import { OrganizationBillingPage } from '../features/organizations/pages/OrganizationBillingPage';
import { OrganizationAnalyticsPage } from '../features/organizations/pages/OrganizationAnalyticsPage';
import { OrganizationSettingsPage } from '../features/organizations/pages/OrganizationSettingsPage';
import { OrganizationScoringPage } from '../features/organizations/pages/OrganizationScoringPage';
import { TournamentManagementLayout } from '../features/tournaments/layout/TournamentManagementLayout';
import { TournamentOverviewPage as OrganizerTournamentOverviewPage } from '../features/tournaments/pages/TournamentOverviewPage';
import { TournamentRegistrationsPage } from '../features/tournaments/pages/TournamentRegistrationsPage';
import { TournamentSchedulePage } from '../features/tournaments/pages/TournamentSchedulePage';
import { TournamentPrizeSetupPage } from '../features/tournaments/pages/TournamentPrizeSetupPage';
import { TournamentStaffPage } from '../features/tournaments/pages/TournamentStaffPage';
import { TournamentSettingsPage } from '../features/tournaments/pages/TournamentSettingsPage';
import { CommandCenterLayout } from '../features/command-center/layout/CommandCenterLayout';
import { TournamentCommandCenterPage } from '../features/command-center/pages/TournamentCommandCenterPage';
import { TournamentCheckInPage } from '../features/command-center/pages/TournamentCheckInPage';
import { TournamentMatchesPage } from '../features/command-center/pages/TournamentMatchesPage';
import { TournamentMatchDetailPage } from '../features/command-center/pages/TournamentMatchDetailPage';
import { TournamentScoringPage } from '../features/command-center/pages/TournamentScoringPage';
import { TournamentResultEntryPage } from '../features/command-center/pages/TournamentResultEntryPage';
import { TournamentLeaderboardPage } from '../features/command-center/pages/TournamentLeaderboardPage';
import { TournamentDisputesPage } from '../features/command-center/pages/TournamentDisputesPage';
import { TournamentDisputeDetailPage } from '../features/command-center/pages/TournamentDisputeDetailPage';
import { TournamentFinancePage } from '../features/command-center/pages/TournamentFinancePage';
import { TournamentAuditPage } from '../features/command-center/pages/TournamentAuditPage';
import { TournamentCredentialsPage } from '../features/command-center/pages/TournamentCredentialsPage';
import { TournamentAnnouncementsPage } from '../features/command-center/pages/TournamentAnnouncementsPage';
import { TournamentBroadcastPage } from '../features/command-center/pages/TournamentBroadcastPage';
import { AuthGuard } from '../features/auth/components/AuthGuard';
import { RoleGuard } from '../features/auth/components/RoleGuard';

import { AdminLayout } from '../portals/admin/layout/AdminLayout';
import { PlatformAdminDashboardPage } from '../features/admin/pages/PlatformAdminDashboardPage';
import { PlatformOrganizationsPage } from '../features/admin/pages/PlatformOrganizationsPage';
import { PlatformTournamentsPage } from '../features/admin/pages/PlatformTournamentsPage';
import CreateTournamentPage from '../portals/admin/pages/CreateTournamentPage';
import { PlatformUsersPage } from '../features/admin/pages/PlatformUsersPage';
import { PlatformDisputesPage } from '../features/admin/pages/PlatformDisputesPage';
import { PlatformGamesPage } from '../features/admin/pages/PlatformGamesPage';
import { CreateTeamPage } from '../features/teams/pages/CreateTeamPage';
import { MyTeamsPage } from '../features/teams/pages/MyTeamsPage';
import { TeamManagementPage } from '../features/teams/pages/TeamManagementPage';
import { ProfileSettingsPage } from '../features/players/pages/ProfileSettingsPage';
import { SponsorDashboardPage } from '../portals/sponsor/pages/SponsorDashboardPage';
import { ProductionLayout } from '../portals/production/layout/ProductionLayout';
import { DashboardPage as ProductionDashboardPage } from '../portals/production/pages/DashboardPage';
import { JoinByInvitePage } from '../features/teams/pages/JoinByInvitePage';
import { NotificationsPage } from '../portals/player/pages/NotificationsPage';

import { LiveControlPage } from '../portals/production/pages/LiveControlPage';
import { OverlayControlPage } from '../portals/production/pages/OverlayControlPage';
import { OBSLeaderboardPage } from '../portals/production/pages/overlays/OBSLeaderboardPage';
import { OBSTop10Page } from '../portals/production/pages/overlays/OBSTop10Page';
import { OBSMatchBarPage } from '../portals/production/pages/overlays/OBSMatchBarPage';
import { OBSSponsorPage } from '../portals/production/pages/overlays/OBSSponsorPage';
import { OBSResultPage } from '../portals/production/pages/overlays/OBSResultPage';
import { OBSFinalePage } from '../portals/production/pages/overlays/OBSFinalePage';

import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { DashboardRouter } from './DashboardRouter';

import { GlobalError } from '../components/common/GlobalError';

const routes = [
  {
    path: "/production/:tournamentId",
    element: (
      <AuthGuard requireAuth={true}>
        <RoleGuard allowedRoles={['B. Producer', 'T. Director']} redirectTo="/">
          <ProductionLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <ProductionDashboardPage />
      },
      {
        path: "live",
        element: <LiveControlPage />
      },
      {
        path: "overlays",
        element: <OverlayControlPage />
      }
    ]
  },
  {
    path: "/overlay/:tournamentId/leaderboard/:token",
    element: <OBSLeaderboardPage />
  },
  {
    path: "/overlay/:tournamentId/top10/:token",
    element: <OBSTop10Page />
  },
  {
    path: "/overlay/:tournamentId/matchbar/:token",
    element: <OBSMatchBarPage />
  },
  {
    path: "/overlay/:tournamentId/sponsor/:token",
    element: <OBSSponsorPage />
  },
  {
    path: "/overlay/:tournamentId/result/:token",
    element: <OBSResultPage />
  },
  {
    path: "/overlay/:tournamentId/finale/:token",
    element: <OBSFinalePage />
  },
  {
    path: "/sponsor/:tournamentId",
    element: (
      <AuthGuard requireAuth={true}>
        <SponsorDashboardPage />
      </AuthGuard>
    )
  },
  {
    path: "/profile/me",
    element: (
      <AuthGuard requireAuth={true}>
        <ProfileSettingsPage />
      </AuthGuard>
    )
  },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "orgs",
        element: <OrganizationsPage />,
      },
      {
        path: "orgs/:slug",
        element: <OrganizationProfilePage />,
      },
      {
        path: "organizations/:orgSlug", // Legacy support if needed
        element: <OrganizationProfilePage />,
      },
      {
        path: "teams/:teamSlug",
        element: <TeamProfilePage />,
      },
      {
        path: "profile/:username",
        element: <PlayerProfilePage />,
      },
      {
        path: "t/:tournamentSlug",
        element: <TournamentOverviewPage />,
      },
      {
        path: "t/:tournamentSlug/:tab",
        element: <TournamentOverviewPage />,
      },
      {
        path: "tournaments/:tournamentId/register",
        element: <TournamentRegistrationPage />,
      },
      {
        path: "tournaments/:tournamentId/my-registration",
        element: <MyRegistrationPage />,
      },
      {
        path: "aurora",
        element: <AuroraBackgroundDemo />,
      },
      {
        path: "docs",
        element: <DocsHomePage />,
      },
      {
        path: "docs/api",
        element: <ApiDocumentationPage />,
      },
      {
        path: "docs/errors",
        element: <ErrorReferencePage />,
      },
      {
        path: "docs/overlays",
        element: <OverlayDocumentationPage />,
      },
      {
        path: "docs/:category",
        element: <DocsArticlePage />,
      },
      {
        path: "docs/:category/:articleSlug",
        element: <DocsArticlePage />,
      }
    ],
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/render/graphic/:type/:tournamentId/:targetId",
    element: <GraphicRenderPage />
  },
  {
    path: "/join/:token",
    element: <JoinOrganizationPage />,
  },
  {
    path: "/invite/:inviteCode",
    element: <JoinByInvitePage />,
  },
  {
    path: "/auth/verify-email/:token",
    element: <VerifyEmailPage />,
  },
  {
    path: "/onboarding/username",
    element: <UsernameSetupPage />,
  },
  {
    path: "/onboarding/path",
    element: <PathSelectionPage />,
  },
  {
    path: "/onboarding/organizer",
    element: <OrganizerSetupPage />,
  },
  {
    path: "/onboarding/player",
    element: <PlayerSetupPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardRouter />,
  },
  {
    path: "/dashboard/organizer",
    element: <OrganizerLayout />,
    children: [
      {
        index: true,
        element: <OrganizerDashboardPage />
      }
    ]
  },
  {
    path: "/dashboard/player",
    element: <PlayerLayout />,
    children: [
      {
        index: true,
        element: <PlayerDashboardPage />
      }
    ]
  },
  {
    path: "/notifications",
    element: (
      <AuthGuard requireAuth={true}>
        <PlayerLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <NotificationsPage />
      }
    ]
  },
  {
    path: "/teams/my-team",
    element: (
      <AuthGuard requireAuth={true}>
        <PlayerLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <MyTeamsPage />
      }
    ]
  },
  {
    path: "/teams/create",
    element: (
      <AuthGuard requireAuth={true}>
        <CreateTeamPage />
      </AuthGuard>
    )
  },
  {
    path: "/teams/:teamSlug/manage",
    element: (
      <AuthGuard requireAuth={true}>
        <PlayerLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <TeamManagementPage />
      }
    ]
  },
  {
    path: "/organizations/create",
    element: (
      <AuthGuard requireAuth={true}>
        <CreateOrganizationPage />
      </AuthGuard>
    )
  },
  {
    path: "/organizations/:orgSlug/manage",
    element: <OrganizerLayout />,
    children: [
      {
        path: "overview",
        element: <OrganizationOverviewPage />
      },
      {
        path: "tournaments",
        element: <OrganizationTournamentsPage />
      },
      {
        path: "members",
        element: <OrganizationMembersPage />
      },
      {
        path: "billing",
        element: <OrganizationBillingPage />
      },
      {
        path: "analytics",
        element: <OrganizationAnalyticsPage />
      },
      {
        path: "scoring",
        element: <OrganizationScoringPage />
      },
      {
        path: "settings",
        element: <OrganizationSettingsPage />
      }
    ]
  },
  {
    path: "/manage/:tournamentId",
    element: <TournamentManagementLayout />,
    children: [
      {
        path: "overview",
        element: <OrganizerTournamentOverviewPage />
      },
      {
        path: "settings",
        element: <TournamentSettingsPage />
      },
      // Placeholders for future implementations mapped in UI
      {
        path: "registrations",
        element: <TournamentRegistrationsPage />
      },
      {
        path: "schedule",
        element: <TournamentSchedulePage />
      },
      {
        path: "prizes",
        element: <TournamentPrizeSetupPage />
      },
      {
        path: "staff",
        element: <TournamentStaffPage />
      }
    ]
  },
  {
    path: "/command-center/:tournamentId",
    element: <CommandCenterLayout />,
    children: [
      {
        index: true,
        element: <TournamentCommandCenterPage />
      },
      // Placeholders for future implementations mapped in UI
      {
        path: "check-in",
        element: <TournamentCheckInPage />
      },
      {
        path: "matches",
        element: <TournamentMatchesPage />
      },
      {
        path: "matches/:matchId",
        element: <TournamentMatchDetailPage />
      },
      {
        path: "scoring",
        element: <TournamentScoringPage />
      },
      {
        path: "scoring/:matchId",
        element: <TournamentResultEntryPage />
      },
      {
        path: "leaderboard",
        element: <TournamentLeaderboardPage />
      },
      {
        path: "disputes",
        element: <TournamentDisputesPage />
      },
      {
        path: "disputes/:disputeId",
        element: <TournamentDisputeDetailPage />
      },
      {
        path: "credentials",
        element: <TournamentCredentialsPage />
      },
      {
        path: "announcements",
        element: <TournamentAnnouncementsPage />
      },
      {
        path: "broadcast",
        element: <TournamentBroadcastPage />
      },
      {
        path: "finance",
        element: <TournamentFinancePage />
      },
      {
        path: "audit",
        element: <TournamentAuditPage />
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <AuthGuard requireAuth={true} requiredRole="Super Admin">
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <PlatformAdminDashboardPage />
      },
      {
        path: "organizations",
        element: <PlatformOrganizationsPage />
      },
      {
        path: "tournaments",
        element: <PlatformTournamentsPage />
      },
      {
        path: "tournaments/new",
        element: <CreateTournamentPage />
      },
      {
        path: "users",
        element: <PlatformUsersPage />
      },
      {
        path: "disputes",
        element: <PlatformDisputesPage />
      },
      {
        path: "games",
        element: <PlatformGamesPage />
      }
    ]
  }
];

const router = createBrowserRouter(
  routes.map(route => ({
    ...route,
    errorElement: route.errorElement || <GlobalError />
  }))
);

export default function App() {
  const [subdomain, setSubdomain] = useState(null);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    // Handle localhost and production domains (e.g., my-org.localhost, my-org.riftora.com)
    // We assume any hostname with more than 2 parts (or >1 part if localhost) might be a subdomain
    const parts = hostname.split('.');
    
    // Simple check: if hostname is not 'localhost' and not 'riftora.com' and not 'www.riftora.com'
    // This is basic and could be refined based on the exact deployment setup
    if (parts.length >= 2 && hostname !== 'localhost' && hostname !== 'riftora.com' && !hostname.startsWith('www.')) {
        // First part is the subdomain (e.g. my-org.localhost -> my-org)
        // Ensure we don't treat '127.0.0.1' or IPs as subdomains
        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
            setSubdomain(parts[0]);
        }
    }
  }, []);

  if (subdomain) {
    return <SubdomainApp subdomain={subdomain} />;
  }

  return <RouterProvider router={router} />;
}