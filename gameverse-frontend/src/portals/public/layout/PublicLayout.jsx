import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { GlobalHeader } from '../../../components/landing/GlobalHeader';
import { GlobalFooter } from '../../../components/landing/GlobalFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-blue-500/30 font-sans">
      <GlobalHeader />
      <main>
        <Outlet />
      </main>
      <GlobalFooter />
      <ScrollRestoration />
    </div>
  );
}
