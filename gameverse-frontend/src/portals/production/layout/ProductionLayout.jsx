import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProductionSidebar } from './ProductionSidebar';

export function ProductionLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 selection:bg-blue-500/30">
      <ProductionSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto relative">
          {/* Subtle Background Glows for Production Aesthetic */}
          <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Content Area */}
          <div className="relative z-10 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}