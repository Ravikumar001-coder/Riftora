import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PlayerSidebar } from '../components/PlayerSidebar';
import { PlayerHeader } from '../components/PlayerHeader';
import { AuthGuard } from '../../../features/auth/components/AuthGuard';
import { AuroraBackground } from '../../../components/ui/aurora-background';

export function PlayerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  return (
    <AuthGuard requireAuth={true}>
      <AuroraBackground className="h-screen overflow-hidden text-slate-300" showRadialGradient={true}>
        <div className="flex w-full flex-1 min-h-0">
          <PlayerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 z-40">
              <PlayerHeader onMenuClick={() => setSidebarOpen(true)} isScrolled={isScrolled} />
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
      </AuroraBackground>
    </AuthGuard>
  );
}
