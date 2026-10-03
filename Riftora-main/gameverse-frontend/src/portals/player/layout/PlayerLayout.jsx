import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PlayerSidebar } from '../components/PlayerSidebar';
import { PlayerHeader } from '../components/PlayerHeader';
import { AuthGuard } from '../../../features/auth/components/AuthGuard';
export function PlayerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  return (
    <AuthGuard requireAuth={true}>
      <>
        <div className="h-screen flex w-full overflow-hidden bg-transparent text-slate-300">
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
      </>
    </AuthGuard>
  );
}
