import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductionHeader } from '../layout/ProductionHeader';
import { BroadcastStatusBanner } from '../components/BroadcastStatusBanner';
import { KPICards } from '../components/KPICards';
import { CurrentMatchCard } from '../components/CurrentMatchCard';
import { NextMatchCard } from '../components/NextMatchCard';
import { ProductionReadiness } from '../components/ProductionReadiness';
import { StreamHealth } from '../components/StreamHealth';
import { OverlayStatus } from '../components/OverlayStatus';
import { UpcomingSchedule } from '../components/UpcomingSchedule';
import { SponsorStatus } from '../components/SponsorStatus';
import { ProductionAlerts } from '../components/ProductionAlerts';
import { broadcastDashboard } from '../../../services/mockData';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  const { tournamentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData(broadcastDashboard);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading Production Data...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <ProductionHeader tournament={data.tournament} broadcastStatus={data.broadcast.status} />
      
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Top Banner Area */}
        <BroadcastStatusBanner broadcast={data.broadcast} match={data.currentMatch} />

        {/* KPI Cards Row */}
        <KPICards data={data} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Match Focus & Stream Health) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <div className="flex-1 min-h-[300px]">
               <CurrentMatchCard match={data.currentMatch} />
            </div>
            <div className="flex-1 min-h-[300px]">
               <NextMatchCard match={data.nextMatch} />
            </div>
            <div className="min-h-[250px]">
               <StreamHealth health={data.streamHealth} />
            </div>
          </div>

          {/* Center Column (Readiness & Assets) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            <div className="h-[300px]">
               <ProductionReadiness readiness={data.readiness} />
            </div>
            <div className="flex-1 min-h-[300px]">
               <OverlayStatus tournamentId={tournamentId || data.tournament?.id} />
            </div>
            <div className="flex-1 min-h-[250px]">
               <SponsorStatus sponsors={data.sponsors} />
            </div>
          </div>

          {/* Right Column (Schedule & Alerts) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="flex-1 min-h-[400px]">
               <UpcomingSchedule schedule={data.schedule} />
            </div>
            <div className="flex-1 min-h-[400px]">
               <ProductionAlerts alerts={data.alerts} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
