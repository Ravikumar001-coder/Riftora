import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { OrganizerSidebar } from '../components/OrganizerSidebar';
import { OrganizerHeader } from '../components/OrganizerHeader';
import { AuthGuard } from '../../../features/auth/components/AuthGuard';
import { useAuthStore } from '../../../store/authStore';
import { useOrganizationQuery } from '../../../features/organizations/api/useOrganizationQueries';

export function OrganizerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };
  
  const { orgSlug: paramOrgSlug } = useParams();
  
  const user = useAuthStore(state => state.user);
  
  const orgRoles = user?.orgRoles || user?.org_roles || [];
  
  // Find the matching org role by slug, or default to the first one if not found
  const activeRoleObj = paramOrgSlug 
    ? orgRoles.find(r => (r.org_slug || r.orgSlug) === paramOrgSlug) || orgRoles[0]
    : orgRoles[0];

  const orgId = activeRoleObj?.org_id || activeRoleObj?.orgId;
  const hasActiveOrg = !!orgId;
  const { data: orgData } = useOrganizationQuery(orgId);
  const role = (activeRoleObj?.org_role || activeRoleObj?.orgRole)?.replace('org_', 'Org ') || 'Org Owner';

  const currentOrgSlug = paramOrgSlug || orgData?.org_slug || '';

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen overflow-hidden bg-transparent text-slate-300">
        <OrganizerSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          orgSlug={currentOrgSlug}
          role={role}
          hasActiveOrg={hasActiveOrg}
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 z-40">
            <OrganizerHeader 
               onMenuClick={() => setSidebarOpen(true)} 
               isScrolled={isScrolled} 
               hasActiveOrg={hasActiveOrg} 
            />
          </div>
          
          <main 
            className="flex-1 overflow-y-auto overflow-x-hidden relative pt-20 pb-10 px-4 sm:px-6 lg:px-8"
            onScroll={handleScroll}
          >
            <div className="mx-auto w-full max-w-[1600px] relative z-10">
              <Outlet context={{ orgId, hasActiveOrg }} />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
