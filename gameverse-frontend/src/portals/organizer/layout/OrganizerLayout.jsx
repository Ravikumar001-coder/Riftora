import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { OrganizerSidebar } from '../components/OrganizerSidebar';
import { OrganizerHeader } from '../components/OrganizerHeader';
import { AuthGuard } from '../../../features/auth/components/AuthGuard';
import { organizerDashboardData } from '../data/mockOrganizerData';

export function OrganizerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };
  
  const { orgSlug: paramOrgSlug } = useParams();
  
  // Use mock data for the layout context
  const { organization } = organizerDashboardData;
  const currentOrgSlug = paramOrgSlug || organization.slug;

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-300">
        <OrganizerSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          orgSlug={currentOrgSlug}
          role={organization.role}
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 z-40">
            <OrganizerHeader onMenuClick={() => setSidebarOpen(true)} isScrolled={isScrolled} />
          </div>
          
          <main 
            className="flex-1 overflow-y-auto overflow-x-hidden relative pt-20"
            onScroll={handleScroll}
          >
            <div className="mx-auto w-full max-w-7xl relative z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
