import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useOrganizationBySubdomainQuery } from '../features/organizations/api/useOrganizationQueries';
import { PublicLayout } from '../portals/public/layout/PublicLayout';
import OrganizationProfilePage from '../portals/public/pages/OrganizationProfilePage';
import { TournamentOverviewPage } from '../portals/public/pages/TournamentOverviewPage';
import { GlobalError } from '../components/common/GlobalError';

export const OrgSubdomainContext = React.createContext(null);

export function SubdomainApp({ subdomain }) {
  const { data: org, isLoading, error } = useOrganizationBySubdomainQuery(subdomain);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#071426] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="flex min-h-screen bg-[#071426] items-center justify-center flex-col text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Organization Not Found</h2>
        <p className="text-slate-400 max-w-md">The organization subdomain <strong>{subdomain}</strong> does not exist or might be private.</p>
        <a href={`http://localhost:5173`} className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">
          Return to main site
        </a>
      </div>
    );
  }

  const subdomainRoutes = [
    {
      path: "/",
      element: <PublicLayout />, 
      errorElement: <GlobalError />,
      children: [
        {
          index: true,
          element: <OrganizationProfilePage />
        },
        {
          path: "t/:tournamentSlug",
          element: <TournamentOverviewPage />
        },
        {
          path: "t/:tournamentSlug/:tab",
          element: <TournamentOverviewPage />
        },
        {
          path: "*",
          element: <Navigate to="/" replace />
        }
      ]
    }
  ];

  const router = createBrowserRouter(subdomainRoutes);

  return (
    <OrgSubdomainContext.Provider value={org.orgSlug}>
      <RouterProvider router={router} />
    </OrgSubdomainContext.Provider>
  );
}
